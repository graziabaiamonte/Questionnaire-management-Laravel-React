// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
import Input from '@/Components/atomica/Forms/Input';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { FormEventHandler } from 'react';
import { PageProps } from '@/types';
import Success from '@/Components/atomica/Alerts/Success';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage<PageProps>().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        last_name: user.last_name,
        email: user.email,
    });

    const submit: FormEventHandler = e => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className='text-lg font-medium text-gray-900'>{'Profile'}</h2>

                <p className='mt-1 text-sm text-gray-600'>{'Update your profile information and email address.'}</p>
            </header>

            <form onSubmit={submit} className='mt-6 space-y-6'>
                <div>
                    <Input
                        label={'Name'}
                        id='name'
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete='name'
                        error={errors.name}
                    />
                </div>

                <div>
                    <Input
                        label={'Surname'}
                        id='last_name'
                        value={data.last_name}
                        onChange={e => setData('last_name', e.target.value)}
                        autoComplete='last_name'
                        error={errors.last_name}
                    />
                </div>

                <div>
                    <Input
                        label={'Email'}
                        id='email'
                        type='email'
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        required
                        autoComplete='username'
                        error={errors.email}
                    />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className='text-sm mt-2 text-gray-800'>
                            {'Your email address is unverified'}
                            <Link
                                href={route('verification.send')}
                                method='post'
                                as='button'
                                className='underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                                {'Click here to re-send the verification email.'}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className='mt-2 font-medium text-sm text-green-600'>
                                {'A new verification email has been sent to your email address.'}
                            </div>
                        )}
                    </div>
                )}

                <div className='flex items-center gap-4'>
                    <PrimaryButton disabled={processing}>{'Save'}</PrimaryButton>

                    <Success show={recentlySuccessful} message={'Profile data updated'}></Success>
                </div>
            </form>
        </section>
    );
}
