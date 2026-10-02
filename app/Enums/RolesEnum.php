<?php

namespace App\Enums;

use App\Traits\Enums\GetSelectValues;

enum RolesEnum: string
{
    use GetSelectValues;

    public const ADMIN = 'admin';

    public const USER = 'user';

    case Admin = self::ADMIN;

    case User = self::USER;

    public function getDescription(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::User => 'User',
        };
    }
}
