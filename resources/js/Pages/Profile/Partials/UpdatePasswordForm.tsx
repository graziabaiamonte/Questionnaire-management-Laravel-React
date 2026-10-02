import { useRef, FormEventHandler } from 'react';
// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
import Input from '@/Components/atomica/Forms/Input';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import Success from '@/Components/atomica/Alerts/Success';

export default function UpdatePasswordForm({ className = '' }: { className?: string }) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = e => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: errors => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className='text-lg font-medium text-gray-900'>{'Update Password'}</h2>

                <p className='mt-1 text-sm text-gray-600'>
                    {'To keep your account secure, make sure to use a long and random password.'}
                </p>
            </header>

            <form onSubmit={updatePassword} className='mt-6 space-y-6'>
                <div>
                    <Input
                        label={'Current Password'}
                        id='current_password'
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={e => setData('current_password', e.target.value)}
                        type='password'
                        autoComplete='current-password'
                        error={errors.current_password}
                    />
                </div>

                <div>
                    <Input
                        label={'New Password'}
                        id='password'
                        ref={passwordInput}
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        type='password'
                        autoComplete='new-password'
                        error={errors.password}
                    />
                </div>

                <div>
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

                <div className='flex items-center gap-4'>
                    <PrimaryButton disabled={processing}>{'Save'}</PrimaryButton>

                    <Success show={recentlySuccessful} message={'Password updated'}></Success>
                </div>
            </form>
        </section>
    );
}
