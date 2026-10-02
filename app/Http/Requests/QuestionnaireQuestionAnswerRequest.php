<?php

namespace App\Http\Requests;

use App\Enums\QuestionTypeEnum;
use App\Models\Questionnaire;
use App\Models\QuestionnaireQuestion;
use App\Models\QuestionnaireQuestionAnswer;
use Spatie\Permission\Traits\HasRoles;

class QuestionnaireQuestionAnswerRequest extends BaseRequest
{
    use HasRoles;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorizeAction($action): bool
    {

        $user = $this->user();

        $questionnaire_id = intval($this->questionnaire_id);
        $questionnaire = Questionnaire::find($questionnaire_id);

        // dd($this->route()->getName());
        // dd($this->route()->parameters());

        return match ($action) {
            'store' => $user->can('create', [QuestionnaireQuestionAnswer::class, $questionnaire]),
            'update' => $user->can('edit', [QuestionnaireQuestionAnswer::class, $questionnaire]),
            // 'update', 'edit', 'destroy' => $user->can($action, [QuestionnaireQuestionAnswer::class, $questionnaire]),
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

                $questionnaire = Questionnaire::find($this->questionnaire_id);
                // $totalQuestions = $questionnaire->questionnaireQuestions()->count();
                $questions = $questionnaire->questionnaireQuestions;
                // Exclude title questions from required validation since they don't need answers
                $requiredQuestionIds = $questions->where('required', true)->where('type', '!=', QuestionTypeEnum::Titolo->value)->pluck('id')->toArray();
                $textQuestions = $questions->where('type', QuestionTypeEnum::Testuale->value)->pluck('id')->toArray();
                // radioQuestions = $questions->whereIn('type', ['options', 'vote'])->pluck('id')->toArray();

                return [
                    'questionnaire_id' => ['required', 'integer', 'exists:questionnaires,id'],
                    // 'questionnaire_question_id' => ['required', 'integer', 'exists:questionnaire_question,id'],
                    // 'questionnaire_user_state_id' => ['required', 'integer'],
                    // 'questionnaire_question_option_id' => ['nullable', 'integer', 'exists:questionnaire_question_option,id'],
                    'answers' => ['required', 'array'],
                    'answers.*' => [
                        function ($attribute, $value, $fail) use ($requiredQuestionIds, $textQuestions) {
                            // Get the question ID from the attribute name (e.g., 'answers.5' -> '5')
                            $questionId = explode('.', $attribute)[1];

                            $question = QuestionnaireQuestion::find($questionId);

                            // Check if this question is required
                            if (in_array($questionId, $requiredQuestionIds)) {

                                // dd($requiredQuestionIds, $questionId, $value);

                                if (is_array($value) && empty($value)) {
                                    $fail('La domanda '.$question->label.' è obbligatoria.');
                                } elseif (is_array($value) && $value[0] === 0) {
                                    $fail('La domanda '.$question->label.' è obbligatoria.');
                                } elseif (empty($value)) {
                                    $fail('La domanda '.$question->label.' è obbligatoria.');
                                } elseif ($value === null || $value === '') {
                                    $fail('La domanda '.$question->label.' è obbligatoria.');
                                }
                            }

                            // Check text answer length (max 1500 characters)
                            if (in_array($questionId, $textQuestions) && is_string($value) && mb_strlen($value) > 1500) {
                                $fail('La risposta alla domanda '.$question->label.' non può superare 1500 caratteri.');
                            }
                        },
                    ],
                ];

            default:
                return [];
        }
    }
}
