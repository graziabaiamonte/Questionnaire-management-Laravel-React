<?php

namespace App\Http\Requests;

use App\Enums\RolesEnum;
use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

// use Spatie\Permission\Traits\HasRoles;

class UserRequest extends BaseRequest
{
    // use HasRoles;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorizeAction($action): bool
    {
        // $user = $this->user();

        // if ($user->hasRole(RolesEnum::ADMIN)) {
        //     return true;
        // }

        // return false;

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function validateAction($action): array
    {
        switch ($action) {
            case 'store':
                return [
                    'name' => ['required'],
                    'last_name' => ['nullable'],
                    'email' => ['required', 'email:strict', 'unique:users'],
                    'password' => ['required', 'confirmed'],
                    'password_crypt' => ['prohibited'], // Never accept from client - auto-generated server-side
                    'role' => ['required', new Enum(RolesEnum::class)],
                    'company_id' => [
                        'nullable',
                        'exists:companies,id',
                    ],
                    'projects' => 'nullable|array',
                    // 'projects.*.value' => 'required|integer|exists:projects,id',
                    'primary_project_id' => [
                        'nullable',
                        'integer',
                        'exists:projects,id',
                        function ($attribute, $value, $fail) {
                            $projectValues = collect($this->input('projects', []))->pluck('value')->toArray();
                            if (! in_array($value, $projectValues)) {
                                $fail('The primary project must be one of the selected projects.');
                            }
                        },
                    ],
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

            case 'update':
                return [
                    'name' => ['required'],
                    'last_name' => ['nullable'],
                    'email' => ['required', 'email:strict', Rule::unique(User::class)->ignore($this->id)],
                    'password' => ['confirmed'],
                    'password_crypt' => ['prohibited'], // Never accept from client - auto-generated server-side
                    'role_value' => [new Enum(RolesEnum::class)],
                    'company_id' => [
                        'nullable',
                        'exists:companies,id',
                    ],
                    'projects' => 'nullable|array',
                    // 'projects.*.value' => 'required|integer|exists:projects,id',
                    'primary_project_id' => [
                        'nullable',
                        'integer',
                        'exists:projects,id',
                        function ($attribute, $value, $fail) {
                            $projectValues = collect($this->input('projects', []))->pluck('value')->toArray();
                            if (! in_array($value, $projectValues)) {
                                $fail('The primary project must be one of the selected projects.');
                            }
                        },
                    ],
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
