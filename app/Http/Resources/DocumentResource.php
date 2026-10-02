<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
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
            'num' => '#'.$this->id,
            'value' => $this->id,
            'name' => $this->name,
            'order_column' => $this->order_column,
            'projects_list' => $this->projects->pluck('name')->implode(' - '),
            'created_at' => $this->created_at->format('d/m/Y'),
            'categories' => $this->categories->map(function ($category) {
                return [
                    'value' => $category->id,
                    'name' => $category->name,
                ];
            }),
            'users' => $this->users->map(function ($user) {
                return [
                    'value' => $user->id,
                    'name' => $user->name,
                    'full_name' => $user->name.' '.$user->last_name,
                ];
            }),
            'projects' => $this->projects->map(function ($project) {
                return [
                    'value' => $project->id,
                    'name' => $project->name,
                ];
            }),
            'media' => [...$this->getMedia('documents')->map(function ($media) {
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
