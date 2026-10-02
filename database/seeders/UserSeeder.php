<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use App\Models\Company;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'password_crypt' => 'password',
            'company_id' => Company::inRandomOrder()->first()->id,
        ]);
        $admin->assignRole(RolesEnum::Admin->value);
        $this->assignProjects($admin);

        $user = User::factory()->create([
            'name' => 'User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'password_crypt' => 'password',
            'company_id' => Company::inRandomOrder()->first()->id,
        ]);
        $user->assignRole(RolesEnum::User->value);
        $this->assignProjects($user);

        User::factory()
            ->count(4)
            ->create([
                'password' => Hash::make('password'),
                'password_crypt' => 'password',
                'company_id' => Company::inRandomOrder()->first()->id,
            ])
            ->each(function ($user) {
                $user->assignRole(RolesEnum::User->value);
                $this->assignProjects($user);
            });
    }

    private function assignProjects($user)
    {
        $projects = Project::inRandomOrder()->limit(2)->get();

        $user->projects()->attach($projects->pluck('id'));

        $user->update([
            'primary_project_id' => $projects->first()->id,
        ]);
    }
}
