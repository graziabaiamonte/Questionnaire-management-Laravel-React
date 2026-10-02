<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index(Request $request)
    {

        $user = User::find(Auth::user()->id);
        $project = Project::find($user->primary_project_id);

        return Inertia::render('Welcome', [
            'primary_project' => $project ? ProjectResource::make($project) : [],
        ]);
    }
}
