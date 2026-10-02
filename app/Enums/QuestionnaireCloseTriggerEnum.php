<?php

namespace App\Enums;

use App\Traits\Enums\GetSelectValues;

enum QuestionnaireCloseTriggerEnum: string
{
    use GetSelectValues;

    public const AUTO = 'auto';

    public const MANUAL = 'manual';

    case Auto = self::AUTO;

    case Manual = self::MANUAL;

    public function getDescription(): string
    {
        return match ($this) {
            self::Auto => 'Automatic',
            self::Manual => 'Manual',
        };
    }
}
