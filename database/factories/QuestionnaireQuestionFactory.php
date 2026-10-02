<?php

namespace Database\Factories;

use App\Enums\QuestionTypeEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionnaireQuestionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(QuestionTypeEnum::values()),
            'label' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'order_column' => fake()->numberBetween(1, 100),
        ];
    }
}
