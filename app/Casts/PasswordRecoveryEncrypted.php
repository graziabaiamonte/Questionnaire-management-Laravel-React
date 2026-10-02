<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Contracts\Encryption\Encrypter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Encryption\Encrypter as LaravelEncrypter;

/**
 * Custom Cast for password recovery feature.
 *
 * Uses a separate encryption key (PASSWORD_RECOVERY_KEY) instead of APP_KEY
 * for better security isolation and key rotation capabilities.
 */
class PasswordRecoveryEncrypted implements CastsAttributes
{
    /**
     * Get the encrypter instance with dedicated password recovery key.
     */
    protected function getEncrypter(): Encrypter
    {
        $key = config('app.password_recovery_key');

        if (empty($key)) {
            throw new \RuntimeException(
                'PASSWORD_RECOVERY_KEY is not set. Generate one with: php artisan key:generate --show'
            );
        }

        // Decode the key if it's base64 encoded
        if (str_starts_with($key, 'base64:')) {
            $key = base64_decode(substr($key, 7));
        }

        return new LaravelEncrypter($key, config('app.cipher'));
    }

    /**
     * Cast the given value.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if (is_null($value)) {
            return null;
        }

        try {
            return $this->getEncrypter()->decrypt($value);
        } catch (DecryptException $e) {
            // Log the error but don't expose details
            \Log::error('Failed to decrypt password_crypt', [
                'model' => get_class($model),
                'id' => $model->getKey(),
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Prepare the given value for storage.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if (is_null($value)) {
            return null;
        }

        return $this->getEncrypter()->encrypt($value);
    }
}
