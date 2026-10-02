<?php

namespace App\Enums;

use App\Traits\Enums\GetSelectValues;

enum QuestionTypeEnum: string
{
    use GetSelectValues;

    case Testuale = 'text';
    case Opzioni = 'options';
    case Multipla = 'multiple';
    case Voto = 'vote';
    case Titolo = 'title';

    // case File = 'file';
    // case Numerico = 'number';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
