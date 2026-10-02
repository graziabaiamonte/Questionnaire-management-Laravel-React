<?php

namespace App\Http\Requests;

use App\Enums\QuestionnaireCloseTriggerEnum;
use App\Models\Project;
use Illuminate\Validation\Rules\Enum;

// use Spatie\Permission\Traits\HasRoles;

class ProjectRequest extends BaseRequest
{
    // use HasRoles;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorizeAction($action): bool
    {
        // $user = $this->user();

        // return match ($action) {
        //     'store' => $user->can('create', Project::class),
        //     'update', 'edit', 'destroy' => $user->can($action, $this->route('project')),
        //     default => false
        // };

        return true;

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
                    'name' => ['required', 'string', 'max:255'],
                    'description' => ['nullable'],
                    'company_id' => [
                        'nullable',
                        'exists:companies,id',
                    ],
                    'questionnaire_close_trigger' => ['required', new Enum(QuestionnaireCloseTriggerEnum::class)],
                    'media_upload' => [
                        'nullable',
                        'array',
                        function ($attribute, $value, $fail) {
                            $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime',
                                'video/x-msvideo', 'video/x-flv', 'video/3gpp', 'video/x-ms-wmv', 'video/x-m4v', 'video/webm'];

                            // Verifica ogni file nell'array
                            foreach ($value as $file) {
                                if (! $file || ! method_exists($file, 'getMimeType')) {
                                    $fail($attribute.' contiene un file non valido.');

                                    return;
                                }

                                if (! in_array($file->getMimeType(), $allowedMimeTypes)) {
                                    $fail($attribute.' contiene un file in formato non supportato.');

                                    return;
                                }
                            }
                        },
                        'max:4096',
                    ],
                    'media' => ['array', 'nullable'],
                ];

            default:
                return [];
        }
    }
}
