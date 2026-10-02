import { useEffect, useState, useRef, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
// import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
import Input from '@/Components/atomica/Forms/Input';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status, recaptcha_sitekey }: { status?: string; recaptcha_sitekey: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        recaptcha: '',
    });

    const [captchaLoaded, setCaptchaLoaded] = useState(false);
    const isFormSubmitted = useRef(false);

    useEffect(() => {
        if (recaptcha_sitekey) {
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
            post(route('password.email'));
            isFormSubmitted.current = false;
        }
    }, [data.recaptcha, post, isFormSubmitted]);

    // const submit: FormEventHandler = e => {
    //     e.preventDefault();

    //     post(route('password.email'));
    // };

    const submit: FormEventHandler = e => {
        e.preventDefault();

        if (captchaLoaded && window.grecaptcha) {
            // Execute reCAPTCHA v3
            window.grecaptcha.ready(() => {
                window.grecaptcha.execute(recaptcha_sitekey, { action: 'password_email' }).then((token: string) => {
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
            <Head title='Forgot Password' />

            <div className='mb-4 text-sm text-gray-600'>
                {'Enter your email address to receive a password reset link.'}
            </div>

            {status && <div className='mb-4 font-medium text-sm text-green-600'>{status}</div>}

            <form onSubmit={submit}>
                <Input
                    id='email'
                    type='email'
                    label='Email'
                    name='email'
                    value={data.email}
                    className=''
                    isFocused={true}
                    onChange={e => setData('email', e.target.value)}
                    error={errors.email}
                />

                <div className='flex items-center justify-end mt-4'>
                    <PrimaryButton className='ms-4' disabled={processing}>
                        {'Send Link'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
