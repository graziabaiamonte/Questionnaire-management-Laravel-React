<?php

namespace App\Traits\Controllers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

// use Illuminate\Support\Facades\Storage;

trait HasUploadedFiles
{
    public function saveUploadedFile(Request $request, Model $model, string $collection = '')
    {

        $this->syncDeletedFile($request, $model, $collection);

        if ($request->file('media_upload')) {

            foreach ($request->file('media_upload') as $file) {
                $model
                    ->addMedia($file)
                    ->toMediaCollection($collection);
            }
        }

    }

    protected function syncDeletedFile(Request $request, Model $model, string $collection = '')
    {

        $media = $model->getMedia($collection);
        $uploads = collect($request->input('media'))->map(fn ($media) => $media['id'])->toArray();

        if ($media) {
            foreach ($media as $file) {
                if (empty($uploads) || ! in_array($file->id, $uploads)) {
                    $file->delete();
                }
            }
        }

    }
}
