<?php

namespace App\Policies;

use App\Enums\RolesEnum;
use App\Models\Questionnaire;
use App\Models\User;
use App\Traits\Policies\HandlesQuestionnaireAnswerAuthorization;

class QuestionnaireQuestionAnswerPolicy
{
    use HandlesQuestionnaireAnswerAuthorization;

    public function create(User $user, Questionnaire $questionnaire, ?string $role = null): bool
    {
        // // Check if the questionnaire is already answered by the user
        // if ($questionnaire->questionnaireUserState()->where('user_id', $user->id)->exists()) {
        //     return false;
        // }

        // Check close trigger rules
        if (! $this->canInteractWithQuestionnaire($user, $questionnaire)) {
            return false;
        }

        // Check if user has access to this questionnaire
        return $this->hasAccessToQuestionnaire($user, $questionnaire);
    }

    public function view(User $user, Questionnaire $questionnaire): bool
    {
        // Admin always has access
        if ($user->hasRole(RolesEnum::ADMIN)) {
            return true;
        }

        // If user has already answered this questionnaire, they can view their answers
        return $this->canViewQuestionnaireAnswers($user, $questionnaire);
    }

    public function edit(User $user, Questionnaire $questionnaire): bool
    {

        if ($user->hasRole(RolesEnum::ADMIN)) {
            return true;
        }

        // Check close trigger rules
        if (! $this->canInteractWithQuestionnaire($user, $questionnaire)) {
            return false;
        }

        // Check if the user state exists (user has already started the questionnaire)
        $userState = $questionnaire->questionnaireUserState()
            ->where('user_id', $user->id)
            ->first();

        if ($userState) {
            return true;
        }

        return false;
    }
}
