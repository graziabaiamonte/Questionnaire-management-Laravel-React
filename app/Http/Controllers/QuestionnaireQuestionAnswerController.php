<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuestionnaireQuestionAnswerRequest;
use App\Http\Resources\QuestionnaireResource;
use App\Models\Questionnaire;
use App\Models\QuestionnaireQuestion;
use App\Models\QuestionnaireQuestionAnswer;
use App\Models\QuestionnaireUserState;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Inertia\Inertia;

class QuestionnaireQuestionAnswerController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

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
    public function create(Questionnaire $questionnaire)
    {
        // $questionnaire = Questionnaire::findOrFail($id);
        // $this->authorize('answer', $questionnaire);

        return Inertia::render('Users/Questionnaire/Answer', [
            'questionnaire' => QuestionnaireResource::make($questionnaire),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(QuestionnaireQuestionAnswerRequest $request)
    {
        // dd($request->all());

        $questionnaireUserState = QuestionnaireUserState::create([
            'questionnaire_id' => $request->input('questionnaire_id'),
            'state' => 'answered',
            'user_id' => auth()->id(),
        ]);

        $answers = $request->input('answers');

        $questionnaire_id = intval($request->input('questionnaire_id'));

        foreach ($answers as $questionId => $answer) {

            if (empty($answer)) {
                continue;
            }

            $questionId = intval($questionId);

            $questionnaireQuestion = QuestionnaireQuestion::find($questionId);

            switch ($questionnaireQuestion->type) {
                case 'text':
                    QuestionnaireQuestionAnswer::create([
                        'questionnaire_user_state_id' => $questionnaireUserState->id,
                        'questionnaire_question_id' => $questionId,
                        'answer' => $answer,
                    ]);
                    break;
                case 'options':
                    $answer = intval($answer);
                    QuestionnaireQuestionAnswer::create([
                        'questionnaire_user_state_id' => $questionnaireUserState->id,
                        'questionnaire_question_id' => $questionId,
                        'questionnaire_question_option_id' => $answer,
                    ]);
                    break;
                case 'vote':
                    $answer = intval($answer);
                    QuestionnaireQuestionAnswer::create([
                        'questionnaire_user_state_id' => $questionnaireUserState->id,
                        'questionnaire_question_id' => $questionId,
                        'questionnaire_question_option_id' => $answer,
                    ]);
                    break;
                case 'multiple':
                    foreach ($answer as $optionId) {
                        $optionId = intval($optionId);
                        QuestionnaireQuestionAnswer::create([
                            'questionnaire_user_state_id' => $questionnaireUserState->id,
                            'questionnaire_question_id' => $questionId,
                            'questionnaire_question_option_id' => $optionId,
                        ]);
                    }
                    break;
            }

        }

        return redirect()->route('userquestionnaire.edit', $questionnaire_id)
            ->with('success', 'Answers saved successfully');
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
    public function edit(Questionnaire $questionnaire)
    {

        $questionnaire_user_state = questionnaireUserState::where('questionnaire_id', intval($questionnaire->id))
            ->where('user_id', auth()->id())
            ->first();

        $answers = $questionnaire_user_state->questionnaireQuestionAnswers;

        $canEdit = auth()->user()->can('editAnswer', $questionnaire);

        return Inertia::render('Users/Questionnaire/Edit', [
            'questionnaire' => QuestionnaireResource::make($questionnaire),
            'answers' => $answers,
            'canEdit' => $canEdit,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(QuestionnaireQuestionAnswerRequest $request, Questionnaire $questionnaire)
    {

        $answers = $request->input('answers');

        // dd($answers);

        $questionnaire_user_state = questionnaireUserState::where('questionnaire_id', intval($questionnaire->id))
            ->where('user_id', auth()->id())
            ->first();

        $questionnaire_user_state_id = intval($questionnaire_user_state->id);

        foreach ($answers as $questionId => $answer) {

            $questionId = intval($questionId);

            $questionnaireQuestion = QuestionnaireQuestion::find($questionId);

            switch ($questionnaireQuestion->type) {
                case 'text':
                    $existingAnswer = QuestionnaireQuestionAnswer::where('questionnaire_user_state_id', $questionnaire_user_state_id)
                        ->where('questionnaire_question_id', $questionId)
                        ->first();

                    if ($existingAnswer) {
                        if (! empty($answer)) {
                            $existingAnswer->update(['answer' => $answer]);
                        } else {
                            // If the answer is empty, delete the existing answer
                            $existingAnswer->delete();
                        }
                    } else {
                        QuestionnaireQuestionAnswer::create([
                            'questionnaire_user_state_id' => $questionnaire_user_state_id,
                            'questionnaire_question_id' => $questionId,
                            'answer' => $answer,
                        ]);
                    }
                    break;
                case 'options':
                    if (is_array($answer)) {
                        $answer = $answer[0];
                    }

                    $answer = intval($answer);

                    $existingAnswer = QuestionnaireQuestionAnswer::where('questionnaire_user_state_id', $questionnaire_user_state_id)
                        ->where('questionnaire_question_id', $questionId)
                        ->first();

                    if ($existingAnswer) {
                        $existingAnswer->update(['questionnaire_question_option_id' => $answer]);
                    } else {
                        QuestionnaireQuestionAnswer::create([
                            'questionnaire_user_state_id' => $questionnaire_user_state_id,
                            'questionnaire_question_id' => $questionId,
                            'questionnaire_question_option_id' => $answer,
                        ]);
                    }
                    break;
                case 'vote':
                    if (is_array($answer)) {
                        $answer = $answer[0];
                    }

                    $answer = intval($answer);

                    $existingAnswer = QuestionnaireQuestionAnswer::where('questionnaire_user_state_id', $questionnaire_user_state_id)
                        ->where('questionnaire_question_id', $questionId)
                        ->first();

                    if ($existingAnswer) {
                        $existingAnswer->update(['questionnaire_question_option_id' => $answer]);
                    } else {
                        QuestionnaireQuestionAnswer::create([
                            'questionnaire_user_state_id' => $questionnaire_user_state_id,
                            'questionnaire_question_id' => $questionId,
                            'questionnaire_question_option_id' => $answer,
                        ]);
                    }
                    break;
                case 'multiple':
                    // Get existing answers
                    $existingAnswers = QuestionnaireQuestionAnswer::where('questionnaire_user_state_id', $questionnaire_user_state_id)
                        ->where('questionnaire_question_id', $questionId)
                        ->pluck('questionnaire_question_option_id')
                        ->toArray();

                    // Find answers to delete and to add
                    $answersToDelete = array_diff($existingAnswers, $answer);
                    $answersToAdd = array_diff($answer, $existingAnswers);

                    // Delete only answers that are not in the new selection
                    if (! empty($answersToDelete)) {
                        QuestionnaireQuestionAnswer::where('questionnaire_user_state_id', $questionnaire_user_state_id)
                            ->where('questionnaire_question_id', $questionId)
                            ->whereIn('questionnaire_question_option_id', $answersToDelete)
                            ->delete();
                    }

                    // Add only new answers
                    if (! empty($answersToAdd)) {
                        foreach ($answersToAdd as $optionId) {
                            $optionId = intval($optionId);

                            QuestionnaireQuestionAnswer::create([
                                'questionnaire_user_state_id' => $questionnaire_user_state_id,
                                'questionnaire_question_id' => $questionId,
                                'questionnaire_question_option_id' => $optionId,
                            ]);
                        }
                    }
                    break;
            }

        }

        return redirect()->route('userquestionnaire.edit', $questionnaire->id)
            ->with('success', 'Answers updated successfully');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
