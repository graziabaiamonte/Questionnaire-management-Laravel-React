import { Fragment, PropsWithChildren, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function SimpleModal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
    position = 'center',
}: PropsWithChildren<{
    show: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
    closeable?: boolean;
    onClose: CallableFunction;
    position?: 'start' | 'center' | 'end';
}>) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '4xl': 'sm:max-w-4xl',
        '6xl': 'sm:max-w-6xl',
    }[maxWidth];

    const positionClass = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
    }[position];

    return (
        <Transition show={show} as={Fragment} leave='duration-200'>
            <Dialog
                as='div'
                id='modal'
                className={`fixed inset-0 flex overflow-y-auto px-4 py-6 sm:px-0 ${positionClass} z-50 transform transition-all bg-gray-500/75`}
                onClose={close}>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'>
                    {/* <div className='fixed inset-0 bg-gray-500/75' /> */}
                    <div className='fixed inset-0' />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                    enterTo='opacity-100 translate-y-0 sm:scale-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                    leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
                    <Dialog.Panel
                        className={`rounded-lg border bg-card text-card-foreground shadow-sm max-w-[280px] z-[200] sm:w-full sm:mx-auto ${maxWidthClass}`}>
                        {children}
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
