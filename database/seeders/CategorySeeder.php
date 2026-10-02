<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    protected $categories = [
        'Eventi',
        'Video',
        'Domande',
        'Documenti',
        'Guide',
    ];

    public function run(): void
    {
        foreach ($this->categories as $categoryName) {
            Category::create(['name' => $categoryName]);
        }
    }
}
