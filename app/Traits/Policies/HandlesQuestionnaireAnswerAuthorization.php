<?php

namespace App\Traits\Policies;

use App\Enums\QuestionnaireCloseTriggerEnum;
use App\Models\Questionnaire;
use App\Models\User;

trait HandlesQuestionnaireAnswerAuthorization
{
    /**
     * Check if a user can view their answers to a questionnaire
     * (always allowed if they have answered it before)
     */
    protected function canViewQuestionnaireAnswers(User $user, Questionnaire $questionnaire): bool
    {
        // Check if the user has already submitted answers to this questionnaire
        $userState = $questionnaire->questionnaireUserState()
            ->where('user_id', $user->id)
            ->first();

        // If user has already answered, they can always view their answers
        return $userState !== null;
    }

    /**
     * Check if a user can answer or edit a questionnaire based on close trigger rules
     */
    protected function canInteractWithQuestionnaire(User $user, Questionnaire $questionnaire): bool
    {
        // Get the user state for this questionnaire
        $userState = $questionnaire->questionnaireUserState()
            ->where('user_id', $user->id)
            ->first();

        // Get the effective close trigger - from questionnaire or from project
        $closeTrigger = $this->getEffectiveCloseTrigger($questionnaire);

        // Check if user is allowed to interact based on close trigger
        if ($closeTrigger === QuestionnaireCloseTriggerEnum::Manual) {
            // For manual trigger, check the "closed" flag
            if ($questionnaire->closed) {
                return false; // Questionnaire is manually closed
            }
        } elseif ($closeTrigger === QuestionnaireCloseTriggerEnum::Auto) {
            // For auto trigger, check if user has already answered
            if ($userState && $userState->state === 'answered') {
                return false; // User has already submitted answers
            }
        }

        return true;
    }

    /**
     * Check if a user has access to a questionnaire
     */
    protected function hasAccessToQuestionnaire(User $user, Questionnaire $questionnaire): bool
    {
        // User has direct access to the questionnaire
        if ($questionnaire->users()->where('users.id', $user->id)->exists()) {
            return true;
        }

        // User belongs to a project that has this questionnaire
        if ($questionnaire->projects()->whereHas('users', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })->exists()) {
            return true;
        }

        return false;
    }

    /**
     * Get the effective questionnaire close trigger, falling back to project if needed
     */
    protected function getEffectiveCloseTrigger(Questionnaire $questionnaire): QuestionnaireCloseTriggerEnum
    {
        // If questionnaire has its own close trigger, use that
        if ($questionnaire->questionnaire_close_trigger) {
            return $questionnaire->questionnaire_close_trigger;
        }

        // Otherwise look for the first associated project with a close trigger
        $project = $questionnaire->projects()
            ->whereNotNull('questionnaire_close_trigger')
            ->first();

        if ($project && $project->questionnaire_close_trigger) {
            return $project->questionnaire_close_trigger;
        }

        // Default to manual if neither has a setting
        return QuestionnaireCloseTriggerEnum::Manual;
    }
}
