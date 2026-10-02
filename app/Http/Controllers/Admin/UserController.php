<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RolesEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\CompanyResource;
use App\Http\Resources\DocumentResource;
use App\Http\Resources\LinkResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\QuestionnaireResource;
use App\Http\Resources\UserResource;
use App\Models\Company;
use App\Models\Document;
use App\Models\Link;
use App\Models\Project;
use App\Models\Questionnaire;
use App\Models\User;
use App\Traits\Controllers\HasUploadedFiles;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
    use HasUploadedFiles;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $baseQuery = QueryBuilder::for(User::class)
            ->filterByAdminRoles()
            ->where('users.id', '!=', Auth::user()->id)
            ->with(['roles', 'uploads'])
            ->select(['users.*', 'roles.name as role_name'])
            ->leftJoin('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->leftJoin('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->allowedSorts(['name', 'last_name',  'role_name'])
            ->allowedFilters([
                AllowedFilter::exact('roles.id'),
                AllowedFilter::exact('company', 'company_id'),
                AllowedFilter::callback('search', function (Builder $query, $value) {
                    $query->where(function (Builder $query) use ($value) {
                        $query->where('users.name', 'LIKE', '%'.$value.'%')
                            ->orWhere('users.last_name', 'LIKE', '%'.$value.'%');
                    });
                }),
                AllowedFilter::callback('project', function (Builder $query, $value) {
                    $query->whereHas('projects', function (Builder $query) use ($value) {
                        $query->where('projects.id', intval($value));
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

        return Inertia::render('User/Index', [
            'users' => $baseQuery->paginate($request->get('per_page', 10)),
            // NOTE: W're merging the DB roles with the Enum ones to get both id and description.
            // By passing the id, we leverage the default behaviour for relationship filters defined in the indexFilters Helper,
            // which will get/set roles.id as required above in AllowedFilter::exact('roles.id')
            'roles' => Role::all()->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'description' => RolesEnum::from($role->name) ?
                        RolesEnum::from($role->name)->getDescription() : $role->name,
                ];
            }),
            // 'roles' => RolesEnum::getJsonValues(),
            'applied_filters' => $request->get('filter', []),
            'projects' => ProjectResource::collection(Project::all()),
            'companies' => CompanyResource::collection(Company::all()),
            'documents' => DocumentResource::collection(Document::all()),
            'questionnaires' => QuestionnaireResource::collection(Questionnaire::all()),
            'links' => LinkResource::collection(Link::all()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('User/Create', [
            'roles' => RolesEnum::getJsonValues(),
            'projects' => ProjectResource::collection(Project::all()),
            'companies' => CompanyResource::collection(Company::all()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        // Explicitly exclude password_crypt to prevent tampering - it's auto-generated from password
        $user = User::create($request->except(['role', 'stores', 'password_crypt']));
        $user->assignRole(RolesEnum::from($request->get('role'))->value);

        // Store encrypted password for recovery purposes (client requirement)
        // This is encrypted by Laravel's 'encrypted' cast for security
        if ($request->filled('password')) {
            $user->password_crypt = $request->password;
            $user->save();
        }

        if ($request->has('projects')) {
            $projectsIds = collect($request->projects)
                ->pluck('value')
                ->filter()
                ->toArray();
            $user->projects()->sync($projectsIds);
        }

        $this->saveUploadedFile($request, $user, 'profiles');

        return redirect()
            ->route('user.edit', $user->id)
            ->with('success', 'User created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserRequest $request, User $user)
    {
        // password_crypt is passed only in edit view for password recovery feature (client requirement)
        // It's encrypted by Laravel and only visible to authorized admins
        return Inertia::render('User/Edit', [
            'user' => UserResource::make($user),
            'password_crypt' => $user->password_crypt,
            'roles' => RolesEnum::getJsonValues(),
            'projects_list' => ProjectResource::collection(Project::all()),
            'companies' => CompanyResource::collection(Company::all()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        // Explicitly exclude password_crypt to prevent tampering - it's auto-generated from password
        $user->update($request->except(['role_value', 'stores', 'projects', 'password_crypt']));

        // Update encrypted password only when password is changed (client requirement)
        // This is encrypted by Laravel's 'encrypted' cast for security
        if ($request->filled('password')) {
            $user->password_crypt = $request->password;
            $user->save();
        }

        if ($newRole = $request->get('role_value')) {
            $user->syncRoles([]);
            $user->assignRole(RolesEnum::from($newRole)->value);
        }

        if ($request->has('projects')) {
            $projectsIds = collect($request->projects)
                ->pluck('value')
                ->filter()
                ->toArray();
            $user->projects()->sync($projectsIds);
        }

        /*if ($request->has('primary_project_id')) {
            $primaryProjectId = intval($request->primary_project_id);
            $user->update(['primary_project_id' => $primaryProjectId]);
        }*/

        $this->saveUploadedFile($request, $user, 'profiles');

        return redirect()
            ->back()
            ->with('success', 'User saved!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserRequest $request, User $user)
    {
        $userCount = User::count();
        if ($userCount < 2) {
            return back()->withErrors('Cannot delete the last user.');
        }
        $user->links()->sync([]);
        $user->projects()->sync([]);

        $user->delete();

        return back()->with('success', 'User deleted successfully');
    }

    /**
     * Get the user's uploads
     */
    public function uploads(User $user, Request $request)
    {
        $baseQuery = QueryBuilder::for($user->uploads())
            ->with(['project', 'media'])
            ->allowedSorts(['name', 'created_at'])
            ->allowedFilters([
                AllowedFilter::callback('search', function (Builder $query, $value) {
                    $query->where(function (Builder $query) use ($value) {
                        $query->where('name', 'LIKE', '%'.$value.'%');
                    });
                }),
                AllowedFilter::callback('project', function (Builder $query, $value) {
                    $query->where('project_id', intval($value));
                }),
            ]);

        return Inertia::render('User/Uploads', [
            'user' => UserResource::make($user),
            'uploads' => $baseQuery->paginate($request->get('per_page', 10)),
            'applied_filters' => $request->get('filter', []),
            'projects' => ProjectResource::collection(Project::all()),
        ]);
    }
}
