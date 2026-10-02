<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Document;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        Document::factory(5)->create()->each(function ($document) {
            $document->categories()->attach(
                Category::inRandomOrder()->limit(2)->pluck('id')
            );

            $document->users()->attach(
                User::inRandomOrder()->limit(2)->pluck('id')
            );

            $document->projects()->attach(
                Project::inRandomOrder()->limit(2)->pluck('id')
            );
        });
    }
}
