import { Trash2, Pencil, Copy } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { QuestionItem } from '@/types';

export default function Question({
    item,
    onEditRecord,
    onDeleteRecord,
    onCloneRecord,
}: {
    item: QuestionItem;
    onEditRecord: () => void;
    onDeleteRecord: () => void;
    onCloneRecord: () => void;
}) {
    return (
        <div className={'flex'}>
            <div className='grow'>
                <div className='text-sm text-gray-500 font-semibold'>{item.label}</div>
                <div className='text-xs text-gray-500 font-bold'>
                    <span className='font-normal'>{'Type:'}</span> {item.type}
                </div>
                {item.options && item.options.length > 0 && (
                    <div className='flex text-xs text-gray-500 font-bold'>
                        <span className='font-normal'>{'Options:'}</span>{' '}
                        {item.options.map(option => (
                            <span className='mx-1' key={option.id}>
                                {option.content}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <Button variant={'outline'} type={'button'} onClick={onEditRecord} size={'icon'} className={''}>
                <Pencil />
            </Button>

            <Button variant={'secondary'} type={'button'} onClick={onCloneRecord} size={'icon'} className={'ms-3'}>
                <Copy />
            </Button>

            <Button variant={'destructive'} type={'button'} onClick={onDeleteRecord} size={'icon'} className={'ms-3'}>
                <Trash2 />
            </Button>
        </div>
    );
}
