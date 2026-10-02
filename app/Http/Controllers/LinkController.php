<?php

namespace App\Http\Controllers;

use App\Http\Resources\LinkResource;
use App\Http\Resources\ProjectResource;
use App\Models\Link;
use App\Models\Project;
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

        return Inertia::render('Users/Link/Index', [
            'links' => LinkResource::collection($baseQuery->paginate($request->get('per_page', 10))),
            'applied_filters' => $request->get('filter', []),
            'projects' => ProjectResource::collection(
                Project::whereHas('users', function (Builder $query) {
                    $query->where('users.id', auth()->id());
                })->get()
            ),
        ]);
    }
}
