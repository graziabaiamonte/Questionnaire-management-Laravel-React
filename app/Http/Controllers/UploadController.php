<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\UploadResource;
use App\Models\Project;
use App\Models\Upload;
use App\Traits\Controllers\HasUploadedFiles;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class UploadController extends Controller
{
    use HasUploadedFiles;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $baseQuery = QueryBuilder::for(Upload::class)
            ->where('user_id', auth()->id())
            ->allowedSorts(['name'])
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

        return Inertia::render('Users/Upload/Index', [
            'uploads' => UploadResource::collection($baseQuery->paginate($request->get('per_page', 10))),
            'applied_filters' => $request->get('filter', []),
            'projects' => ProjectResource::collection(
                Project::whereHas('users', function (Builder $query) {
                    $query->where('users.id', auth()->id());
                })->get()
            ),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Users/Upload/Create', [
            'projects' => ProjectResource::collection(
                Project::whereHas('users', function (Builder $query) {
                    $query->where('users.id', auth()->id());
                })->get()
            ),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UploadRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        $upload = Upload::create($data);

        $this->saveUploadedFile($request, $upload, 'uploads');

        return redirect()
        // ->route('category.edit', $category->id)
            ->route('userupload.index')
            ->with('success', 'File uploaded successfully!');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Upload $upload)
    {
        $upload->delete();

        return back()->with('success', 'File deleted successfully');
    }
}
