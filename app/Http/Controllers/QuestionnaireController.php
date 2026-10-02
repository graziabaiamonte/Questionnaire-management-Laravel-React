<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\QuestionnaireResource;
use App\Models\Category;
use App\Models\Project;
use App\Models\Questionnaire;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class QuestionnaireController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $baseQuery = QueryBuilder::for(Questionnaire::class)
            ->where(function ($query) {
                $query->whereHas('users', function (Builder $query) {
                    $query->where('users.id', auth()->id());
                })
                    ->orWhereHas('projects.users', function (Builder $query) {
                        $query->where('users.id', auth()->id());
                    });
            })
            ->allowedSorts(['name'])
            ->allowedFilters([
                AllowedFilter::callback('search', function (Builder $query, $value) {
                    $query->where(function (Builder $query) use ($value) {
                        $query->where('name', 'LIKE', '%'.$value.'%');
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

        return Inertia::render('Users/Questionnaire/Index', [
            'questionnaires' => QuestionnaireResource::collection($baseQuery->paginate($request->get('per_page', 10))),
            'applied_filters' => $request->get('filter', []),
            'projects' => ProjectResource::collection(
                Project::whereHas('users', function (Builder $query) {
                    $query->where('users.id', auth()->id());
                })->get()
            ),
            'categories' => CategoryResource::collection(Category::all()),
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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
