<?php

namespace Database\Seeders;

use App\Enums\QuestionTypeEnum;
use App\Enums\StatesEnum;
use App\Models\Questionnaire;
use App\Models\QuestionnaireUserState;
use App\Models\User;
use Illuminate\Database\Seeder;

class QuestionnaireAnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get a questionnaire (preferably one with questions)
        $questionnaire = Questionnaire::whereHas('questionnaireQuestions')
            ->with('questionnaireQuestions.questionnaireQuestionOptions')
            ->first();

        if (! $questionnaire) {
            $this->command->warn('No questionnaire with questions found. Please run QuestionnaireSeeder first.');

            return;
        }

        // Get 3 random users
        $users = User::inRandomOrder()->limit(3)->get();

        if ($users->count() < 3) {
            $this->command->warn('Not enough users found. Please run UserSeeder first.');

            return;
        }

        // Create answers for each user
        foreach ($users as $user) {
            // Create a QuestionnaireUserState for this user
            $userState = QuestionnaireUserState::create([
                'user_id' => $user->id,
                'questionnaire_id' => $questionnaire->id,
                'state' => StatesEnum::Active->value,
            ]);

            // Create answers for each question
            foreach ($questionnaire->questionnaireQuestions as $question) {
                $this->createAnswerForQuestion($question, $userState);
            }

            $this->command->info("Created answers for user: {$user->name} (ID: {$user->id})");
        }

        $this->command->info("Successfully seeded answers for 3 users to questionnaire: {$questionnaire->name}");
    }

    /**
     * Create an answer for a specific question based on its type
     */
    private function createAnswerForQuestion($question, $userState): void
    {
        $answerData = [
            'questionnaire_question_id' => $question->id,
            'questionnaire_user_state_id' => $userState->id,
        ];

        switch ($question->type) {
            case QuestionTypeEnum::Testuale->value:
                // Text answer
                $answerData['answer'] = fake()->sentence();
                break;

            case QuestionTypeEnum::Opzioni->value:
            case QuestionTypeEnum::Voto->value:
                // Single option - select one option
                if ($question->questionnaireQuestionOptions->isEmpty()) {
                    return; // Skip if no options available
                }
                $option = $question->questionnaireQuestionOptions->random();
                $answerData['questionnaire_question_option_id'] = $option->id;
                break;

            case QuestionTypeEnum::Multipla->value:
                // Multiple options - select 1-3 random options
                if ($question->questionnaireQuestionOptions->isEmpty()) {
                    return; // Skip if no options available
                }
                $selectedOptions = $question->questionnaireQuestionOptions
                    ->random(min(fake()->numberBetween(1, 3), $question->questionnaireQuestionOptions->count()));

                foreach ($selectedOptions as $option) {
                    $userState->questionnaireQuestionAnswers()->create([
                        'questionnaire_question_id' => $question->id,
                        'questionnaire_question_option_id' => $option->id,
                    ]);
                }

                return; // Exit early as we've already created the answers

                // case QuestionTypeEnum::Voto->value:
                //     // Vote answer (1-5 rating)
                //     $answerData['answer'] = (string) fake()->numberBetween(1, 5);
                //     break;

            case QuestionTypeEnum::Titolo->value:
                // Title questions don't need answers
                return;

            default:
                // Default text answer
                $answerData['answer'] = fake()->sentence();
                break;
        }

        // Create the answer
        $userState->questionnaireQuestionAnswers()->create($answerData);
    }
}
