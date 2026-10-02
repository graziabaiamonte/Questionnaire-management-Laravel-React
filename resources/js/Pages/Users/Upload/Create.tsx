import Authenticated from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/atomica/Forms/Input';
import Form from '@/Components/atomica/Forms/Form';
import { useForm, router, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Helpers from '@/Components/atomica/Utils/Helpers';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import { Label } from '@/Components/ui/label';
import Combo from '@/Components/atomica/Utils/Combo';
import { Button } from '@/Components/ui/button';
import FormSection from '@/Components/atomica/Forms/FormSection';
import Dropzone from '@/Components/atomica/Forms/Dropzone';
import { Trash, FileText } from 'lucide-react';

interface FormData {
    name: string;
    description: string;
    media_upload: File[];
    project_id: string;
    [key: string]: string | any[] | File[] | number;
}

export default function Create({ projects }: { projects: Array<any> }) {
    const isAdmin = UseHasRoleOrPermissions({ permissions: ['admin', 'all'] });

    const form = useForm<FormData>({
        name: '',
        description: '',
        media_upload: [],
        project_id: '',
    });

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

    const inputChange = Helpers.inputChange(form.setData);
    const submit = Helpers.submitForm(form)('upload');

    return (
        <Authenticated title='Upload Document' description=''>
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

                        <Combo
                            items={projects}
                            error={form.errors.project_id}
                            multiple={false}
                            label={'Project'}
                            selected={
                                form.data.project_id
                                    ? projects.find(project => project.value === form.data.project_id)
                                    : null
                            }
                            displayValue={'name'}
                            onChange={project => {
                                form.setData((prev: any) => ({
                                    ...prev,
                                    project_id: project?.value || '',
                                }));
                            }}
                        />
                    </div>

                    <FormSection>
                        <div className='col-span-2 h-auto'>
                            <Label className='block text-sm font-normal leading-6 text-gray-500 mb-2'>{'File'}</Label>

                            <div>
                                <Dropzone onChange={file => onFileChange(file)} label='Drag and drop files' />
                            </div>
                            <div className='relative'>
                                {form.data.media_upload && form.data.media_upload.length > 0 && (
                                    <div className='my-2 items-center bg-green-100 border border-green-300 center flex flex-row relative inline-block select-none whitespace-nowrap rounded-lg align-baseline font-sans text-green-700 text-sm leading-none overflow-hidden'>
                                        <div className='relative w-12 h-12 items-center content-center justify-items-center'>
                                            <FileText className='w-6 h-6' />
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
                </div>
                <div className='flex justify-end mt-5'>
                    <SecondaryButton
                        className='me-5 text-capitalize'
                        onClick={() => router.visit(route('document.index'))}>
                        {'Back'}
                    </SecondaryButton>
                    <PrimaryButton type={'submit'}>{'Create'}</PrimaryButton>
                </div>
            </Form>
        </Authenticated>
    );
}
