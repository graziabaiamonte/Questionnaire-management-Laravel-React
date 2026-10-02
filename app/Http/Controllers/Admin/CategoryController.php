<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\DocumentResource;
use App\Http\Resources\LinkResource;
use App\Http\Resources\QuestionnaireResource;
use App\Models\Category;
use App\Models\Document;
use App\Models\Link;
use App\Models\Questionnaire;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $baseQuery = QueryBuilder::for(Category::class)
            ->allowedSorts(['name'])
            ->allowedFilters([
                AllowedFilter::callback('search', function (Builder $query, $value) {
                    $query->where(function (Builder $query) use ($value) {
                        $query->where('name', 'LIKE', '%'.$value.'%');
                    });
                }),
                AllowedFilter::callback('link', function (Builder $query, $value) {
                    $query->whereHas('links', function (Builder $query) use ($value) {
                        $query->where('links.id', intval($value));
                    });
                }),
                AllowedFilter::callback('document', function (Builder $query, $value) {
                    $query->whereHas('documents', function (Builder $query) use ($value) {
                        $query->where('documents.id', intval($value));
                    });
                }),
                AllowedFilter::callback('questionnaire', function (Builder $query, $value) {
                    $query->whereHas('questionnaires', function (Builder $query) use ($value) {
                        $query->where('questionnaires.id', intval($value));
                    });
                }),
            ]);

        return Inertia::render('Category/Index', [
            'categories' => $baseQuery->paginate($request->get('per_page', 10)),
            'applied_filters' => $request->get('filter', []),
            'links' => LinkResource::collection(Link::all()),
            'documents' => DocumentResource::collection(Document::all()),
            'questionnaires' => QuestionnaireResource::collection(Questionnaire::all()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Category/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        $category = Category::create($request->all());

        return redirect()
            // ->route('category.edit', $category->id)
            ->route('category.index', $category->id)
            ->with('success', 'Category created successfully!');
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
    public function edit(CategoryRequest $request, Category $category)
    {
        return Inertia::render('Category/Edit', [
            'category' => CategoryResource::make($category),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        $category->update($request->all());

        return redirect()
            ->back()
            ->with('success', 'Category updated!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return back()->with('success', 'Category deleted successfully');
    }
}
