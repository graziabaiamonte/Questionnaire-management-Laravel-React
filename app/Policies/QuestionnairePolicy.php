<?php

namespace App\Policies;

use App\Enums\RolesEnum;
use App\Models\Questionnaire;
use App\Models\User;
use App\Traits\Policies\HandlesQuestionnaireAnswerAuthorization;

class QuestionnairePolicy
{
    use HandlesQuestionnaireAnswerAuthorization;

    public function create(User $user, ?string $role = null): bool
    {
        if ($user->hasRole(RolesEnum::ADMIN)) {
            // If user is admin, they can create any role
            return true;
        }
        // } elseif ($user->hasRole(RolesEnum::USER) && $role) {
        //     // Standard users can only create other users with USER role
        //     return $role === RolesEnum::USER;
        // }

        return false;
    }

    public function update(User $user, Questionnaire $questionnaire): bool
    {
        // Admins can edit anyone
        if ($user->hasRole(RolesEnum::ADMIN)) {
            return true;
        }

        // // Standard users can't edit admins
        // if ($user->hasRole(RolesEnum::USER)) {
        //     return ! $targetUser->hasRole(RolesEnum::ADMIN);
        // }

        return false;
    }

    public function delete(User $user, Questionnaire $questionnaire): bool
    {
        if ($user->hasRole(RolesEnum::ADMIN)) {
            return true;
        }

        return false;
    }

    public function edit(User $user, Questionnaire $questionnaire): bool
    {
        if ($user->hasRole(RolesEnum::ADMIN)) {
            return true;
        }

        return false;
    }

    public function createAnswer(User $user, Questionnaire $questionnaire): bool
    {
        // Check close trigger rules
        if (! $this->canInteractWithQuestionnaire($user, $questionnaire)) {
            return false;
        }

        // Check if user has access to this questionnaire
        return $this->hasAccessToQuestionnaire($user, $questionnaire);
    }

    public function viewAnswer(User $user, Questionnaire $questionnaire): bool
    {
        // Admin always has access
        if ($user->hasRole(RolesEnum::ADMIN)) {
            return true;
        }

        // If user has already answered this questionnaire, they can view their answers
        return $this->canViewQuestionnaireAnswers($user, $questionnaire);
    }

    public function editAnswer(User $user, Questionnaire $questionnaire): bool
    {

        // Admin always has access
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
