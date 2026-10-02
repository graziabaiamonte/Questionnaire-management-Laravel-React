import Authenticated from '@/Layouts/AuthenticatedLayout';
import { useForm, router } from '@inertiajs/react';
import { Project } from '@/types';
import Form from '@/Components/atomica/Forms/Form';
import Input from '@/Components/atomica/Forms/Input';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Helpers from '@/Components/atomica/Utils/Helpers';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Button } from '@/Components/ui/button';
import FormSection from '@/Components/atomica/Forms/FormSection';
import Dropzone from '@/Components/atomica/Forms/Dropzone';
import { Trash } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Wysiwyg from '@/Components/atomica/Utils/Wysiwyg';
import Combo from '@/Components/atomica/Utils/Combo';

export default function Edit({
    project,
    companies,
    questionnaire_close_triggers,
}: {
    project: Project;
    companies: Array<any>;
    questionnaire_close_triggers: Array<any>;
}) {
    const form = useForm({ ...project, _method: 'PATCH' });

    const editorRef = useRef(null);

    const inputChange = Helpers.inputChange(form.setData);
    const submit = Helpers.submitForm(form)('project', Number(project.id));
    const isAdmin = UseHasRoleOrPermissions({ permissions: ['admin', 'all'] });

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
        <Authenticated title='Edit Project' description=''>
            <Form submit={submit} noBtn={true}>
                <div className='mx-auto rounded-lg mt-7'>
                    <div className='grid gap-3 lg:grid-cols-1 grid-cols-1'>
                        <Input
                            error={form.errors.name}
                            value={form.data.name}
                            onChange={inputChange}
                            label='Survey Name'
                            id='name'
                        />

                        <Combo
                            items={companies}
                            error={form.errors.company_id}
                            label={'Company'}
                            selected={companies.find(company => company.value === form.data.company_id)}
                            displayValue={'name'}
                            onChange={company => {
                                form.setData(prev => ({
                                    ...prev,
                                    company_id: company?.value || '',
                                }));
                            }}
                        />

                        <Combo
                            items={questionnaire_close_triggers}
                            error={form.errors.questionnaire_close_trigger}
                            selected={
                                typeof form.data.questionnaire_close_trigger === 'object' &&
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
                        />

                        <div>
                            <Label className='block text-sm font-normal leading-6 text-gray-500'>{'Description'}</Label>
                            <Wysiwyg
                                init={(evt: any, editor: any) => (editorRef.current = editor)}
                                change={(e: any) => form.setData(prev => ({ ...prev, description: e }))}
                                value={form.data.description || ''}
                                initialValue={project.description || ''}
                            />
                        </div>
                    </div>

                    <FormSection>
                        <div className='col-span-2 h-auto'>
                            <Label className='block text-sm font-normal leading-6 text-gray-500 mb-2'>{'Image'}</Label>

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

                                {form.data.media && form.data.media.length > 0 && (
                                    <div className='my-2 items-center bg-green-100 border border-green-300 center flex flex-row relative inline-block select-none whitespace-nowrap rounded-lg align-baseline font-sans text-green-700 text-sm leading-none overflow-hidden'>
                                        <div className='relative w-12 h-12'>
                                            <img
                                                src={form.data.media[0].original_url}
                                                className='absolute w-full h-full object-cover'
                                            />
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
                                            onClick={() => onFileDelete(form.data.media[0])}>
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
                        onClick={() => router.visit(route('project.index'))}>
                        {'Back'}
                    </SecondaryButton>
                    <PrimaryButton type={'submit'}>{'Update'}</PrimaryButton>
                </div>
            </Form>
        </Authenticated>
    );
}
