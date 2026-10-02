import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { Transition } from '@headlessui/react';

export default function Success({ message, show = false }: { message?: string; show: boolean }) {
    return (
        <Transition
            enter='transition-all duration-75'
            enterFrom='opacity-0'
            enterTo='opacity-1'
            leave='transition-all duration-150'
            leaveFrom='opacity-1'
            leaveTo='opacity-0'
            show={show}>
            <div
                className={`max-w-lg rounded-md shadow bg-green-50 text-white p-4 fixed top-20 right-4 sm:right-6 lg:right-8 z-[100]`}>
                <div className='flex'>
                    <div className='flex-shrink-0'>
                        <CheckCircleIcon className='h-5 w-5 text-green-400' aria-hidden='true' />
                    </div>
                    <div className='ml-3'>
                        <p className='text-sm font-medium text-green-800'>{message ? message : 'Success'}</p>
                    </div>
                </div>
            </div>
        </Transition>
    );
}
