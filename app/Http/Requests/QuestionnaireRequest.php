<?php

namespace App\Http\Requests;

use App\Enums\QuestionnaireCloseTriggerEnum;
use App\Models\Questionnaire;
use Illuminate\Validation\Rules\Enum;
use Spatie\Permission\Traits\HasRoles;

class QuestionnaireRequest extends BaseRequest
{
    use HasRoles;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorizeAction($action): bool
    {
        $user = $this->user();

        return match ($action) {
            'store' => $user->can('create', Questionnaire::class),
            'update', 'edit', 'destroy' => $user->can($action, $this->route('questionnaire')),
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
                    'name' => ['required'],
                    'description' => ['nullable'],
                    'questionnaire_close_trigger' => ['nullable', new Enum(QuestionnaireCloseTriggerEnum::class)],
                    'closed' => ['boolean'],
                    'order_column' => ['integer', 'required'],
                    'categories' => 'nullable|array',
                    'categories.*.value' => 'required|integer|exists:categories,id',
                    'users' => 'nullable|array',
                    'users.*.value' => 'required|integer|exists:users,id',
                    'projects' => 'nullable|array',
                    'projects.*.value' => 'required|integer|exists:projects,id',
                ];

            default:
                return [];
        }
    }
}
