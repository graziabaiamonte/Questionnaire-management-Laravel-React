import { useEffect, useState, useRef, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
import Input from '@/Components/atomica/Forms/Input';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({
    token,
    email,
    recaptcha_sitekey,
}: {
    token: string;
    email: string;
    recaptcha_sitekey: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
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
            post(route('password.store'));
            isFormSubmitted.current = false;
        }
    }, [data.recaptcha, post, isFormSubmitted]);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    // const submit: FormEventHandler = e => {
    //     e.preventDefault();

    //     post(route('password.store'));
    // };

    const submit: FormEventHandler = e => {
        e.preventDefault();

        if (captchaLoaded && window.grecaptcha) {
            // Execute reCAPTCHA v3
            window.grecaptcha.ready(() => {
                window.grecaptcha.execute(recaptcha_sitekey, { action: 'password_store' }).then((token: string) => {
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
            <Head title='Reset Password' />

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
                        onChange={e => setData('email', e.target.value)}
                        error={errors.email}
                    />
                </div>

                <div className='mt-4'>
                    <Input
                        label={'Password'}
                        id='password'
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        type='password'
                        isFocused={true}
                        autoComplete='new-password'
                        error={errors.password}
                    />
                </div>

                <div className='mt-4'>
                    <Input
                        label={'Confirm Password'}
                        id='password_confirmation'
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        type='password'
                        autoComplete='new-password'
                        error={errors.password_confirmation}
                    />
                </div>

                <div className='flex items-center justify-end mt-4'>
                    <PrimaryButton className='ms-4' disabled={processing}>
                        {'Reset Password'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
