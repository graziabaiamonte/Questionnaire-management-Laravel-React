<?php

namespace App\Policies;

use App\Enums\RolesEnum;
use App\Models\Document;
use App\Models\Project;
use App\Models\Upload;
use App\Models\User;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaPolicy
{
    public function show(User $user, Media $media): bool
    {
        // Admin can always access media
        if ($user->hasRole(RolesEnum::ADMIN)) {
            return true;
        }

        // Media's model
        $model = $media->model;

        // For user profiles
        // user can only access their own profile media
        if ($model instanceof User) {
            return $user->id === $model->id;
        }

        // For projects
        // user can only access project media of projects they have access to
        if ($model instanceof Project) {
            return $user->projects->contains($model->id);
        }

        // For uploads
        if ($model instanceof Upload) {
            return $user->uploads->contains($model->id);
        }

        // // For documents
        // document is assigned to user
        // document is assigned to a project the user has access to
        if ($model instanceof Document) {
            return $user->documents->contains($model->id) ||
                $model->projects()->whereIn('projects.id', $user->projects->pluck('id'))->exists();
        }

        return false;
    }

    public function download(User $user, Media $media): bool
    {
        // Use the same rules as view
        return $this->show($user, $media);
    }
}
