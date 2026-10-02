<?php

namespace Database\Seeders;

use App\Enums\QuestionTypeEnum;
use App\Models\Category;
use App\Models\Project;
use App\Models\Questionnaire;
use App\Models\User;
use Illuminate\Database\Seeder;

class QuestionnaireSeeder extends Seeder
{
    public function run(): void
    {
        Questionnaire::factory(5)->create()->each(function ($questionnaire) {
            // Assign random categories, users and projects
            $questionnaire->categories()->attach(
                Category::inRandomOrder()->limit(2)->pluck('id')
            );

            $questionnaire->users()->attach(
                User::inRandomOrder()->limit(2)->pluck('id')
            );

            $questionnaire->projects()->attach(
                Project::inRandomOrder()->limit(2)->pluck('id')
            );

            // Create at least one question of each type
            $orderColumn = 1;
            foreach (QuestionTypeEnum::cases() as $typeEnum) {
                $type = $typeEnum->value;

                $question = $questionnaire->questionnaireQuestions()->create([
                    'type' => $type,
                    'label' => fake()->sentence(),
                    'description' => fake()->paragraph(),
                    'order_column' => $orderColumn++,
                ]);

                // Create options for questions of type 'options' or 'multiple'
                if (in_array($type, [QuestionTypeEnum::Opzioni->value, QuestionTypeEnum::Multipla->value])) {
                    collect(range(1, 4))->each(function ($optionIndex) use ($question) {
                        $question->questionnaireQuestionOptions()->create([
                            'content' => fake()->word(),
                            'order_column' => $optionIndex,
                        ]);
                    });
                }

                // Create options for questions of type 'vote' with values 1, 2, 3
                if ($type === QuestionTypeEnum::Voto->value) {
                    collect([1, 2, 3])->each(function ($value) use ($question) {
                        $question->questionnaireQuestionOptions()->create([
                            'content' => (string) $value,
                            'order_column' => $value,
                        ]);
                    });
                }
            }

            // Add a few more random questions
            collect(range(1, 3))->each(function () use ($questionnaire, &$orderColumn) {
                $type = fake()->randomElement(QuestionTypeEnum::values());

                $question = $questionnaire->questionnaireQuestions()->create([
                    'type' => $type,
                    'label' => fake()->sentence(),
                    'description' => fake()->paragraph(),
                    'order_column' => $orderColumn++,
                ]);

                // Create options for questions of type 'options' or 'multiple'
                if (in_array($type, [QuestionTypeEnum::Opzioni->value, QuestionTypeEnum::Multipla->value])) {
                    collect(range(1, 4))->each(function ($optionIndex) use ($question) {
                        $question->questionnaireQuestionOptions()->create([
                            'content' => fake()->word(),
                            'order_column' => $optionIndex,
                        ]);
                    });
                }

                // Create options for questions of type 'vote' with values 1, 2, 3
                if ($type === QuestionTypeEnum::Voto->value) {
                    collect([1, 2, 3])->each(function ($value) use ($question) {
                        $question->questionnaireQuestionOptions()->create([
                            'content' => (string) $value,
                            'order_column' => $value,
                        ]);
                    });
                }
            });
        });
    }
}
