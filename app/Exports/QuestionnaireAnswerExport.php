<?php

namespace App\Exports;

use App\Models\Questionnaire;
use App\Models\QuestionnaireUserState;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class QuestionnaireAnswerExport implements FromCollection, WithHeadings, WithStyles
{
    protected $questionnaire;

    public function __construct(Questionnaire $questionnaire)
    {
        $this->questionnaire = $questionnaire;
    }

    public function headings(): array
    {
        $headers = ['Nome', 'Email'];

        // Add question labels as headers, excluding title questions
        foreach ($this->questionnaire->questionnaireQuestions()->orderBy('order_column')->get() as $question) {
            if ($question->type !== 'title') {
                $headers[] = $question->label;
            }
        }

        $headers[] = 'Timestamp';

        return $headers;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    public function collection()
    {
        $rows = new Collection;

        // Get all user states for this questionnaire
        $userStates = QuestionnaireUserState::where('questionnaire_id', $this->questionnaire->id)
            ->with(['user', 'questionnaireQuestionAnswers.questionnaireQuestion', 'questionnaireQuestionAnswers.questionnaireQuestion.questionnaireQuestionOptions'])
            ->get();

        foreach ($userStates as $userState) {
            $row = [
                $userState->user->name.' '.$userState->user->last_name,
                $userState->user->email,
            ];

            // Get all questions to ensure consistent order
            $questions = $this->questionnaire->questionnaireQuestions()->orderBy('order_column')->get();

            foreach ($questions as $question) {
                // Skip title questions as they don't have answers
                if ($question->type === 'title') {
                    continue;
                }

                $answer = $userState->questionnaireQuestionAnswers
                    ->where('questionnaire_question_id', $question->id)
                    ->first();

                if (! $answer) {
                    $row[] = '';

                    continue;
                }

                // Format answer based on question type
                switch ($question->type) {
                    case 'text':
                        $row[] = $answer->answer ?? '';
                        break;
                    case 'options':
                        $option = $question->questionnaireQuestionOptions
                            ->where('id', $answer->questionnaire_question_option_id)
                            ->first();
                        $row[] = $option ? $option->content : '';
                        break;
                    case 'vote':
                        $option = $question->questionnaireQuestionOptions
                            ->where('id', $answer->questionnaire_question_option_id)
                            ->first();
                        $row[] = $option ? $option->content : '';
                        break;
                    case 'multiple':
                        $selectedOptions = $userState->questionnaireQuestionAnswers
                            ->where('questionnaire_question_id', $question->id)
                            ->pluck('questionnaire_question_option_id')
                            ->toArray();

                        $options = $question->questionnaireQuestionOptions
                            ->whereIn('id', $selectedOptions)
                            ->pluck('content')
                            ->join(', ');

                        $row[] = $options;
                        break;
                    default:
                        $row[] = '';
                }
            }

            // Add timestamp - highest updated_at from questionnaireQuestionAnswers
            $latestTimestamp = $userState->questionnaireQuestionAnswers->max('updated_at');
            $row[] = $latestTimestamp ? $latestTimestamp->format('d/m/Y H:i:s') : '';

            $rows->push($row);
        }

        return $rows;
    }
}
