<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        Project::factory(5)->create()->each(function ($project) {
            $project->update([
                'company_id' => Company::inRandomOrder()->first()->id,
            ]);
        });
    }
}
