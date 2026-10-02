<?php

namespace App\Http\Controllers\Admin;

use App\Enums\QuestionnaireCloseTriggerEnum;
use App\Enums\RolesEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectRequest;
use App\Http\Resources\CompanyResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;
use App\Models\Company;
use App\Models\Project;
use App\Models\User;
use App\Traits\Controllers\HasUploadedFiles;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ProjectController extends Controller
{
    use HasUploadedFiles;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $baseQuery = QueryBuilder::for(Project::class)
            ->allowedSorts(['name'])
            ->allowedFilters([
                AllowedFilter::exact('company', 'company_id'),
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
            ]);

        return Inertia::render('Project/Index', [
            'projects' => $baseQuery->paginate($request->get('per_page', 10)),
            'applied_filters' => $request->get('filter', []),
            'companies' => CompanyResource::collection(Company::all()),
            'users' => UserResource::collection(User::role(RolesEnum::USER)->get()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Project/Create', [
            'companies' => CompanyResource::collection(Company::all()),
            'questionnaire_close_triggers' => QuestionnaireCloseTriggerEnum::getJsonValues(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectRequest $request)
    {
        $project = Project::create($request->except('links', 'users'));

        /*if ($request->has('links')) {
            $linkIds = collect($request->links)->pluck('id')->toArray();
            $project->links()->sync($linkIds);
        }*/

        if ($request->has('users')) {
            $usersIds = collect($request->users)->pluck('id')->toArray();
            $project->users()->sync($usersIds);
        }

        $this->saveUploadedFile($request, $project, 'projects');

        return redirect()
            ->route('project.edit', $project->id)
            ->with('success', 'Project created successfully!');
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
    public function edit(Project $project)
    {
        return Inertia::render('Project/Edit', [
            'project' => ProjectResource::make($project->load('links', 'users')),
            'companies' => CompanyResource::collection(Company::all()),
            'questionnaire_close_triggers' => QuestionnaireCloseTriggerEnum::getJsonValues(),
            // 'links_list' => LinkResource::collection(Link::all()),
            // 'users_list' => UserResource::collection(User::where('status', 1)->get()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectRequest $request, Project $project)
    {
        $project->update($request->except('links', 'users'));

        /*if ($request->has('links')) {
            $linkIds = collect($request->links)
                ->pluck('value')
                ->filter()
                ->toArray();
            $project->links()->sync($linkIds);
        }*/

        if ($request->has('users')) {
            $usersIds = collect($request->users)
                ->pluck('value')
                ->filter()
                ->toArray();
            $project->users()->sync($usersIds);
        }

        $this->saveUploadedFile($request, $project, 'projects');

        return redirect()
            ->back()
            ->with('success', 'Progetto aggiornato!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $project->links()->sync([]);
        $project->users()->sync([]);
        $project->delete();

        return back()->with('success', 'Project deleted successfully');
    }
}
