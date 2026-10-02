<?php

namespace App\Models;

use App\Enums\QuestionnaireCloseTriggerEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Project extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = ['name', 'description', 'company_id', 'questionnaire_close_trigger'];

    protected $casts = [
        'questionnaire_close_trigger' => QuestionnaireCloseTriggerEnum::class,
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function links(): BelongsToMany
    {
        return $this->belongsToMany(Link::class, 'link_project');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_user');
    }

    public function primaryUsers(): HasMany
    {
        return $this->hasMany(User::class, 'primary_project_id');
    }

    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'document_project');
    }

    public function uploads(): HasMany
    {
        return $this->hasMany(Upload::class);
    }

    public function questionnaires(): BelongsToMany
    {
        return $this->belongsToMany(Questionnaire::class, 'project_questionnaire');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('projects')
            ->useDisk('projects')
            ->singleFile();
    }
}
