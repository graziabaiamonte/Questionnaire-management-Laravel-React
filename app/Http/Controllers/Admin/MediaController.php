<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaController extends Controller
{
    public function show(Media $media)
    {
        // $media = Media::findOrFail($id);

        /* da inserire il controllo per vedere se l'utente può vedere il file
        $user = Auth::user();

        if (!$user->can('view', $media)) {
            abort(403, 'Unauthorized action.');
        }*/

        return response()->file($media->getPath(), [
            'Cache-Control' => 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    public function download(Media $media)
    {
        // dd($media);
        // $media = Media::findOrFail($media->id);

        // return response()->download(
        //     $media->getPath(),
        //     $media->file_name
        // );

        /* da inserire il controllo per vedere se l'utente può vedere il file
        $user = Auth::user();

        if (!$user->can('view', $media)) {
            abort(403, 'Unauthorized action.');
        }*/

        return response()->download(
            $media->getPath(),
            $media->file_name,
            [
                'Cache-Control' => 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
                'Pragma' => 'no-cache',
                'Expires' => '0',
            ]
        );
    }
}
