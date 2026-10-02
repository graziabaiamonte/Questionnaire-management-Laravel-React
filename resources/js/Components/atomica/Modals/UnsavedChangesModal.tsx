import React from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

interface UnsavedChangesModalProps {
    show: boolean;
    onSave: () => void;
    onContinueWithoutSaving: () => void;
    onCancel: () => void;
}

export default function UnsavedChangesModal({
    show,
    onSave,
    onContinueWithoutSaving,
    onCancel,
}: UnsavedChangesModalProps) {
    return (
        <Modal show={show} onClose={onCancel} maxWidth='lg'>
            <div className='p-6'>
                <h2 className='text-lg font-medium text-gray-900'>{'Unsaved changes'}</h2>

                <p className='mt-4 text-sm text-gray-600'>
                    {'You have unsaved changes. Do you want to save before leaving?'}
                </p>

                <div className='mt-6 flex justify-end gap-3'>
                    <SecondaryButton onClick={onCancel}>{'Cancel'}</SecondaryButton>

                    <DangerButton onClick={onContinueWithoutSaving}>{'Leave without saving'}</DangerButton>

                    <PrimaryButton onClick={onSave}>{'Save'}</PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
