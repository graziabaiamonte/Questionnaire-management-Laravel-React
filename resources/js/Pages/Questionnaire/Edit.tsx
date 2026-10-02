import Authenticated from '@/Layouts/AuthenticatedLayout';
import { useRef, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { QuestionItem, Questionnaire } from '@/types';
import Form from '@/Components/atomica/Forms/Form';
import Input from '@/Components/atomica/Forms/Input';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Helpers from '@/Components/atomica/Utils/Helpers';
import Hooks from '@/Components/atomica/Utils/Hooks';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import Combo from '@/Components/atomica/Utils/Combo';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import FormSection from '@/Components/atomica/Forms/FormSection';
import Modal from '@/Components/atomica/Utils/Modal';
import SimpleModal from '@/Components/SimpleModal';
import EditQuestion from './components/EditQuestion';
import TitlePage from '@/Components/atomica/TitlePage';
import { Grip, MoveVertical, PlusIcon, Trash, Copy } from 'lucide-react';
import { Pencil1Icon } from '@radix-ui/react-icons';
import Question from './components/Question';
import Wysiwyg from '@/Components/atomica/Utils/Wysiwyg';

interface QuestionRecord {
    options: string;
    label: string;
    description?: string;
    type: string;
    required: boolean;
    id?: number; // opzionale per nuove domande
    order_column?: number;
}

export default function Edit({
    questionnaire,
    questionnaire_close_triggers,
    categories_list,
    users_list,
    projects_list,
    questions,
    types,
}: {
    questionnaire: Questionnaire;
    questionnaire_close_triggers: Array<any>;
    categories_list: Array<any>;
    users_list: Array<any>;
    projects_list: Array<any>;
    questions: Array<any>;
    types: Array<any>;
}) {
    const form = useForm(questionnaire);
    const inputChange = Helpers.inputChange(form.setData);
    const submit = Helpers.submitForm(form)('questionnaire', Number(questionnaire.id));
    const isAdmin = UseHasRoleOrPermissions({ permissions: ['admin', 'all'] });

    const editorRef = useRef(null);

    const emptyQuestion: QuestionItem = {
        type: '',
        options: [],
        label: '',
        description: '',
        answer: null,
        required: false,
    };

    const useDeleteItem = Hooks.useDeleteItem({
        routeName: 'questionnaire-question',
        only: 'questionnaire-question',
    });
    const [recordToEdit, setRecordToEdit] = useState<QuestionItem | null>(null);

    const tableHeaders = [
        {
            label: 'Label',
            key: 'label',
            sortable: true,
        },
        {
            label: 'Type',
            key: 'type',
            sortable: true,
        },
        {
            label: 'Edit',
            icon: <Pencil1Icon />,
            action: (item: any) => {
                setRecordToEdit(item);
            },
        },
        {
            icon: <Trash className={'bg-red-500'} />,
            danger: true,
            action: (item: { id: number }) => useDeleteItem.changeRecordToDelete(item.id),
        },
    ];

    const [dragging, setDragging] = useState<QuestionItem | null>(null);
    const [draggingOver, setDraggingOver] = useState<QuestionItem | null>(null);

    function handleDragStart(item: any) {
        setDragging(item);
    }

    function swapOrder(e: any) {
        e.preventDefault();
        if (dragging && draggingOver && dragging !== draggingOver) {
            router.get(
                route('questionnaire-question.reorder', {
                    dragging: dragging.id,
                    target: draggingOver.id,
                }),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => {
                        setDraggingOver(null);
                        setDragging(null);
                    },
                },
            );
        }
    }

    function cloneQuestion(questionId: number) {
        router.post(
            route('questionnaire-question.clone', questionId),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally refresh the page or show a success message
                },
            },
        );
    }

    function cloneQuestionnaire() {
        router.post(
            route('questionnaire.clone', questionnaire.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    }

    return (
        <Authenticated>
            <Form submit={submit} noBtn={true}>
                <Modal
                    type='danger'
                    onClose={() => useDeleteItem.changeRecordToDelete(null)}
                    onConfirm={() => useDeleteItem.doDelete()}
                    show={Boolean(useDeleteItem.recordToDelete)}
                />

                <SimpleModal
                    onClose={() => setRecordToEdit(null)}
                    show={Boolean(recordToEdit)}
                    maxWidth={'4xl'}
                    position={'start'}>
                    <EditQuestion
                        item={recordToEdit}
                        questionnaire={questionnaire}
                        types={types}
                        onConfirm={() => {
                            setRecordToEdit(null);
                        }}
                    />
                </SimpleModal>

                <TitlePage
                    title={'Edit Survey'}
                    description={''}
                    actionText={'Add question'}
                    action={() => {
                        setRecordToEdit(emptyQuestion);
                    }}
                    actionText2={'Back'}
                    action2={() => {
                        router.visit(route('questionnaire.index'));
                    }}
                />

                <div className='mx-auto rounded-lg mt-7'>
                    <div className='grid gap-3 lg:grid-cols-2 grid-cols-1'>
                        <div className='col-span-2 flex justify-end items-center'>
                            <div className='flex items-center space-x-2 mb-3'>
                                <Checkbox
                                    id='closed'
                                    checked={form.data.closed}
                                    onCheckedChange={checked =>
                                        form.setData(prev => ({ ...prev, closed: checked === true }))
                                    }
                                />
                                <Label
                                    htmlFor='closed'
                                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                    {'Close Survey'}
                                </Label>
                            </div>
                            {form.errors.closed && <div className='text-sm text-red-500'>{form.errors.closed}</div>}
                        </div>

                        <Input
                            error={form.errors.name}
                            value={form.data.name}
                            onChange={inputChange}
                            label='Name'
                            id='name'
                        />

                        <Combo
                            items={categories_list}
                            error={form.errors.categories}
                            multiple={true}
                            label={'Categories'}
                            selected={form.data.categories}
                            displayValue={'name'}
                            onChipsDelete={e => {
                                const filteredCategories = form.data.categories?.filter(
                                    (category: any) => category.value !== e.value,
                                );
                                form.setData(prev => ({ ...prev, categories: filteredCategories }));
                            }}
                            onChange={(e: any) => {
                                if (e && !form.data.categories?.find((item: any) => item.value == e.value))
                                    form.setData((prev: any) => ({ ...prev, categories: [...prev.categories, e] }));
                            }}
                        />

                        <Combo
                            items={questionnaire_close_triggers}
                            error={form.errors.questionnaire_close_trigger}
                            selected={
                                !form.data.questionnaire_close_trigger
                                    ? ''
                                    : typeof form.data.questionnaire_close_trigger === 'object' &&
                                        form.data.questionnaire_close_trigger !== null
                                      ? form.data.questionnaire_close_trigger
                                      : questionnaire_close_triggers.find(
                                            trigger => trigger.value === form.data.questionnaire_close_trigger,
                                        )
                            }
                            label={'Close Survey Trigger'}
                            displayValue={'description'}
                            onChange={questionnaire_close_trigger => {
                                form.setData((prev: any) => ({
                                    ...prev,
                                    questionnaire_close_trigger: questionnaire_close_trigger.value,
                                }));
                            }}
                            onClear={() => {
                                form.setData(prev => ({
                                    ...prev,
                                    questionnaire_close_trigger: '',
                                }));
                            }}
                        />

                        <Input
                            error={form.errors.order_column}
                            value={form.data.order_column}
                            onChange={inputChange}
                            label='Order Column'
                            id='order_column'
                            type='number'
                        />
                    </div>

                    <FormSection>
                        <div className='col-span-2 h-auto'>
                            <Label className='block text-sm font-normal leading-6 text-gray-500 mb-2'>
                                {'Questions'}
                            </Label>

                            {questions &&
                                questions.map((question: any) => (
                                    <div
                                        draggable
                                        onDrop={swapOrder}
                                        onDragOver={e => {
                                            e.preventDefault();
                                            setDraggingOver(question);
                                        }}
                                        onDragStart={() => handleDragStart(question)}
                                        key={question.id}>
                                        <div className='flex items-start gap-4 border border-input p-2 mt-2 rounded-md'>
                                            <div className='flex cursor-grab mt-3'>
                                                <MoveVertical />
                                                <Grip />
                                            </div>
                                            <div className='flex-1'>
                                                <Question
                                                    item={question}
                                                    onEditRecord={() => setRecordToEdit(question)}
                                                    onDeleteRecord={() =>
                                                        useDeleteItem.changeRecordToDelete(question.id)
                                                    }
                                                    onCloneRecord={() => cloneQuestion(question.id)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </FormSection>

                    <div className='grid gap-3 lg:grid-cols-2 grid-cols-1 mt-3'>
                        <Combo
                            items={projects_list}
                            error={form.errors.projects}
                            multiple={true}
                            label={'Assigned projects'}
                            selected={form.data.projects}
                            displayValue={'name'}
                            onChipsDelete={e => {
                                const filteredProjects = form.data.projects?.filter(
                                    (project: any) => project.value !== e.value,
                                );
                                form.setData(prev => ({ ...prev, projects: filteredProjects }));
                            }}
                            onChange={(e: any) => {
                                if (e && !form.data.projects?.find((item: any) => item.value == e.value))
                                    form.setData((prev: any) => ({ ...prev, projects: [...prev.projects, e] }));
                            }}
                        />

                        <Combo
                            items={users_list}
                            error={form.errors.users}
                            multiple={true}
                            label={'Assigned users'}
                            selected={form.data.users}
                            displayValue={'full_name'}
                            onChipsDelete={e => {
                                const filteredUsers = form.data.users?.filter((user: any) => user.value !== e.value);
                                form.setData(prev => ({ ...prev, users: filteredUsers }));
                            }}
                            onChange={(e: any) => {
                                if (e && !form.data.users?.find((item: any) => item.value == e.value))
                                    form.setData((prev: any) => ({ ...prev, users: [...prev.users, e] }));
                            }}
                        />
                    </div>
                    <div>
                        <Label className='block text-sm font-normal leading-6 text-gray-500'>{'Description'}</Label>

                        <Wysiwyg
                            init={(evt: any, editor: any) => (editorRef.current = editor)}
                            change={(e: any) => form.setData(prev => ({ ...prev, description: e }))}
                            value={form.data.description || ''}
                            initialValue={questionnaire.description || ''}
                        />
                    </div>
                </div>
                <div className='flex justify-end gap-3'>
                    <SecondaryButton
                        className='text-capitalize'
                        onClick={() => router.visit(route('questionnaire.index'))}>
                        {'Back'}
                    </SecondaryButton>
                    <SecondaryButton className='text-capitalize flex items-center gap-2' onClick={cloneQuestionnaire}>
                        <Copy className='w-4 h-4' />
                        {'Clone Survey'}
                    </SecondaryButton>
                    <PrimaryButton type={'submit'}>{'Update'}</PrimaryButton>
                </div>
            </Form>
        </Authenticated>
    );
}
