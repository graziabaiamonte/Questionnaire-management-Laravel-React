<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

class ProjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->catchPhrase(),
            'description' => fake()->paragraph(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function ($project) {
            // Create a fake JPG file
            $fileName = fake()->uuid().'.jpg';
            $filePath = Storage::disk('projects')->path($fileName);

            $image = imagecreatetruecolor(100, 100);
            $color = imagecolorallocate($image, rand(0, 255), rand(0, 255), rand(0, 255));
            imagefill($image, 0, 0, $color);
            imagejpeg($image, $filePath);
            imagedestroy($image);

            // Add it to the "projects" media collection
            $project
                ->addMedia($filePath)
                ->toMediaCollection('projects');
        });
    }
}
