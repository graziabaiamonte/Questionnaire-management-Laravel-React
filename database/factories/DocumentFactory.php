<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

class DocumentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(3),
            'order_column' => fake()->numberBetween(1, 100),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function ($document) {
            // Create a fake PDF file
            $fileName = fake()->uuid().'.pdf';
            $filePath = Storage::disk('documents')->path($fileName);

            file_put_contents($filePath, 'Fake PDF content');

            // Add it to the "documents" media collection
            $document
                ->addMedia($filePath)
                ->toMediaCollection('documents');
        });
    }
}
