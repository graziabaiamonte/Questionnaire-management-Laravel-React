<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UploadResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\Upload;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class UploadController extends Controller
{
    /**
     * Display a listing of the resource for a specific user.
     */
    public function index(User $user, Request $request)
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

        $projectsWithUploads = Project::whereIn('id', function ($query) use ($user) {
            $query->select('project_id')
                ->from('uploads')
                ->where('user_id', $user->id)
                ->distinct();
        })->get();

        return Inertia::render('Upload/Index', [
            'user' => UserResource::make($user),
            // 'uploads' => $baseQuery->paginate($request->get('per_page', 10)),
            'uploads' => UploadResource::collection($baseQuery->paginate($request->get('per_page', 10))),
            'applied_filters' => $request->get('filter', []),
            'projects' => $projectsWithUploads,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Upload $upload)
    {
        $upload->delete();

        return back()->with('success', 'Upload deleted successfully');
    }
}
