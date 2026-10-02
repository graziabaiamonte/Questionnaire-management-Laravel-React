import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps, User } from '@/types';

interface Project {
    name: string;
    description: string;
    media: Array<any>;
}

export default function Welcome({ primary_project }: { primary_project: Project }) {
    const { flash, errors, auth } = usePage<PageProps>().props;

    const user = auth.user as User;

    return (
        <AuthenticatedLayout header={<h2 className='text-xl font-semibold leading-tight text-gray-800'>Welcome</h2>}>
            <Head title='Welcome' />

            <div>
                <div>
                    <div className='md:flex justify-between mb-6'>
                        <div>
                            <h2 className='text-gray-600 font-bold text-2xl'>Welcome, {user.name}</h2>
                            <span className='text-sm text-gray-500'>{user.email}</span>
                        </div>
                        {primary_project && Object.keys(primary_project).length > 0 && primary_project.media[0] && (
                            <div>
                                <img
                                    src={primary_project.media[0].original_url}
                                    alt='Project Image'
                                    className='mt-4 md:mt-0 h-16 w-auto'
                                />
                            </div>
                        )}
                    </div>
                    {primary_project && Object.keys(primary_project).length > 0 && (
                        <div className='bg-white shadow-sm rounded-md border border-gray-200 p-6 my-6 text-gray-500'>
                            <div
                                className='html-description'
                                dangerouslySetInnerHTML={{ __html: primary_project.description }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
