import Authenticated from '@/Layouts/AuthenticatedLayout';
import { useForm, router } from '@inertiajs/react';
import { Document } from '@/types';
import Form from '@/Components/atomica/Forms/Form';
import Input from '@/Components/atomica/Forms/Input';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Helpers from '@/Components/atomica/Utils/Helpers';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import Combo from '@/Components/atomica/Utils/Combo';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import FormSection from '@/Components/atomica/Forms/FormSection';
import Dropzone from '@/Components/atomica/Forms/Dropzone';
import { Copy, Download, Eye, Trash, FileText } from 'lucide-react';
import { useState } from 'react';
import Success from '@/Components/atomica/Alerts/Success';

export default function Edit({
    document,
    categories_list,
    users_list,
    projects_list,
}: {
    document: Document;
    categories_list: Array<any>;
    users_list: Array<any>;
    projects_list: Array<any>;
}) {
    const form = useForm({ ...document, _method: 'PATCH' });
    const inputChange = Helpers.inputChange(form.setData);
    const submit = Helpers.submitForm(form)('document', Number(document.id));
    const isAdmin = UseHasRoleOrPermissions({ permissions: ['admin', 'all'] });
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    function onFileDelete(file: any) {
        if (file.id) {
            // FileMedia
            form.setData(prev => ({
                ...prev,
                media: form.data.media.filter((item: any) => item.id !== file.id),
            }));
        } else {
            // File
            form.setData(prev => ({
                ...prev,
                media_upload: form.data.media_upload.filter((item: File) => item.name !== file.name),
            }));
        }
    }

    function onFileChange(file: File) {
        form.setData(prev => ({
            ...prev,
            media: [],
            media_upload: [file],
        }));
    }

    return (
        <Authenticated title='Edit Document' description=''>
            <Success show={showSuccessToast} message='URL copiato negli appunti' />
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

                                {form.data.media && form.data.media.length > 0 && (
                                    <div className='my-2 items-center bg-green-100 border border-green-300 center flex flex-row relative inline-block select-none whitespace-nowrap rounded-lg align-baseline font-sans text-green-700 text-sm leading-none overflow-hidden'>
                                        <div className='relative w-12 h-12 items-center content-center justify-items-center'>
                                            <FileText className='w-6 h-6' />
                                        </div>
                                        <div className='p-2 opacity-50'>
                                            <div className='w-6 h-6'></div>
                                        </div>
                                        <p className='flex-1 px-2 h-full flex justify-left items-center py-1 g border-r border-green-300'>
                                            <span>
                                                <span className='d-block'>{form.data.media[0].file_name}</span>
                                                <br />
                                            </span>
                                        </p>

                                        <Button
                                            variant={'ghost'}
                                            size={'icon'}
                                            className={'h-[30px] text-green-700 hover:text-red-500 hover:text-red-500'}
                                            onClick={e => {
                                                e.preventDefault();
                                                const url = route('media.show', form.data.media[0].id);
                                                navigator.clipboard.writeText(url).then(() => {
                                                    setShowSuccessToast(true);
                                                    setTimeout(() => setShowSuccessToast(false), 3000);
                                                });
                                            }}>
                                            <Copy className='w-5 h-5' />
                                        </Button>

                                        <Button
                                            variant={'ghost'}
                                            size={'icon'}
                                            className={'h-[30px] text-green-700 hover:text-red-500 hover:text-red-500'}
                                            onClick={e => {
                                                e.preventDefault();
                                                window.open(route('media.show', form.data.media[0].id), '_blank');
                                            }}>
                                            <Eye className='w-5 h-5' />
                                        </Button>

                                        <Button
                                            variant={'ghost'}
                                            size={'icon'}
                                            className={'h-[30px] text-green-700 hover:text-red-500 hover:text-red-500'}
                                            onClick={e => {
                                                e.preventDefault();
                                                window.open(route('media.download', form.data.media[0].id), '_blank');
                                            }}>
                                            <Download className='w-5 h-5' />
                                        </Button>

                                        <Button
                                            variant={'ghost'}
                                            size={'icon'}
                                            className={'h-[30px] text-green-700 hover:text-red-500 hover:text-red-500'}
                                            onClick={() => onFileDelete(form.data.media[0])}>
                                            <Trash className='w-5 h-5' />
                                        </Button>
                                    </div>
                                )}
                            </div>
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
                </div>
                <div className='flex justify-end'>
                    <SecondaryButton
                        className='me-5 text-capitalize'
                        onClick={() => router.visit(route('document.index'))}>
                        {'Back'}
                    </SecondaryButton>
                    <PrimaryButton type={'submit'}>{'Update'}</PrimaryButton>
                </div>
            </Form>
        </Authenticated>
    );
}
