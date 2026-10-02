<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionnaireQuestionAnswer extends Model
{
    protected $table = 'questionnaire_question_answer';

    protected $fillable = [
        'content',
        'questionnaire_question_id',
        'questionnaire_user_state_id',
        'questionnaire_question_option_id',
        'answer',
    ];

    // public function questionnaire(): BelongsTo
    // {
    //     return $this->belongsTo(Questionnaire::class);
    // }

    public function questionnaireQuestion(): BelongsTo
    {
        return $this->belongsTo(QuestionnaireQuestion::class);
    }

    public function questionnaireUserState(): BelongsTo
    {
        return $this->belongsTo(QuestionnaireUserState::class);
    }
}
