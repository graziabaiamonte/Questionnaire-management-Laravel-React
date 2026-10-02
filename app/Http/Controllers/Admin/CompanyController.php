<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $baseQuery = QueryBuilder::for(Company::class)
            ->allowedSorts(['name'])
            ->allowedFilters([
                AllowedFilter::callback('search', function (Builder $query, $value) {
                    $query->where(function (Builder $query) use ($value) {
                        $query->where('name', 'LIKE', '%'.$value.'%');
                    });
                }),
            ]);

        return Inertia::render('Company/Index', [
            'companies' => $baseQuery->paginate($request->get('per_page', 10)),
            'applied_filters' => $request->get('filter', []),
        ]);
    }

    public function create()
    {
        return Inertia::render('Company/Create');
    }

    public function store(CompanyRequest $request)
    {
        $company = Company::create($request->all());

        return redirect()
            ->route('company.index')
            ->with('success', 'Company creata con successo!');
    }

    public function edit(Company $company)
    {
        return Inertia::render('Company/Edit', [
            'company' => new CompanyResource($company),
        ]);
    }

    public function update(CompanyRequest $request, Company $company)
    {
        $company->update($request->all());

        return redirect()
            ->route('company.index')
            ->with('success', 'Company updated successfully!');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return redirect()
            ->route('company.index')
            ->with('success', 'Company deleted successfully!');
    }
}
