<?php

namespace App\Http\Controllers;

use App\Http\Resources\DocumentResource;
use App\Http\Resources\ProjectResource;
use App\Models\Document;
use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $baseQuery = QueryBuilder::for(Document::class)
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
            ]);

        return Inertia::render('Users/Document/Index', [
            'documents' => DocumentResource::collection($baseQuery->paginate($request->get('per_page', 10))),
            'applied_filters' => $request->get('filter', []),
            'projects' => ProjectResource::collection(
                Project::whereHas('users', function (Builder $query) {
                    $query->where('users.id', auth()->id());
                })->get()
            ),
        ]);
    }
}
