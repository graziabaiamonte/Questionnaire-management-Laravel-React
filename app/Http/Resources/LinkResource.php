<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LinkResource extends JsonResource
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
            'link' => $this->link,
            'credentials' => $this->credentials,
            'order_column' => $this->order_column,
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
            'projects_list' => $this->projects->pluck('name')->implode(' - '),
        ];
    }
}
