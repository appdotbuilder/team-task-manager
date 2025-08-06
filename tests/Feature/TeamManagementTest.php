<?php

namespace Tests\Feature;

use App\Models\Division;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TeamManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_welcome_page_loads(): void
    {
        $response = $this->get('/');
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($assert) => $assert->component('welcome'));
    }

    public function test_manager_can_create_task(): void
    {
        $manager = User::factory()->create(['role' => 'manager']);
        $division = Division::factory()->create();
        
        $this->actingAs($manager);
        
        $response = $this->post('/tasks', [
            'name' => 'Test Task',
            'description' => 'Test Description',
            'image' => UploadedFile::fake()->image('test.jpg'),
            'due_date' => now()->addDays(7)->format('Y-m-d'),
            'priority_level' => 'high',
            'assignment_type' => 'division',
            'assigned_division_id' => $division->id,
            'initial_time_estimates' => [4, 6, 8],
        ]);
        
        $response->assertSessionHasNoErrors();
        $response->assertRedirect();
        
        $this->assertDatabaseHas('tasks', [
            'name' => 'Test Task',
            'created_by' => $manager->id,
            'assigned_division_id' => $division->id,
        ]);
    }

    public function test_user_can_take_task(): void
    {
        $division = Division::factory()->create();
        $user = User::factory()->create([
            'role' => 'division_member',
            'division_id' => $division->id,
        ]);
        
        $manager = User::factory()->create(['role' => 'manager']);
        
        $task = Task::factory()->create([
            'status' => 'belum_dimulai',
            'assignment_type' => 'division',
            'assigned_division_id' => $division->id,
            'assigned_user_id' => null,
            'taken_by' => null,
            'created_by' => $manager->id,
        ]);
        
        $this->actingAs($user);
        
        $response = $this->post('/tasks', [
            'action' => 'take_task',
            'task_id' => $task->id,
        ]);
        
        $response->assertRedirect();
        $task->refresh();
        
        $this->assertEquals('sedang_dikerjakan', $task->status);
        $this->assertEquals($user->id, $task->taken_by);
    }

    public function test_admin_can_create_division(): void
    {
        $admin = User::factory()->create(['role' => 'administrator']);
        
        $this->actingAs($admin);
        
        $response = $this->post('/divisions', [
            'name' => 'Test Division',
            'description' => 'Test Description',
        ]);
        
        $response->assertRedirect();
        $this->assertDatabaseHas('divisions', [
            'name' => 'Test Division',
            'description' => 'Test Description',
        ]);
    }

    public function test_tasks_index_shows_relevant_tasks(): void
    {
        $manager = User::factory()->create(['role' => 'manager']);
        $division = Division::factory()->create();
        $user = User::factory()->create([
            'role' => 'division_member',
            'division_id' => $division->id,
        ]);
        
        // Create a task assigned to the division
        $task = Task::factory()->create([
            'created_by' => $manager->id,
            'assignment_type' => 'division',
            'assigned_division_id' => $division->id,
        ]);
        
        // Create a task not assigned to this division
        Task::factory()->create([
            'created_by' => $manager->id,
            'assignment_type' => 'user',
            'assigned_user_id' => User::factory()->create()->id,
        ]);
        
        $this->actingAs($user);
        
        $response = $this->get('/tasks');
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($assert) => $assert
            ->component('tasks/index')
            ->has('tasks.data', 1) // Should only see the division task
            ->where('tasks.data.0.id', $task->id)
        );
    }

    public function test_non_manager_cannot_create_task(): void
    {
        $user = User::factory()->create(['role' => 'individual_user']);
        
        $this->actingAs($user);
        
        $response = $this->get('/tasks/create');
        
        $response->assertStatus(403);
    }

    public function test_non_admin_cannot_create_division(): void
    {
        $user = User::factory()->create(['role' => 'manager']);
        
        $this->actingAs($user);
        
        $response = $this->get('/divisions/create');
        
        $response->assertStatus(403);
    }

    public function test_user_can_view_assigned_task(): void
    {
        $user = User::factory()->create(['role' => 'individual_user']);
        
        $task = Task::factory()->create([
            'assignment_type' => 'user',
            'assigned_user_id' => $user->id,
        ]);
        
        $this->actingAs($user);
        
        $response = $this->get("/tasks/{$task->id}");
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($assert) => $assert
            ->component('tasks/show')
            ->where('task.id', $task->id)
        );
    }
}