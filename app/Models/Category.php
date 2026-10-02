<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function links(): BelongsToMany
    {
        return $this->belongsToMany(Link::class, 'category_link');
    }

    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'category_document');
    }

    public function questionnaires(): BelongsToMany
    {
        return $this->belongsToMany(Questionnaire::class, 'category_questionnaire');
    }
}
