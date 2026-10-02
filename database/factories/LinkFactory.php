<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class LinkFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'link' => fake()->url(),
            'credentials' => fake()->optional()->text(),
            'order_column' => fake()->numberBetween(1, 100),
        ];
    }
}
