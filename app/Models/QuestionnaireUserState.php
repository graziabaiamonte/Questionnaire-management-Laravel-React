<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuestionnaireUserState extends Model
{
    protected $table = 'questionnaire_user_state';

    protected $fillable = [
        'user_id',
        'questionnaire_id',
        'state',
    ];

    public function questionnaire(): BelongsTo
    {
        return $this->belongsTo(Questionnaire::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function questionnaireQuestionAnswers(): HasMany
    {
        return $this->hasMany(QuestionnaireQuestionAnswer::class);
    }
}
