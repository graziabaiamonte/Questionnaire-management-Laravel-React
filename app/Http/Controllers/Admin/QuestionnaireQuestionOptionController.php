<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\QuestionnaireQuestionOptionRequest;
use App\Models\QuestionnaireQuestionOption;

class QuestionnaireQuestionOptionController extends Controller
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
    // public function store(QuestionnaireQuestionOptionRequest $request)
    // {
    //     $questionnaireQuestionOption = QuestionnaireQuestionOption::create($request->validated());
    // }

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
    // public function update(QuestionnaireQuestionOptionRequest $request, QuestionnaireQuestionOption $questionnaireQuestionOption)
    // {
    //     $questionnaireQuestionOption->update($request->validated());
    // }

    /**
     * Reorder options by moving dragging item to target position
     */
    public function reorder(QuestionnaireQuestionOption $dragging, QuestionnaireQuestionOption $target)
    {
        $questionId = $dragging->questionnaire_question_id;

        // Get all options for this question ordered by order_column
        $options = QuestionnaireQuestionOption::where('questionnaire_question_id', $questionId)
            ->orderBy('order_column')
            ->get();

        $draggingIndex = $options->search(fn ($o) => $o->id === $dragging->id);
        $targetIndex = $options->search(fn ($o) => $o->id === $target->id);

        if ($draggingIndex === false || $targetIndex === false) {
            return redirect()->back();
        }

        // Remove the dragging item from its current position
        $item = $options->pull($draggingIndex);

        // Insert it at the target position
        $options->splice($targetIndex, 0, [$item]);

        // Update order_column for all options
        $options->values()->each(function ($option, $index) {
            $option->update(['order_column' => $index + 1]);
        });

        return redirect()
            ->back()
            ->with('success', 'Options reordered successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QuestionnaireQuestionOption $questionnaireQuestionOption)
    {
        $questionnaireQuestionOption->delete();

        return redirect()
            ->back()
            ->with('success', 'Option deleted successfully!');

    }
}
