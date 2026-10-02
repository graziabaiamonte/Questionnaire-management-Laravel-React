<?php

namespace App\Http\Requests;

class UploadRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorizeAction($action): bool
    {
        // $user = $this->user();

        // return match ($action) {
        //     'store' => $user->can('create', Document::class),
        //     'update', 'edit', 'destroy' => $user->can($action, $this->route('document')),
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
                    'name' => ['required'],
                    'project_id' => 'required|integer|exists:projects,id',
                    // 'user_id' => 'required|integer|exists:users,id',
                    'media_upload' => [
                        'required',
                        'array',
                        function ($attribute, $value, $fail) {
                            $allowedMimeTypes = [
                                // Images
                                'image/jpeg', 'image/png', 'image/gif',
                                // Videos
                                'video/mp4', 'video/quicktime', 'video/x-msvideo',
                                'video/x-flv', 'video/3gpp', 'video/x-ms-wmv',
                                'video/x-m4v', 'video/webm',
                                // Documents
                                'application/pdf',
                                'application/msword',
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                // Excel
                                'application/vnd.ms-excel',
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                'text/csv',
                                // PowerPoint
                                'application/vnd.ms-powerpoint',
                                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                // Audio
                                'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3',
                                'audio/mp4', 'audio/aac',
                            ];

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
