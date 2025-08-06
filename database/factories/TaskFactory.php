<?php

namespace Database\Factories;

use App\Models\Division;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Task>
     */
    protected $model = Task::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $assignmentType = $this->faker->randomElement(['division', 'user']);
        $status = $this->faker->randomElement([
            'belum_dimulai',
            'sedang_dikerjakan', 
            'di_tinjau',
            'diterima',
            'selesai'
        ]);
        
        return [
            'name' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(3),
            'image_path' => 'task-images/placeholder.jpg',
            'due_date' => $this->faker->dateTimeBetween('+1 week', '+2 months'),
            'priority_level' => $this->faker->randomElement(['low', 'medium', 'high', 'urgent']),
            'status' => $status,
            'assignment_type' => $assignmentType,
            'assigned_division_id' => $assignmentType === 'division' ? Division::factory() : null,
            'assigned_user_id' => $assignmentType === 'user' ? User::factory()->state(['role' => 'individual_user']) : null,
            'created_by' => User::factory()->state(['role' => 'manager']),
            'taken_by' => $status !== 'belum_dimulai' ? User::factory() : null,
            'initial_time_estimates' => [
                $this->faker->numberBetween(2, 8),
                $this->faker->numberBetween(4, 12),
                $this->faker->numberBetween(6, 16)
            ],
            'current_time_estimate' => $status !== 'belum_dimulai' ? $this->faker->numberBetween(3, 15) : null,
            'items_completed' => $this->faker->numberBetween(0, 10),
            'work_result_image' => in_array($status, ['di_tinjau', 'diterima', 'selesai']) ? 'work-results/placeholder.jpg' : null,
        ];
    }

    /**
     * Indicate that the task hasn't started yet.
     */
    public function notStarted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'belum_dimulai',
            'taken_by' => null,
            'current_time_estimate' => null,
            'work_result_image' => null,
        ]);
    }

    /**
     * Indicate that the task is in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sedang_dikerjakan',
            'taken_by' => User::factory(),
            'current_time_estimate' => $this->faker->numberBetween(3, 15),
        ]);
    }

    /**
     * Indicate that the task is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'selesai',
            'taken_by' => User::factory(),
            'current_time_estimate' => $this->faker->numberBetween(3, 15),
            'work_result_image' => 'work-results/placeholder.jpg',
        ]);
    }
}