<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\DocumentController;
use App\Http\Controllers\Admin\LinkController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\QuestionnaireController;
use App\Http\Controllers\Admin\QuestionnaireQuestionAnswerController;
use App\Http\Controllers\Admin\QuestionnaireQuestionController;
use App\Http\Controllers\Admin\QuestionnaireQuestionOptionController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DocumentController as UserDocumentController;
use App\Http\Controllers\LinkController as UserLinkController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestionnaireController as UserQuestionnaireController;
use App\Http\Controllers\QuestionnaireQuestionAnswerController as UserQuestionnaireQuestionAnswerController;
use App\Http\Controllers\UploadController as UserUploadController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {

    if (! auth()->check()) {
        return redirect()->route('login');
    }

    if (! auth()->user()->hasRole('admin')) {
        return redirect()->route('welcome');
    }

    return redirect()->route('dashboard');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'role_or_permission:admin'])->name('dashboard');

Route::get('/user-area/welcome', function () {
    return Inertia::render('Welcome');
})->middleware(['auth', 'verified'])->name('welcome');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/user-area/welcome', [WelcomeController::class, 'index'])->name('welcome');

    // admin routes
    Route::resource('user', UserController::class)
        ->middleware(['role_or_permission:admin']);

    Route::get('user/{user}/uploads', [UploadController::class, 'index'])
        ->name('user.uploads.index')
        ->middleware(['role_or_permission:admin']);

    Route::delete('uploads/{upload}', [UploadController::class, 'destroy'])
        ->name('user.uploads.destroy')
        ->middleware(['role_or_permission:admin']);

    Route::resource('company', CompanyController::class)
        ->middleware(['role_or_permission:admin']);

    Route::resource('project', ProjectController::class)
        ->middleware(['role_or_permission:admin']);

    Route::resource('category', CategoryController::class)
        ->middleware(['role_or_permission:admin']);

    Route::resource('link', LinkController::class)
        ->middleware(['role_or_permission:admin']);

    Route::resource('document', DocumentController::class)
        ->middleware(['role_or_permission:admin']);

    Route::resource('questionnaire', QuestionnaireController::class)
        ->middleware(['role_or_permission:admin']);

    Route::post('questionnaire/{questionnaire}/clone', [QuestionnaireController::class, 'clone'])
        ->name('questionnaire.clone')
        ->middleware(['role_or_permission:admin']);

    Route::resource('questionnaire-question', QuestionnaireQuestionController::class)
        ->middleware(['role_or_permission:admin']);

    Route::get('questionnaire-question/{dragging}/{target}', [QuestionnaireQuestionController::class, 'reorder'])
        ->name('questionnaire-question.reorder')
        ->middleware(['role_or_permission:admin']);

    Route::post('questionnaire-question/{questionnaireQuestion}/clone', [QuestionnaireQuestionController::class, 'clone'])
        ->name('questionnaire-question.clone')
        ->middleware(['role_or_permission:admin']);

    Route::resource('questionnaire-question-option', QuestionnaireQuestionOptionController::class)
        ->except(['index, create, show, edit, store, update'])
        ->middleware(['role_or_permission:admin']);

    Route::get('questionnaire-question-option/{dragging}/{target}', [QuestionnaireQuestionOptionController::class, 'reorder'])
        ->name('questionnaire-question-option.reorder')
        ->middleware(['role_or_permission:admin']);

    Route::get('questionnaire/answer-list/{questionnaire}', [QuestionnaireQuestionAnswerController::class, 'index'])->name('questionnaireanswer.index')
        ->middleware(['role_or_permission:admin']);

    Route::get('questionnaire/answer/{questionnaire_user_state}/edit', [QuestionnaireQuestionAnswerController::class, 'edit'])->name('questionnaireanswer.edit')
        ->middleware(['role_or_permission:admin']);

    Route::patch('questionnaire/answer/{questionnaire_user_state}/update', [QuestionnaireQuestionAnswerController::class, 'update'])
        ->name('questionnaireanswer.update')
        ->middleware(['role_or_permission:admin']);

    Route::get('questionnaire-answer/{questionnaire}/export/', [QuestionnaireController::class, 'export'])
        ->name('questionnaireanswerexport.export')
        ->middleware(['role_or_permission:admin']);

    // User routes
    Route::get('user-area/activity', [UserLinkController::class, 'index'])->name('userlink.index');

    Route::get('user-area/document', [UserDocumentController::class, 'index'])->name('userdocument.index');

    Route::get('user-area/uploads', [UserUploadController::class, 'index'])->name('userupload.index');
    Route::resource('upload', UserUploadController::class)->except(['index']);

    Route::get('user-area/questionnaire', [UserQuestionnaireController::class, 'index'])->name('userquestionnaire.index');
    Route::get('user-area/questionnaire/{questionnaire}', [UserQuestionnaireQuestionAnswerController::class, 'create'])
        ->middleware(['can:createAnswer,questionnaire'])
        ->name('userquestionnaire.answer');

    Route::get('user-area/questionnaire/{questionnaire}/edit', [UserQuestionnaireQuestionAnswerController::class, 'edit'])
        ->middleware(['can:viewAnswer,questionnaire'])
        ->name('userquestionnaire.edit');

    // il middleware dello store e update del questionnaire-answer è inserito nella requests,
    // quindi i controlli dell'inserimento e modifica sono nel QuestionnaireQuestionAnswerRequest
    Route::resource('questionnaire-answer', UserQuestionnaireQuestionAnswerController::class)->only(['store']);
    Route::patch('user-area/questionnaire-answer/{questionnaire}', [UserQuestionnaireQuestionAnswerController::class, 'update'])
        ->name('questionnaire-answer.update');

    // for showing private media
    Route::get('media/{media}', [MediaController::class, 'show'])->middleware(['can:show,media'])->name('media.show');
    Route::get('media/{media}/download', [MediaController::class, 'download'])->middleware(['can:download,media'])->name('media.download');

});

require __DIR__.'/auth.php';
