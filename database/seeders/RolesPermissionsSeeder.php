<?php

namespace Database\Seeders;

use App\Enums\PermissionsEnum;
use App\Enums\RolesEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => RolesEnum::Admin->value,
                'permissions' => [
                    PermissionsEnum::All->value,
                    PermissionsEnum::ManageUsers->value,
                ],
            ],
            [
                'name' => RolesEnum::User->value,
                'permissions' => [
                    // PermissionsEnum::ManageUsers->value,
                ],
            ],
        ];

        foreach ($roles as $role) {
            $newRole = Role::firstOrcreate(['name' => $role['name']]);
            foreach ($role['permissions'] as $permission) {
                $newPerm = Permission::firstOrcreate(['name' => $permission]);
                $newRole->givePermissionTo($newPerm);
            }
        }
    }
}
