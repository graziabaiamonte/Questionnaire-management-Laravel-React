<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'recaptcha_sitekey' => config('services.recaptcha.sitekey'),
            'recaptcha_enabled' => ! app()->isLocal(),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {

        // reCAPTCHA is skipped in the local environment
        if (! app()->isLocal()) {
            $this->validateRecaptcha($request->input('recaptcha'));
        }

        $request->authenticate();

        $request->session()->regenerate();

        if (! auth()->user()->hasRole('admin') && ! auth()->user()->hasPermissionTo('manage_users')) {
            return redirect()->intended(route('welcome', absolute: false));
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Validate the reCAPTCHA token.
     */
    private function validateRecaptcha($recaptchaToken)
    {
        $response = Http::asForm()->post(config('services.recaptcha.endpoint'), [
            'secret' => config('services.recaptcha.secretkey'),
            'response' => $recaptchaToken,
        ]);

        $recaptchaResponse = $response->json();

        // If reCAPTCHA validation fails, throw an exception or return an error
        if (! $recaptchaResponse['success']) {
            throw new \Exception('reCAPTCHA verification failed.');
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
