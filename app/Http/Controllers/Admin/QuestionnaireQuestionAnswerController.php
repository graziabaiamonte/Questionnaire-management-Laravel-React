<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\QuestionnaireQuestionAnswerRequest;
use App\Http\Resources\QuestionnaireResource;
use App\Http\Resources\QuestionnaireUserStateResource;
use App\Models\Questionnaire;
use App\Models\QuestionnaireQuestion;
use App\Models\QuestionnaireQuestionAnswer;
use App\Models\QuestionnaireUserState;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class QuestionnaireQuestionAnswerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Questionnaire $questionnaire)
    {

        $baseQuery = QueryBuilder::for(QuestionnaireUserState::class)
            ->where('questionnaire_id', $questionnaire->id)
            ->allowedFilters([
                AllowedFilter::callback('search', function (Builder $query, $value) {
                    $query->where(function (Builder $query) use ($value) {
                        $query->where('name', 'LIKE', '%'.$value.'%');
                    });
                }),
            ]);

        return Inertia::render('Questionnaire/Answer/Index', [
            'questionnaire' => QuestionnaireResource::make($questionnaire),
            'questionnaire_user_states' => QuestionnaireUserStateResource::collection($baseQuery->paginate($request->get('per_page', 10))),
            'applied_filters' => $request->get('filter', []),
        ]);

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
    public function store(Request $request)
    {
        //
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
    public function edit(QuestionnaireUserState $questionnaireUserState)
    {
        $answers = $questionnaireUserState->questionnaireQuestionAnswers;
        $questionnaire = $questionnaireUserState->questionnaire;
        $user_questionnaire = $questionnaireUserState->user;

        return Inertia::render('Questionnaire/Answer/Edit', [
            'questionnaire_user_state' => QuestionnaireUserStateResource::make($questionnaireUserState),
            'questionnaire' => QuestionnaireResource::make($questionnaire),
            'answers' => $answers,
            'user_questionnaire' => $user_questionnaire,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(QuestionnaireQuestionAnswerRequest $request, QuestionnaireUserState $questionnaireUserState)
    {
        $answers = $request->input('answers');

        $questionnaire_user_state_id = intval($questionnaireUserState->id);

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

        return redirect()->route('questionnaireanswer.edit', $questionnaire_user_state_id)
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
