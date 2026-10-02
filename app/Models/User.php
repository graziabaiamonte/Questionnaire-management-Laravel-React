<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\PermissionsEnum;
use App\Enums\RolesEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements HasMedia
{
    use HasFactory, HasRoles, InteractsWithMedia, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'last_name',
        'email',
        'password',
        'password_crypt',
        'company_id',
        'primary_project_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'password_crypt',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'password_crypt' => \App\Casts\PasswordRecoveryEncrypted::class,
        ];
    }

    public function scopeFilterByAdminRoles(Builder $query): Builder
    {
        /** @var User|null */
        $user = Auth::user();

        // Admins can see all Users types
        $hasAllPermissions = $user->can(PermissionsEnum::All->value);

        if ($hasAllPermissions) {
            return $query;
        }

        // Users can't see Admins
        if ($user->hasRole(RolesEnum::User->value)) {
            return $query->whereHas('roles', function ($query) {
                $query->where('name', RolesEnum::User->value);
            });
        }

        // Default - return empty result set
        return $query->whereRaw('false');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function links(): BelongsToMany
    {
        return $this->belongsToMany(Link::class, 'link_user');
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_user');
    }

    public function primaryProject(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'primary_project_id');
    }

    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'document_user');
    }

    public function questionnaires(): BelongsToMany
    {
        return $this->belongsToMany(Questionnaire::class, 'questionnaire_user');
    }

    public function questionnaireUserState(): HasMany
    {
        return $this->hasMany(QuestionnaireUserState::class);
    }

    public function uploads(): HasMany
    {
        return $this->hasMany(Upload::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('profiles')
            ->useDisk('profiles')
            ->singleFile();
    }
}
