<?php

namespace App\Models;

use App\Enums\QuestionnaireCloseTriggerEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Questionnaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'order_column',
        'questionnaire_close_trigger',
        'closed',
        'closed_at',
    ];

    protected $casts = [
        'questionnaire_close_trigger' => QuestionnaireCloseTriggerEnum::class,
        'closed' => 'boolean',
        'closed_at' => 'datetime',
    ];

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_questionnaire');
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_questionnaire');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'questionnaire_user');
    }

    public function questionnaireQuestions(): HasMany
    {
        return $this->hasMany(QuestionnaireQuestion::class)->orderBy('order_column');
    }

    // public function questionnaireAnswers(): HasMany
    // {
    //     return $this->hasMany(QuestionnaireQuestionAnswer::class);
    // }

    public function questionnaireUserState(): HasMany
    {
        return $this->hasMany(QuestionnaireUserState::class);
    }
}
