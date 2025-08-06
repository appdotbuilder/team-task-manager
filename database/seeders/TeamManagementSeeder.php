<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class TeamManagementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create placeholder images directories
        Storage::disk('public')->makeDirectory('task-images');
        Storage::disk('public')->makeDirectory('work-results');

        // Create a simple placeholder image (1x1 pixel)
        $placeholderImage = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAHKIAAA');
        Storage::disk('public')->put('task-images/placeholder.jpg', $placeholderImage);
        Storage::disk('public')->put('work-results/placeholder.jpg', $placeholderImage);

        // Create admin user
        $admin = User::create([
            'name' => 'Administrator',
            'email' => 'admin@teamflow.com',
            'password' => Hash::make('password'),
            'role' => 'administrator',
            'email_verified_at' => now(),
        ]);

        // Create divisions
        $divisions = Division::factory(5)->create();

        // Create managers
        $managers = User::factory(3)->create([
            'role' => 'manager',
        ]);

        // Create division members
        foreach ($divisions as $division) {
            User::factory(random_int(2, 5))->create([
                'role' => 'division_member',
                'division_id' => $division->id,
            ]);
        }

        // Create individual users
        User::factory(10)->create([
            'role' => 'individual_user',
        ]);

        // Create demo user with known credentials
        $demoManager = User::create([
            'name' => 'Demo Manager',
            'email' => 'manager@teamflow.com',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'email_verified_at' => now(),
        ]);

        $demoUser = User::create([
            'name' => 'Demo User',
            'email' => 'user@teamflow.com',
            'password' => Hash::make('password'),
            'role' => 'division_member',
            'division_id' => $divisions->first()->id,
            'email_verified_at' => now(),
        ]);

        // Create tasks assigned to divisions
        foreach ($divisions as $division) {
            Task::factory(random_int(2, 4))->create([
                'assignment_type' => 'division',
                'assigned_division_id' => $division->id,
                'assigned_user_id' => null,
                'created_by' => $managers->random()->id,
            ]);
        }

        // Create tasks assigned to individual users
        $individualUsers = User::where('role', 'individual_user')->get();
        foreach ($individualUsers->take(5) as $user) {
            Task::factory(random_int(1, 3))->create([
                'assignment_type' => 'user',
                'assigned_division_id' => null,
                'assigned_user_id' => $user->id,
                'created_by' => $managers->random()->id,
            ]);
        }

        // Create some tasks with different statuses
        Task::factory(3)->notStarted()->create([
            'assignment_type' => 'division',
            'assigned_division_id' => $divisions->first()->id,
            'assigned_user_id' => null,
            'created_by' => $demoManager->id,
        ]);

        Task::factory(2)->inProgress()->create([
            'assignment_type' => 'division',
            'assigned_division_id' => $divisions->first()->id,
            'assigned_user_id' => null,
            'created_by' => $demoManager->id,
            'taken_by' => $demoUser->id,
        ]);

        Task::factory(1)->completed()->create([
            'assignment_type' => 'user',
            'assigned_division_id' => null,
            'assigned_user_id' => $demoUser->id,
            'created_by' => $demoManager->id,
            'taken_by' => $demoUser->id,
        ]);
    }
}