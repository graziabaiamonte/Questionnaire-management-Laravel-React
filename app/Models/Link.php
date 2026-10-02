<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Link extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'link',
        'credentials',
        'order_column',
    ];

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_link');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'link_user');
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'link_project');
    }
}
