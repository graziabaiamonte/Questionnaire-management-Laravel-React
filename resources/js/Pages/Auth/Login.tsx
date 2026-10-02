import { useEffect, useState, useRef, FormEventHandler } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import Input from '@/Components/atomica/Forms/Input';

export default function Login({
    status,
    canResetPassword,
    recaptcha_sitekey,
    recaptcha_enabled = true,
}: {
    status?: string;
    canResetPassword: boolean;
    recaptcha_sitekey: string;
    recaptcha_enabled?: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        recaptcha: '',
    });

    const [captchaLoaded, setCaptchaLoaded] = useState(false);
    const isFormSubmitted = useRef(false);

    useEffect(() => {
        if (recaptcha_enabled && recaptcha_sitekey) {
            // Load the reCAPTCHA script
            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=${recaptcha_sitekey}`;
            script.async = true;
            script.defer = true;
            script.onload = () => setCaptchaLoaded(true);
            document.head.appendChild(script);
        }
    }, []);

    useEffect(() => {
        if (data.recaptcha && isFormSubmitted.current) {
            post(route('login'));
            isFormSubmitted.current = false;
        }
    }, [data.recaptcha, post, isFormSubmitted]);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = e => {
        e.preventDefault();

        if (!recaptcha_enabled) {
            post(route('login'));
            return;
        }

        if (captchaLoaded && window.grecaptcha) {
            // Execute reCAPTCHA v3
            window.grecaptcha.ready(() => {
                window.grecaptcha.execute(recaptcha_sitekey, { action: 'login' }).then((token: string) => {
                    isFormSubmitted.current = true;
                    setData('recaptcha', token);
                });
            });
        } else {
            console.error('reCAPTCHA script not loaded.');
        }
    };

    return (
        <GuestLayout>
            <Head title='Log in' />

            {status && <div className='mb-4 font-medium text-sm text-green-600'>{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <Input
                        id='email'
                        type='email'
                        label='Email'
                        name='email'
                        value={data.email}
                        className=''
                        autoComplete='username'
                        isFocused={true}
                        onChange={e => setData('email', e.target.value)}
                        error={errors.email}
                    />
                </div>

                <div className='mt-4'>
                    <Input
                        label={'Password'}
                        id='password'
                        type='password'
                        name='password'
                        value={data.password}
                        className=''
                        autoComplete='current-password'
                        onChange={e => setData('password', e.target.value)}
                        error={errors.password}
                    />
                </div>

                {errors.recaptcha && <div className='mt-4 text-sm text-red-600'>{errors.recaptcha}</div>}

                <div className='block mt-4'>
                    <label className='flex items-center'>
                        <Checkbox
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked as false)}
                        />
                        <span className='ml-2 text-sm text-gray-600'>{'Remember me'}</span>
                    </label>
                </div>

                <div className='mt-4 text-xs text-gray-400'>
                    This site is protected by reCAPTCHA and the Google{' '}
                    <a href='https://policies.google.com/privacy'>Privacy Policy</a> and{' '}
                    <a href='https://policies.google.com/terms'>Terms of Service</a> apply
                </div>

                <div className='flex items-center justify-end mt-4'>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className='underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                            {'Forgot your password?'}
                        </Link>
                    )}

                    <PrimaryButton className='ml-4' disabled={processing}>
                        {'Log in'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
