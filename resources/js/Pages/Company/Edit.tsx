import Authenticated from '@/Layouts/AuthenticatedLayout';
import { useForm, router } from '@inertiajs/react';
import { Company } from '@/types';
import Form from '@/Components/atomica/Forms/Form';
import Input from '@/Components/atomica/Forms/Input';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Helpers from '@/Components/atomica/Utils/Helpers';

export default function Edit({ company }: { company: Company }) {
    const form = useForm({ ...company, _method: 'PATCH' });

    const inputChange = Helpers.inputChange(form.setData);
    const submit = Helpers.submitForm(form)('company', Number(company.id));

    return (
        <Authenticated title='Edit Company' description=''>
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
                    </div>
                </div>
                <div className='flex justify-end'>
                    <SecondaryButton
                        className='me-5 text-capitalize'
                        onClick={() => router.visit(route('company.index'))}>
                        {'Back'}
                    </SecondaryButton>
                    <PrimaryButton type={'submit'}>{'Update'}</PrimaryButton>
                </div>
            </Form>
        </Authenticated>
    );
}
