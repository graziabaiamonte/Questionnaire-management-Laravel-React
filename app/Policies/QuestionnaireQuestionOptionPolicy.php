<?php

namespace App\Policies;

use App\Enums\RolesEnum;
use App\Models\QuestionnaireQuestionOption;
use App\Models\User;

class QuestionnaireQuestionOptionPolicy
{
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

    public function update(User $user, QuestionnaireQuestionOption $questionnaireQuestion): bool
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

    public function delete(User $user, QuestionnaireQuestionOption $questionnaireQuestion): bool
    {
        if ($user->hasRole(RolesEnum::ADMIN)) {
            return true;
        }

        return false;
    }

    public function edit(User $user, QuestionnaireQuestionOption $questionnaireQuestion): bool
    {
        if ($user->hasRole(RolesEnum::ADMIN)) {
            return true;
        }

        return false;
    }
}
