<?php

namespace App\Http\Requests;

use App\Enums\QuestionTypeEnum;
use App\Models\QuestionnaireQuestion;
use Illuminate\Validation\Rules\Enum;
use Spatie\Permission\Traits\HasRoles;

class QuestionnaireQuestionRequest extends BaseRequest
{
    use HasRoles;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorizeAction($action): bool
    {

        $user = $this->user();

        return match ($action) {
            'store' => $user->can('create', QuestionnaireQuestion::class),
            'update', 'edit', 'destroy' => $user->can($action, $this->route('questionnaire_question')),
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
                    'label' => ['required'],
                    'type' => ['required', 'string', new Enum(QuestionTypeEnum::class)],
                    // 'order_column' => ['nullable', 'integer'],
                    'questionnaire_id' => ['required', 'integer', 'exists:questionnaires,id'],
                    'options' => 'nullable|array',
                    'options.*.id' => 'nullable|integer',
                    'options.*.content' => 'required|string',
                    // 'options.*.content' => [
                    // 'required',
                    //  function ($attribute, $value, $fail) {
                    //      $type = $this->input('type');
                    //      if ($type === 'vote' && !is_numeric($value)) {
                    //          $fail("Quando il tipo di domanda è 'voto', il contenuto deve essere un numero.");
                    //      }
                    //  }
                    // ],
                    'description' => 'nullable|string',
                    'required' => [
                        'nullable',
                        'boolean',
                        function ($attribute, $value, $fail) {
                            // Title questions cannot be required
                            if ($this->input('type') === QuestionTypeEnum::Titolo->value && $value === true) {
                                $fail('Le domande di tipo "Titolo" non possono essere obbligatorie.');
                            }
                        },
                    ],
                ];

            default:
                return [];
        }
    }
}
