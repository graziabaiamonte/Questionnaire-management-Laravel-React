import Authenticated from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/atomica/Forms/Input';
import Form from '@/Components/atomica/Forms/Form';
import { useForm, router, usePage } from '@inertiajs/react';
import Combo from '@/Components/atomica/Utils/Combo';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Helpers from '@/Components/atomica/Utils/Helpers';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import FormSection from '@/Components/atomica/Forms/FormSection';
import PasswordInput from '@/Components/atomica/Forms/PasswordInput';
import Dropzone from '@/Components/atomica/Forms/Dropzone';
import { Trash } from 'lucide-react';

interface FormData {
    name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    projects: Array<{
        value: string;
        name: string;
    }>;
    company_id: number | string;
    primary_project_id: number | string;
    media_upload: Array<File>;
    [key: string]: string | number | Array<any>;
}

export default function Create({
    roles,
    projects,
    companies,
}: {
    roles: Array<any>;
    projects: Array<any>;
    companies: Array<any>;
}) {
    const isAdmin = UseHasRoleOrPermissions({ permissions: ['admin', 'all'] });

    const form = useForm<FormData>({
        name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        //role: isAdmin ? '' : 'user', // Set default role to 'user' for non-admins which will have the role combo hidden
        role: 'user', // Set default role to 'user' for non-admins which will have the role combo hidden
        projects: [],
        company_id: '',
        primary_project_id: '',
        media_upload: [],
    });

    const inputChange = Helpers.inputChange(form.setData);
    const submit = Helpers.submitForm(form)('user');

    function onFileDelete(file: any) {
        form.setData(prev => ({
            ...prev,
            media_upload: form.data.media_upload.filter((item: File) => item.name !== file.name),
        }));
    }

    function onFileChange(file: File) {
        form.setData(prev => ({
            ...prev,
            media_upload: [file],
        }));
    }

    return (
        <Authenticated title='Crea Utente' description=''>
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
                            error={form.errors.last_name}
                            value={form.data.last_name}
                            onChange={inputChange}
                            label='Surname'
                            id='last_name'
                        />
                        <Input
                            error={form.errors.email}
                            value={form.data.email}
                            onChange={inputChange}
                            label='Email'
                            type='email'
                            id='email'
                        />
                        <Combo
                            items={companies}
                            error={form.errors.company_id}
                            label={'Company'}
                            displayValue={'name'}
                            onChange={company => {
                                form.setData(prev => ({
                                    ...prev,
                                    company_id: company?.value || '',
                                }));
                            }}
                        />
                        {isAdmin && (
                            <div>
                                <Label className='block text-sm font-normal leading-6 text-gray-500'>{'Type'}</Label>
                                <Combo
                                    items={roles}
                                    error={form.errors.role}
                                    //label={'Ruolo'}
                                    displayValue={'description'}
                                    onChange={role => {
                                        form.setData(prev => ({ ...prev, role: role.value }));
                                    }}
                                    selected={roles.find(role => role.value === form.data.role)}
                                />
                            </div>
                        )}
                    </div>

                    <FormSection>
                        <div className='col-span-2 h-auto'>
                            <Label className='block text-sm font-normal leading-6 text-gray-500 mb-2'>
                                {'Profile Picture'}
                            </Label>

                            <div>
                                <Dropzone onChange={file => onFileChange(file)} label='Drag and drop files' />
                            </div>
                            <div className='relative'>
                                {form.data.media_upload && form.data.media_upload.length > 0 && (
                                    <div className='my-2 items-center bg-green-100 border border-green-300 center flex flex-row relative inline-block select-none whitespace-nowrap rounded-lg align-baseline font-sans text-green-700 text-sm leading-none overflow-hidden'>
                                        <div className='relative w-12 h-12'>
                                            <img
                                                src={URL.createObjectURL(form.data.media_upload[0])}
                                                className='absolute w-full h-full object-cover'
                                            />
                                        </div>
                                        <div className='p-2 opacity-50'>
                                            <div className='w-6 h-6'></div>
                                        </div>
                                        <p className='flex-1 px-2 h-full flex justify-left items-center py-1 g border-r border-green-300'>
                                            <span>
                                                <span className='d-block'>{form.data.media_upload[0].name}</span>
                                                <br />
                                                <span className='d-block pt-2 text-xs uppercase'>
                                                    {'Save to upload this media'}
                                                </span>
                                            </span>
                                        </p>

                                        <Button
                                            variant={'ghost'}
                                            size={'icon'}
                                            className={'h-[30px] text-green-700 hover:text-red-500 hover:text-red-500'}
                                            onClick={() => onFileDelete(form.data.media_upload[0])}>
                                            <Trash className='w-5 h-5' />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </FormSection>

                    <div className='grid gap-3 lg:grid-cols-2 grid-cols-1'>
                        <PasswordInput
                            error={form.errors.password}
                            value={form.data.password}
                            onChange={inputChange}
                            label='Password'
                            type='password'
                            id='password'
                        />
                        <PasswordInput
                            error={form.errors.password_confirmation}
                            value={form.data.password_confirmation}
                            onChange={inputChange}
                            label='Confirm Password'
                            type='password'
                            id='password_confirmation'
                        />

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
                            items={projects.filter((project: any) =>
                                form.data.projects?.some(
                                    (assignedProject: any) => assignedProject.value === project.value,
                                ),
                            )}
                            error={form.errors.primary_project_id}
                            multiple={false}
                            label={'Primary Project'}
                            selected={
                                form.data.primary_project_id
                                    ? projects.find(project => project.value === form.data.primary_project_id)
                                    : null
                            }
                            displayValue={'name'}
                            onChange={project => {
                                form.setData((prev: any) => ({
                                    ...prev,
                                    primary_project_id: project?.value || '',
                                }));
                            }}
                        />
                    </div>
                </div>
                <div className='flex justify-end'>
                    <SecondaryButton className='me-5 text-capitalize' onClick={() => router.visit(route('user.index'))}>
                        {'Back'}
                    </SecondaryButton>
                    <PrimaryButton type={'submit'}>{'Create'}</PrimaryButton>
                </div>
            </Form>
        </Authenticated>
    );
}
