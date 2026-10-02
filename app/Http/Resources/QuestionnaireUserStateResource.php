<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionnaireUserStateResource extends JsonResource
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
            'user_fullname' => $this->user->name.' '.$this->user->last_name,
            'questionnaire_id' => $this->questionnaire_id,
            'state' => $this->state,
        ];
    }
}
