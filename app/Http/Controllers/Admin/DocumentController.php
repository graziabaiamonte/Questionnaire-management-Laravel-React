<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RolesEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\DocumentRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\DocumentResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;
use App\Models\Category;
use App\Models\Document;
use App\Models\Project;
use App\Models\User;
use App\Traits\Controllers\HasUploadedFiles;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class DocumentController extends Controller
{
    use HasUploadedFiles;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $baseQuery = QueryBuilder::for(Document::class)
            ->with(['categories', 'media'])
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

        return Inertia::render('Document/Index', [
            'documents' => $baseQuery->paginate($request->get('per_page', 10)),
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
        return Inertia::render('Document/Create', [
            'categories' => CategoryResource::collection(Category::all()),
            'users' => UserResource::collection(User::role(RolesEnum::USER)->get()),
            'projects' => ProjectResource::collection(Project::all()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DocumentRequest $request)
    {
        $document = Document::create($request->except('categories', 'users', 'projects'));

        if ($request->has('categories')) {
            $categoryIds = collect($request->categories)->pluck('id')->toArray();
            $document->categories()->sync($categoryIds);
        }

        if ($request->has('users')) {
            $usersIds = collect($request->users)->pluck('id')->toArray();
            $document->users()->sync($usersIds);
        }

        if ($request->has('projects')) {
            $projectsIds = collect($request->projects)->pluck('id')->toArray();
            $document->projects()->sync($projectsIds);
        }

        $this->saveUploadedFile($request, $document, 'documents');

        return redirect()
            // ->route('category.edit', $category->id)
            ->route('document.edit', $document->id)
            ->with('success', 'Document created successfully!');
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
    public function edit(Document $document)
    {
        return Inertia::render('Document/Edit', [
            'document' => DocumentResource::make($document->load('categories'), $document->load('users'), $document->load('projects')),
            'categories_list' => CategoryResource::collection(Category::all()),
            'users_list' => UserResource::collection(User::role(RolesEnum::USER)->get()),
            'projects_list' => ProjectResource::collection(Project::all()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DocumentRequest $request, Document $document)
    {
        $document->update($request->except('categories', 'users', 'projects'));

        if ($request->has('categories')) {
            $categoryIds = collect($request->categories)
                ->pluck('value')
                ->filter()
                ->toArray();
            $document->categories()->sync($categoryIds);
        }

        if ($request->has('users')) {
            $usersIds = collect($request->users)
                ->pluck('value')
                ->filter()
                ->toArray();
            $document->users()->sync($usersIds);
        }

        if ($request->has('projects')) {
            $projectsIds = collect($request->projects)
                ->pluck('value')
                ->filter()
                ->toArray();
            $document->projects()->sync($projectsIds);
        }

        $this->saveUploadedFile($request, $document, 'documents');

        return redirect()
            ->back()
            ->with('success', 'Documento aggiornato!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        $document->categories()->sync([]);
        $document->users()->sync([]);
        $document->projects()->sync([]);
        $document->delete();

        return back()->with('success', 'Document deleted successfully');
    }
}
