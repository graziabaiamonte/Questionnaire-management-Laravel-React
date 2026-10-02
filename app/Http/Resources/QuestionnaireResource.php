<?php

namespace App\Http\Resources;

use App\Enums\QuestionnaireCloseTriggerEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionnaireResource extends JsonResource
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
            // 'questionnaire_close_trigger' => ($questionnaire_close_trigger = $this->questionnaire_close_trigger) ? QuestionnaireCloseTriggerEnum::from($questionnaire_close_trigger->value)->getJsonValue() : null,
            'questionnaire_close_trigger' => $this->questionnaire_close_trigger,
            'closed' => (bool) $this->closed,
            'closed_at' => $this->closed_at ? $this->closed_at->format('d/m/Y') : '',
            'order_column' => $this->order_column,
            'has_answers' => $this->questionnaireUserState()->exists(),
            'projects_list' => $this->projects->pluck('name')->implode(' - '),
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
                    'questionnaire_close_trigger' => ($questionnaire_close_trigger = $project->questionnaire_close_trigger) ? QuestionnaireCloseTriggerEnum::from($questionnaire_close_trigger->value)->getJsonValue() : null,
                ];
            }),
            'questions' => $this->questionnaireQuestions->map(function ($question) {
                return [
                    'id' => $question->id,
                    'label' => $question->label,
                    'description' => $question->description,
                    'type' => $question->type,
                    'options' => $question->questionnaireQuestionOptions,
                    'order_column' => $question->order_column,
                    'required' => $question->required,
                ];
            }),
            'questionnaire_user_state' => $this->questionnaireUserState
                ->where('user_id', auth()->id())
                ->map(function ($questionnaire_user_state) {
                    return [
                        'id' => $questionnaire_user_state->id,
                        'user_id' => $questionnaire_user_state->user_id,
                        'questionnaire_id' => $questionnaire_user_state->questionnaire_id,
                        'state' => $questionnaire_user_state->state,
                    ];
                }),
        ];
    }
}
