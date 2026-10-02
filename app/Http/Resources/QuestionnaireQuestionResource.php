<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionnaireQuestionResource extends JsonResource
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
            'questionnaire_id' => $this->questionnaire_id,
            'label' => $this->label,
            'type' => $this->type,
            'description' => $this->description,
            'order_column' => $this->order_column,
            'required' => $this->required,
            'options' => $this->questionnaireQuestionOptions->map(function ($option) {
                return [
                    'id' => $option->id,
                    'value' => $option->value,
                    'content' => $option->content,
                    'order_column' => $option->order_column,
                ];
            }),
        ];
    }
}
