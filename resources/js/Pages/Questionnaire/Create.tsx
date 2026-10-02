import Authenticated from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/atomica/Forms/Input';
import Form from '@/Components/atomica/Forms/Form';
import { useForm, router, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Helpers from '@/Components/atomica/Utils/Helpers';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import Combo from '@/Components/atomica/Utils/Combo';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Textarea } from '@/Components/ui/textarea';
import FormSection from '@/Components/atomica/Forms/FormSection';
import Wysiwyg from '@/Components/atomica/Utils/Wysiwyg';
import { useRef } from 'react';

export default function Create({
    categories,
    users,
    projects,
    questionnaire_close_triggers,
}: {
    categories: Array<any>;
    users: Array<any>;
    projects: Array<any>;
    questionnaire_close_triggers: Array<any>;
}) {
    const isAdmin = UseHasRoleOrPermissions({ permissions: ['admin', 'all'] });

    const form = useForm<{
        name: string;
        users: any[];
        categories: any[];
        projects: any[];
        questionnaire_close_trigger: string;
        closed: boolean;
        order_column: number;
        description?: string;
    }>({
        name: '',
        users: [],
        categories: [],
        projects: [],
        questionnaire_close_trigger: '',
        closed: false,
        order_column: 0,
        description: '',
    });

    const inputChange = Helpers.inputChange(form.setData);
    const submit = Helpers.submitForm(form)('questionnaire');

    const editorRef = useRef(null);

    return (
        <Authenticated title='Create Survey' description=''>
            <Form submit={submit} noBtn={true}>
                <div className='mx-auto rounded-lg mt-7'>
                    <div className='grid gap-3 lg:grid-cols-2 grid-cols-1'>
                        <div className='col-span-2 flex justify-end items-center'>
                            <div className='flex items-center space-x-2 mt-4'>
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
                                {form.errors.closed && <div className='text-sm text-red-500'>{form.errors.closed}</div>}
                            </div>
                        </div>
                        <Input
                            error={form.errors.name}
                            value={form.data.name}
                            onChange={inputChange}
                            label='Name'
                            id='name'
                        />

                        <Combo
                            items={categories}
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
                                form.setData(prev => ({
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
                        </div>
                    </FormSection>

                    <div className='grid gap-3 lg:grid-cols-2 grid-cols-1'>
                        <Combo
                            items={projects}
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
                            items={users}
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
                        />
                    </div>
                </div>
                <div className='flex justify-end mt-5'>
                    <SecondaryButton
                        className='me-5 text-capitalize'
                        onClick={() => router.visit(route('questionnaire.index'))}>
                        {'Back'}
                    </SecondaryButton>
                    <PrimaryButton type={'submit'}>{'Create'}</PrimaryButton>
                </div>
            </Form>
        </Authenticated>
    );
}
