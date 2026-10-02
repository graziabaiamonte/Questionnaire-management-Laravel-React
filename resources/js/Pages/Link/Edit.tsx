import Authenticated from '@/Layouts/AuthenticatedLayout';
import { useForm, router } from '@inertiajs/react';
import { Link } from '@/types';
import Form from '@/Components/atomica/Forms/Form';
import Input from '@/Components/atomica/Forms/Input';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Helpers from '@/Components/atomica/Utils/Helpers';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import Combo from '@/Components/atomica/Utils/Combo';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';

export default function Edit({
    link,
    categories_list,
    users_list,
    projects_list,
}: {
    link: Link;
    categories_list: Array<any>;
    users_list: Array<any>;
    projects_list: Array<any>;
}) {
    const form = useForm(link);
    const inputChange = Helpers.inputChange(form.setData);
    const submit = Helpers.submitForm(form)('link', Number(link.id));
    const isAdmin = UseHasRoleOrPermissions({ permissions: ['admin', 'all'] });

    return (
        <Authenticated title='Edit Link' description=''>
            <Form submit={submit} noBtn={true}>
                <div className='mx-auto rounded-lg mt-7'>
                    <div className='grid gap-3 lg:grid-cols-2 grid-cols-1'>
                        <Input
                            error={form.errors.name}
                            value={form.data.name}
                            onChange={inputChange}
                            label='Name'
                            id='name'
                        />
                        <Input
                            error={form.errors.link}
                            value={form.data.link}
                            onChange={inputChange}
                            label='Url'
                            id='link'
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

                        <Input
                            error={form.errors.order_column}
                            value={form.data.order_column}
                            onChange={inputChange}
                            label='Order Column'
                            id='order_column'
                            type='number'
                        />
                    </div>

                    <div className='grid gap-3 grid-cols-1 mt-3'>
                        <div>
                            <Label className='block text-sm font-normal leading-6 text-gray-500'>{'Credentials'}</Label>
                            <Textarea
                                className='mt-2'
                                value={form.data.credentials}
                                onChange={e => form.setData(prev => ({ ...prev, credentials: e.target.value }))}
                            />
                            <div className='h-[20px]'></div>
                        </div>
                    </div>

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
                </div>
                <div className='flex justify-end'>
                    <SecondaryButton className='me-5 text-capitalize' onClick={() => router.visit(route('link.index'))}>
                        {'Back'}
                    </SecondaryButton>
                    <PrimaryButton type={'submit'}>{'Update'}</PrimaryButton>
                </div>
            </Form>
        </Authenticated>
    );
}
