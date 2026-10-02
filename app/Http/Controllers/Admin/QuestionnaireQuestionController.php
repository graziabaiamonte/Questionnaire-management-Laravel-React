<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\QuestionnaireQuestionRequest;
use App\Models\QuestionnaireQuestion;

class QuestionnaireQuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(QuestionnaireQuestionRequest $request)
    {
        $questionnaireQuestion = QuestionnaireQuestion::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(QuestionnaireQuestionRequest $request, QuestionnaireQuestion $questionnaireQuestion)
    {
        $request_validated = $request->validated();

        $request_options = $request_validated['options'] ?? [];

        // Remove options from the update data
        unset($request_validated['options']);

        $questionnaireQuestion->update($request_validated);

        if (! empty($request_options)) {

            foreach ($request_options as $optionData) {
                if (! empty($optionData['id'])) {
                    // Update existing option
                    $option = $questionnaireQuestion->questionnaireQuestionOptions()->find($optionData['id']);
                    if ($option) {
                        $option->update(['content' => $optionData['content']]);
                    }
                } else {
                    // Create new option
                    $questionnaireQuestion->questionnaireQuestionOptions()->create($optionData);
                }
            }

        }
    }

    /**
     * Reorder questions by moving dragging item to target position
     */
    public function reorder(QuestionnaireQuestion $dragging, QuestionnaireQuestion $target)
    {
        $questionnaireId = $dragging->questionnaire_id;

        // Get all questions for this questionnaire ordered by order_column
        $questions = QuestionnaireQuestion::where('questionnaire_id', $questionnaireId)
            ->orderBy('order_column')
            ->get();

        $draggingIndex = $questions->search(fn ($q) => $q->id === $dragging->id);
        $targetIndex = $questions->search(fn ($q) => $q->id === $target->id);

        if ($draggingIndex === false || $targetIndex === false) {
            return redirect()->back();
        }

        // Remove the dragging item from its current position
        $item = $questions->pull($draggingIndex);

        // Insert it at the target position
        $questions->splice($targetIndex, 0, [$item]);

        // Update order_column for all questions
        $questions->values()->each(function ($question, $index) {
            $question->update(['order_column' => $index + 1]);
        });

        return redirect()
            ->back()
            ->with('success', 'Questions reordered successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QuestionnaireQuestion $questionnaireQuestion)
    {
        $questionnaireQuestion->delete();

        return redirect()
            ->back()
            ->with('success', 'Question deleted successfully!');

    }

    /**
     * Clone a question with all its content and options
     */
    public function clone(QuestionnaireQuestion $questionnaireQuestion)
    {
        // Clone the question
        $clonedQuestion = $questionnaireQuestion->replicate();
        $clonedQuestion->label = $clonedQuestion->label.' (Copia)';
        $clonedQuestion->order_column = $questionnaireQuestion->questionnaire->questionnaireQuestions()->max('order_column') + 1;
        $clonedQuestion->save();

        // Clone all the options if the question has any
        foreach ($questionnaireQuestion->questionnaireQuestionOptions as $option) {
            $clonedOption = $option->replicate();
            $clonedOption->questionnaire_question_id = $clonedQuestion->id;
            $clonedOption->save();
        }

        return redirect()
            ->back()
            ->with('success', 'Domanda clonata con successo!');
    }
}
