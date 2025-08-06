<?php

namespace Database\Factories;

use App\Models\Division;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Division>
 */
class DivisionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Division>
     */
    protected $model = Division::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->randomElement([
                'Engineering',
                'Marketing',
                'Sales',
                'Human Resources',
                'Finance',
                'Operations',
                'Customer Support',
                'Design',
                'Quality Assurance',
                'Business Development'
            ]),
            'description' => $this->faker->sentence(10),
        ];
    }
}