<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Link;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class LinkSeeder extends Seeder
{
    public function run(): void
    {
        Link::factory(5)->create()->each(function ($link) {
            $link->categories()->attach(
                Category::inRandomOrder()->limit(2)->pluck('id')
            );

            $link->users()->attach(
                User::inRandomOrder()->limit(2)->pluck('id')
            );

            $link->projects()->attach(
                Project::inRandomOrder()->limit(2)->pluck('id')
            );
        });
    }
}
