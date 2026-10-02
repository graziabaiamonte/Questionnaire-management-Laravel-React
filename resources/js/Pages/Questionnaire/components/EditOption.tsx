import { QuestionOption } from '@/types';
import { useEffect, useState } from 'react';
import Input from '@/Components/atomica/Forms/Input';
import { router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Trash2, Plus, Save } from 'lucide-react';
import { Grip, MoveVertical, PlusIcon } from 'lucide-react';

interface DragItem {
    id: number;
    order_column: number;
    content: string;
}

export default function EditOption({
    item,
    question,
    options,
    type,
    onQuestionUpdate,
}: {
    item?: QuestionOption;
    question?: any;
    options: any;
    type?: string;
    onQuestionUpdate?: (options: QuestionOption[]) => void;
}) {
    //console.log(options);

    const [option, setOption] = useState<QuestionOption>({ content: '', ...(item || {}) });
    const [items, setItems] = useState(options);

    useEffect(() => {
        // Notify parent when items change
        if (onQuestionUpdate) {
            onQuestionUpdate(items);
        }
    }, [items]);

    // function save() {
    //     if (option?.id) {
    //         router.patch(route('questionnaire-question-option.update', option.id), option as any, {
    //             preserveState: true,
    //             preserveScroll: true,
    //         });
    //         return;
    //     }

    //     router.post(
    //         route('questionnaire-question-option.store'),
    //         {
    //             ...(option as any),
    //             questionnaire_question_id: question.id,
    //         },
    //         {
    //             preserveState: true,
    //             preserveScroll: true,
    //             only: ['questions', 'flash', 'errors'],
    //         },
    //     );

    //     setItems([...items, option]);
    //     setOption({ content: '' } as any);

    //     //storeItem();

    //     // Reset new field
    //     if (item) {
    //         setOption(item);
    //     } else {
    //         setOption({ content: '' });
    //     }
    // }

    function addOption() {
        setItems([...items, option]);
        setOption({ content: '' } as any);

        //storeItem();

        // Reset new field
        if (item) {
            setOption(item);
        } else {
            setOption({ content: '' });
        }
    }

    /*async function storeItem() {
        try {
            const response = await axios.post(route('questionnaire-question-option.store'), {
                ...(option as any),
                questionnaire_question_id: question.id,
            });
            const { data } = response;
            setItems([...items, data]);
            setOption({ content: '' } as any);
        } catch (error) {
            console.log(error);
        }
    }*/

    const [dragging, setDragging] = useState<DragItem | null>(null);
    const [draggingOver, setDraggingOver] = useState<DragItem | null>(null);

    function handleDragStart(item: DragItem) {
        setDragging(item);
    }

    // useEffect(() => {
    //     console.log(items);
    // }, [items]);

    function deleteQuestionOption(id: number, index: number) {
        if (!id) {
            // Remove item by index for items without id
            setItems((prev: any) => prev.filter((_: any, idx: number) => idx !== index));
        } else {
            // Remove item by id from server and state
            router.delete(route('questionnaire-question-option.destroy', id), {
                onSuccess: () => {
                    setItems((prev: any) => prev.filter((option: any) => option.id !== id));
                },
            });
        }
    }

    async function swapOrder(e: React.DragEvent) {
        e.preventDefault();

        if (!dragging?.id || !draggingOver?.id || dragging.id === draggingOver.id) {
            return;
        }

        try {
            await router.get(
                route('questionnaire-question-option.reorder', {
                    dragging: dragging.id,
                    target: draggingOver.id,
                }),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );

            // Update local state to reflect the reorder
            setItems((prev: any) => {
                const updatedItems = [...prev];
                const draggingIndex = updatedItems.findIndex(x => x.id === dragging.id);
                const targetIndex = updatedItems.findIndex(x => x.id === draggingOver.id);

                if (draggingIndex === -1 || targetIndex === -1) return prev;

                // Remove item from current position
                const [removed] = updatedItems.splice(draggingIndex, 1);

                // Insert at target position
                updatedItems.splice(targetIndex, 0, removed);

                // Update order_column for all items
                return updatedItems.map((item, index) => ({
                    ...item,
                    order_column: index + 1,
                }));
            });
        } catch (error) {
            console.error('Error reordering items:', error);
        } finally {
            setDraggingOver(null);
            setDragging(null);
        }
    }

    useEffect(() => {
        if (type === 'vote') {
            // Clear the new option input if it's not a valid number
            if (option?.content && isNaN(Number(option.content))) {
                setOption({ ...option, content: '' });
            }

            // Clear existing options if they're not valid numbers
            setItems((prev: any) =>
                prev.map((item: any) => ({
                    ...item,
                    content: !isNaN(Number(item.content)) ? item.content : '',
                })),
            );
        }
    }, [type]);

    return (
        <>
            <label className='text-sm'>{'Options'}</label>
            <div className='flex'>
                <Input
                    id='newOpt'
                    placeholder='New option'
                    className='w-auto'
                    value={option?.content ?? ''}
                    onChange={(e: any) => setOption({ ...option, content: e.target.value })}
                    type={type === 'vote' ? 'number' : 'text'}
                />
                <Button className='mt-2 ml-2' size={'icon'} onClick={() => addOption()} variant={'outline'}>
                    <Plus color={'black'} fill='red' />
                </Button>
            </div>
            <ScrollArea className='max-h-40 overflow-y-scroll'>
                {Boolean(items.length) &&
                    items.map((item: any, idx: number) => (
                        <div
                            className='flex'
                            key={item.id || idx}
                            draggable
                            onDrop={swapOrder}
                            onDragOver={e => {
                                e.preventDefault();
                                setDraggingOver(item);
                            }}
                            onDragStart={() => handleDragStart(item)}>
                            {item.id && (
                                <div className='flex cursor-grab mt-4 me-2'>
                                    <MoveVertical />
                                    <Grip />
                                </div>
                            )}
                            <Input
                                className='w-auto'
                                value={item.content}
                                type={type === 'vote' ? 'number' : 'text'}
                                onChange={(e: any) => {
                                    setItems((prev: any) => {
                                        const updatedItems = [...prev];
                                        updatedItems[idx] = {
                                            ...updatedItems[idx],
                                            content: e.target.value,
                                        };
                                        return updatedItems;
                                    });
                                }}
                            />
                            <Button
                                variant={'destructive'}
                                className='mt-2 ml-2'
                                size={'icon'}
                                onClick={e => {
                                    e.preventDefault();
                                    deleteQuestionOption(item.id, idx);
                                }}>
                                <Trash2 />
                            </Button>

                            {!item.id && (
                                <div className='flex mt-4 text-sm mx-2'>Save the question to order the options</div>
                            )}
                            {/* <Button
                                variant={'outline'}
                                className='mt-2 ml-2'
                                size={'icon'}
                                onClick={e => {
                                    e.preventDefault();
                                    //console.log(item);
                                    router.patch(
                                        route('questionnaire-question-option.update', item.id),
                                        {
                                            content: item.content,
                                            questionnaire_question_id: question.id,
                                        },
                                        // {
                                        //     onSuccess: () => {
                                        //         setItems(items)
                                        //     }
                                        // }
                                    );
                                }}>
                                <Save />
                            </Button> */}
                        </div>
                    ))}
            </ScrollArea>
        </>
    );
}
