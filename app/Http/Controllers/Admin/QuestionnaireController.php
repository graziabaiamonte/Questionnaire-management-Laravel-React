<?php

namespace App\Http\Controllers\Admin;

use App\Enums\QuestionnaireCloseTriggerEnum;
use App\Enums\QuestionTypeEnum;
use App\Enums\RolesEnum;
use App\Exports\QuestionnaireAnswerExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\QuestionnaireRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\QuestionnaireQuestionResource;
use App\Http\Resources\QuestionnaireResource;
use App\Http\Resources\UserResource;
use App\Models\Category;
use App\Models\Project;
use App\Models\Questionnaire;
use App\Models\QuestionnaireQuestion;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class QuestionnaireController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $baseQuery = QueryBuilder::for(Questionnaire::class)
            ->with(['categories'])
            ->allowedSorts(['name'])
            ->allowedFilters([
                AllowedFilter::callback('search', function (Builder $query, $value) {
                    $query->where(function (Builder $query) use ($value) {
                        $query->where('name', 'LIKE', '%'.$value.'%');
                    });
                }),
                AllowedFilter::callback('user', function (Builder $query, $value) {
                    $query->whereHas('users', function (Builder $query) use ($value) {
                        $query->where('users.id', intval($value));
                    });
                }),
                AllowedFilter::callback('project', function (Builder $query, $value) {
                    $query->whereHas('projects', function (Builder $query) use ($value) {
                        $query->where('projects.id', intval($value));
                    });
                }),
                AllowedFilter::callback('category', function (Builder $query, $value) {
                    $query->whereHas('categories', function (Builder $query) use ($value) {
                        $query->where('categories.id', intval($value));
                    });
                }),
            ]);

        return Inertia::render('Questionnaire/Index', [
            'questionnaires' => QuestionnaireResource::collection($baseQuery->paginate($request->get('per_page', 10))),
            'applied_filters' => $request->get('filter', []),
            'users' => UserResource::collection(User::role(RolesEnum::USER)->get()),
            'projects' => ProjectResource::collection(Project::all()),
            'categories' => CategoryResource::collection(Category::all()),
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Questionnaire/Create', [
            'questionnaire_close_triggers' => QuestionnaireCloseTriggerEnum::getJsonValues(),
            'categories' => CategoryResource::collection(Category::all()),
            'users' => UserResource::collection(User::role(RolesEnum::USER)->get()),
            'projects' => ProjectResource::collection(Project::all()),
            'questions' => [],
            'types' => [],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(QuestionnaireRequest $request)
    {
        $questionnaire = Questionnaire::create($request->except('categories', 'users', 'projects', 'closed_at'));

        if ($request->has('categories')) {
            $categoryIds = collect($request->categories)->pluck('id')->toArray();
            $questionnaire->categories()->sync($categoryIds);
        }

        if ($request->has('users')) {
            $usersIds = collect($request->users)->pluck('id')->toArray();
            $questionnaire->users()->sync($usersIds);
        }

        if ($request->has('projects')) {
            $projectsIds = collect($request->projects)->pluck('id')->toArray();
            $questionnaire->projects()->sync($projectsIds);
        }

        if ($request->input('closed')) {
            $questionnaire->closed_at = now();
            $questionnaire->save();
        }

        return redirect()
            // ->route('category.edit', $category->id)
            ->route('questionnaire.edit', $questionnaire->id)
            ->with('success', 'Questionnaire created successfully!');
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

        return Inertia::render('Questionnaire/Edit', [
            'questionnaire' => QuestionnaireResource::make($questionnaire->load('categories'), $questionnaire->load('users'), $questionnaire->load('projects')),
            'questionnaire_close_triggers' => QuestionnaireCloseTriggerEnum::getJsonValues(),
            'categories_list' => CategoryResource::collection(Category::all()),
            'users_list' => UserResource::collection(User::role(RolesEnum::USER)->get()),
            'projects_list' => ProjectResource::collection(Project::all()),
            'questions' => QuestionnaireQuestionResource::collection(QuestionnaireQuestion::where('questionnaire_id', intval($questionnaire->id))->orderby('order_column')->get()),
            'types' => QuestionTypeEnum::getJsonValues(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(QuestionnaireRequest $request, Questionnaire $questionnaire)
    {

        // $categoryIds = collect($request->categories)->pluck('value')->toArray();
        $previousCloseValue = $questionnaire->closed;

        $questionnaire->update($request->except('categories', 'users', 'projects', 'closed_at'));

        if ($request->has('categories')) {
            $categoryIds = collect($request->categories)
                ->pluck('value')
                ->filter()
                ->toArray();
            $questionnaire->categories()->sync($categoryIds);
        }

        if ($request->has('users')) {
            $usersIds = collect($request->users)
                ->pluck('value')
                ->filter()
                ->toArray();
            $questionnaire->users()->sync($usersIds);
        }

        if ($request->has('projects')) {
            $projectsIds = collect($request->projects)
                ->pluck('value')
                ->filter()
                ->toArray();
            $questionnaire->projects()->sync($projectsIds);
        }

        // dd($previousCloseValue,$request->input('closed'));

        if ($request->input('closed') && ! $previousCloseValue) {
            $questionnaire->closed_at = now();
            $questionnaire->save();
        } elseif ($previousCloseValue && ! $request->input('closed')) {
            $questionnaire->closed_at = null;
            $questionnaire->save();
        }

        return redirect()
            ->back()
            ->with('success', 'Questionario aggiornato!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Questionnaire $questionnaire)
    {
        $questionnaire->categories()->sync([]);
        $questionnaire->users()->sync([]);
        $questionnaire->projects()->sync([]);
        $questionnaire->delete();

        return back()->with('success', 'Questionnaire deleted successfully');
    }

    /**
     * Clone a questionnaire with all its questions and options
     * Excludes users and projects from the clone
     */
    public function clone(Questionnaire $questionnaire)
    {
        // Clone the questionnaire
        $clonedQuestionnaire = $questionnaire->replicate();
        $clonedQuestionnaire->name = $clonedQuestionnaire->name.' (Copia)';
        $clonedQuestionnaire->closed = false;
        $clonedQuestionnaire->closed_at = null;
        $clonedQuestionnaire->save();

        // Clone categories relationship
        $clonedQuestionnaire->categories()->sync($questionnaire->categories->pluck('id'));

        // Clone all questions
        foreach ($questionnaire->questionnaireQuestions as $question) {
            $clonedQuestion = $question->replicate();
            $clonedQuestion->questionnaire_id = $clonedQuestionnaire->id;
            $clonedQuestion->save();

            // Clone all options for this question
            foreach ($question->questionnaireQuestionOptions as $option) {
                $clonedOption = $option->replicate();
                $clonedOption->questionnaire_question_id = $clonedQuestion->id;
                $clonedOption->save();
            }
        }

        return redirect()
            ->route('questionnaire.edit', $clonedQuestionnaire->id)
            ->with('success', 'Questionario clonato con successo!');
    }

    public function export(Questionnaire $questionnaire)
    {
        return Excel::download(
            new QuestionnaireAnswerExport($questionnaire),
            'questionnaire-'.$questionnaire->id.'-answers.xlsx'
        );
    }
}
