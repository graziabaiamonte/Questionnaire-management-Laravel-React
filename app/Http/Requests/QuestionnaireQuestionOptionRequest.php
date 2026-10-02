<?php

namespace App\Http\Requests;

use App\Models\QuestionnaireQuestionOption;
use Spatie\Permission\Traits\HasRoles;

class QuestionnaireQuestionOptionRequest extends BaseRequest
{
    use HasRoles;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorizeAction($action): bool
    {

        $user = $this->user();

        // dd($this->route()->getName());
        // dd($this->route()->parameters());

        return match ($action) {
            'store' => $user->can('create', QuestionnaireQuestionOption::class),
            'update', 'edit', 'destroy' => $user->can($action, $this->route('questionnaire_question_option')),
            default => false
        };

    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function validateAction($action): array
    {
        switch ($action) {
            case 'store':
            case 'update':
                return [
                    'questionnaire_question_id' => ['required', 'integer', 'exists:questionnaire_question,id'],
                    'content' => ['required', 'string'],
                    // 'order_column' => ['nullable', 'integer'],
                ];

            default:
                return [];
        }
    }
}
