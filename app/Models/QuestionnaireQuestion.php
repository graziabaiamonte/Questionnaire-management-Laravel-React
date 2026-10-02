<?php

namespace App\Models;

use App\Enums\QuestionTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;

class QuestionnaireQuestion extends Model implements Sortable
{
    use HasFactory, SortableTrait;

    // public $timestamps = false;

    protected $table = 'questionnaire_question';

    protected $fillable = [
        'label',
        'type',
        'description',
        'questionnaire_id',
        'order_column',
        'required',
    ];

    /**
     * Set the required attribute. Title questions can never be required.
     */
    public function setRequiredAttribute($value)
    {
        // If the question type is 'title', always set required to false
        if ($this->type === QuestionTypeEnum::Titolo->value) {
            $this->attributes['required'] = false;
        } else {
            $this->attributes['required'] = $value;
        }
    }

    public function questionnaire(): BelongsTo
    {
        return $this->belongsTo(Questionnaire::class);
    }

    public function questionnaireQuestionOptions(): HasMany
    {
        return $this->hasMany(QuestionnaireQuestionOption::class)->orderBy('order_column');
    }

    public function questionnaireQuestionAnswers(): HasMany
    {
        return $this->hasMany(QuestionnaireQuestionAnswer::class);
    }
}
