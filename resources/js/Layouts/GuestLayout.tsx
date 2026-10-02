import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className='flex min-h-screen flex-col items-center bg-gray-500 pt-6 sm:justify-center sm:pt-0'>
            <div>
                <Link href='/'>
                    <ApplicationLogo className='w-[200px] fill-current bg-gray-500 py-3 px-4 rounded-md' />
                </Link>
            </div>

            <div className='mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-md'>
                {children}
            </div>
        </div>
    );
}
