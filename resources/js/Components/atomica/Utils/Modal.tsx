import { Fragment, PropsWithChildren, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose,
    onConfirm,
    type,
    buttons = true,
    cancelText,
    confirmText,
}: {
    show: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    closeable?: boolean;
    onClose: CallableFunction;
    type: 'primary' | 'danger'; // danger is used as delete. Should be renamed if that's our only use of it
    buttons?: boolean;
    cancelText?: string;
    confirmText?: string;
    onConfirm?: () => void;
    children?: React.ReactNode;
}) {
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
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment} leave='duration-200'>
            <Dialog
                as='div'
                id='modal'
                className='fixed inset-0 flex overflow-y-auto px-4 py-6 sm:px-0 items-center z-50 transform transition-all'
                onClose={close}>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'>
                    <div className='absolute inset-0 bg-gray-500/75' />
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
                        className={`mb-6 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:mx-auto ${maxWidthClass}`}>
                        {Boolean(children) && !buttons && children}

                        {(!children || (Boolean(children) && Boolean(buttons))) && (
                            <>
                                <div className='p-5 flex flex-col'>
                                    <div className='grid place-items-center'>
                                        {Boolean(children) && children}
                                        {!children && type == 'danger' && (
                                            <>
                                                <p>{'Are you sure you want to delete this record?'}</p>
                                                <small>
                                                    {'Click on '}
                                                    <i>{'Delete'}</i>
                                                    {' to confirm.'}
                                                </small>
                                            </>
                                        )}
                                        {!children && type == 'primary' && (
                                            <>
                                                <p>{'Are you sure you want to continue?'}</p>
                                                <small>
                                                    {'Click on '}
                                                    <i>{'Confirm'}</i>
                                                    {' to proceed.'}
                                                </small>
                                            </>
                                        )}
                                    </div>
                                    <div className={`pt-10 flex justify-end space-x-2`}>
                                        <PrimaryButton onClick={() => onClose()}>
                                            {cancelText || 'Cancel'}
                                        </PrimaryButton>
                                        {type == 'primary' && onConfirm && (
                                            <PrimaryButton onClick={() => onConfirm()}>
                                                {confirmText || 'Confirm'}
                                            </PrimaryButton>
                                        )}
                                        {type == 'danger' && onConfirm && (
                                            <DangerButton onClick={() => onConfirm()}>
                                                {confirmText || 'Delete'}
                                            </DangerButton>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
