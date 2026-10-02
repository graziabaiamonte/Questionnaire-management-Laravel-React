<?php

namespace App\Http\Requests;

use App\Models\Category;

// use Spatie\Permission\Traits\HasRoles;

class CategoryRequest extends BaseRequest
{
    // use HasRoles;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorizeAction($action): bool
    {
        // $user = $this->user();

        // return match ($action) {
        //     'store' => $user->can('create', Category::class),
        //     'update', 'edit', 'destroy' => $user->can($action, $this->route('category')),
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
                return [
                    'name' => ['required'],
                ];

            case 'update':
                return [
                    'name' => ['required'],
                ];

            default:
                return [];
        }

    }
}
