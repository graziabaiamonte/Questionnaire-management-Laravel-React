<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;

class QuestionnaireQuestionOption extends Model implements Sortable
{
    use HasFactory, SortableTrait;

    protected $table = 'questionnaire_question_option';

    protected $fillable = [
        'content',
        'questionnaire_question_id',
        'order_column',
    ];

    public function questionnaireQuestion(): BelongsTo
    {
        return $this->belongsTo(QuestionnaireQuestion::class);
    }
}
