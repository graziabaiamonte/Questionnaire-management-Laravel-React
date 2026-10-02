<?php

namespace App\Http\Resources;

use App\Enums\RolesEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'value' => $this->id,
            'name' => $this->name,
            'last_name' => $this->last_name,
            'full_name' => $this->name.' '.$this->last_name,
            'email' => $this->email,
            'status' => $this->status,
            'role' => ($role = $this->getRoleNames()->first()) ? RolesEnum::from($role)->getJsonValue() : null,
            'company_id' => $this->company_id,
            'projects' => $this->projects->map(function ($project) {
                return [
                    'value' => $project->id,
                    'name' => $project->name,
                ];
            }),
            'primary_project_id' => $this->primary_project_id,
            'media' => [...$this->getMedia('profiles')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'uuid' => $media->uuid,
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'mime_type' => $media->mime_type,
                    'order_column' => $media->order_column,
                    // 'original_url' => $media->getUrl(),
                    'original_url' => route('media.show', $media->id),
                ];
            })],
        ];
    }
}
