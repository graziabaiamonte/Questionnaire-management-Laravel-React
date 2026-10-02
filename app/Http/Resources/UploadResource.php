<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UploadResource extends JsonResource
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
            'project' => $this->project->name,
            'created_at' => $this->created_at->format('d/m/Y'),
            'media' => [...$this->getMedia('uploads')->map(function ($media) {
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
