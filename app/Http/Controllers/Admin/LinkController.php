<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RolesEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\LinkRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\LinkResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;
use App\Models\Category;
use App\Models\Link;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class LinkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $baseQuery = QueryBuilder::for(Link::class)
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

        return Inertia::render('Link/Index', [
            'links' => $baseQuery->paginate($request->get('per_page', 10)),
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
        return Inertia::render('Link/Create', [
            'categories' => CategoryResource::collection(Category::all()),
            'users' => UserResource::collection(User::role(RolesEnum::USER)->get()),
            'projects' => ProjectResource::collection(Project::all()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(LinkRequest $request)
    {

        $link = Link::create($request->except('categories', 'users', 'projects'));

        if ($request->has('categories')) {
            $categoryIds = collect($request->categories)->pluck('id')->toArray();
            $link->categories()->sync($categoryIds);
        }

        if ($request->has('users')) {
            $usersIds = collect($request->users)->pluck('id')->toArray();
            $link->users()->sync($usersIds);
        }

        if ($request->has('projects')) {
            $projectsIds = collect($request->projects)->pluck('id')->toArray();
            $link->projects()->sync($projectsIds);
        }

        return redirect()
            // ->route('category.edit', $category->id)
            ->route('link.edit', $link->id)
            ->with('success', 'Link created successfully!');
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
    public function edit(Link $link)
    {

        return Inertia::render('Link/Edit', [
            'link' => LinkResource::make($link->load('categories'), $link->load('users'), $link->load('projects')),
            'categories_list' => CategoryResource::collection(Category::all()),
            'users_list' => UserResource::collection(User::role(RolesEnum::USER)->get()),
            'projects_list' => ProjectResource::collection(Project::all()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(LinkRequest $request, Link $link)
    {

        // $categoryIds = collect($request->categories)->pluck('value')->toArray();

        $link->update($request->except('categories', 'users', 'projects'));

        if ($request->has('categories')) {
            $categoryIds = collect($request->categories)
                ->pluck('value')
                ->filter()
                ->toArray();
            $link->categories()->sync($categoryIds);
        }

        if ($request->has('users')) {
            $usersIds = collect($request->users)
                ->pluck('value')
                ->filter()
                ->toArray();
            $link->users()->sync($usersIds);
        }

        if ($request->has('projects')) {
            $projectsIds = collect($request->projects)
                ->pluck('value')
                ->filter()
                ->toArray();
            $link->projects()->sync($projectsIds);
        }

        return redirect()
            ->back()
            ->with('success', 'Link aggiornato!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Link $link)
    {
        $link->categories()->sync([]);
        $link->users()->sync([]);
        $link->projects()->sync([]);
        $link->delete();

        return back()->with('success', 'Link deleted successfully');
    }
}
