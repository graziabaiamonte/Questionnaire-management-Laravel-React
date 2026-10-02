import { Button } from '@/Components/ui/button';
import { Plus } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '../SecondaryButton';

export default function TitlePage({
    title,
    description,
    action,
    actionText,
    iconAction,
    action2,
    actionText2,
}: {
    title: string;
    description: string;
    action?: () => void;
    actionText?: string;
    iconAction?: React.ReactNode;
    action2?: () => void;
    actionText2?: string;
}) {
    return (
        <div className='space-y-4 flex sm:items-center sm:justify-between sm:flex-row flex-col gap-2 sm:items-start'>
            <div>
                <h1 className='text-2xl font-semibold whitespace-pre-line'>{title}</h1>
                <p className='text-sm text-muted-foreground'>{description}</p>
            </div>
            <div className='flex gap-2'>
                {action2 && (
                    <div>
                        <SecondaryButton onClick={action2} className='h-full'>
                            {actionText2 ?? "Torna all'elenco"}
                        </SecondaryButton>
                    </div>
                )}
                <div>
                    {action && (
                        <PrimaryButton type={'button'} onClick={action} className='h-full'>
                            {actionText ?? 'Crea Nuovo record'}
                            {iconAction && iconAction}
                            {!iconAction && <Plus width={'14px'} height={'14px'} className='ml-2.5' />}
                        </PrimaryButton>
                    )}
                </div>
            </div>
        </div>
    );
}
