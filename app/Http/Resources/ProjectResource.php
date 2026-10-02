<?php

namespace App\Http\Resources;

use App\Enums\QuestionnaireCloseTriggerEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'description' => $this->description,
            'description_clean' => strip_tags($this->description),
            'company_id' => $this->company_id,
            // 'questionnaire_close_trigger' => ($questionnaire_close_trigger = $this->questionnaire_close_trigger) ? QuestionnaireCloseTriggerEnum::from($questionnaire_close_trigger->value)->getJsonValue() : null,
            'questionnaire_close_trigger' => $this->questionnaire_close_trigger,
            'media' => [...$this->getMedia('projects')->map(function ($media) {
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
