import Authenticated from '@/Layouts/AuthenticatedLayout';
import { useForm, router } from '@inertiajs/react';
import { Questionnaire } from '@/types';
import Form from '@/Components/atomica/Forms/Form';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Helpers from '@/Components/atomica/Utils/Helpers';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import QuestionItem from '@/Components/atomica/Forms/Answer/QuestionItem';
import { useEffect } from 'react';
import useQuestionnaireUnsavedChanges from '@/Hooks/useQuestionnaireUnsavedChanges';
import UnsavedChangesModal from '@/Components/atomica/Modals/UnsavedChangesModal';

interface FormData {
    questionnaire_id: string;
    answers: any;
    [key: string]: any;
}

export default function Answer({ questionnaire }: { questionnaire: Questionnaire }) {
    const initialAnswers = questionnaire.questions?.reduce((acc: any, question) => {
        // Skip title questions as they don't need answers
        if (question.type !== 'title') {
            acc[question.id] = question.type === 'multiple' ? [] : '';
        }
        return acc;
    }, {});

    const form = useForm<FormData>({
        questionnaire_id: questionnaire.id,
        answers: initialAnswers,
    });

    const inputChange = Helpers.inputChange(form.setData);
    const submit = Helpers.submitForm(form)('questionnaire-answer');
    const isAdmin = UseHasRoleOrPermissions({ permissions: ['admin', 'all'] });

    let countQuestion = 1;

    const handleAnswerChange = (questionId: number, value: any) => {
        // Skip title questions as they don't need to store answers
        const question = questionnaire.questions?.find(q => q.id === questionId);
        if (question?.type === 'title') {
            return;
        }

        // Se il valore è un oggetto con checked e value, è un checkbox
        if (value && typeof value === 'object' && 'checked' in value) {
            const prevValue = form.data.answers[questionId] || [];
            const newValue = value.checked
                ? [...prevValue, value.value]
                : prevValue.filter((v: any) => v !== value.value);

            form.setData(prev => ({
                ...prev,
                answers: {
                    ...prev.answers,
                    [questionId]: newValue,
                },
            }));
        } else {
            // Per input text e radio
            form.setData(prev => ({
                ...prev,
                answers: {
                    ...prev.answers,
                    [questionId]: value,
                },
            }));
        }
    };

    const {
        isDirty,
        setIsDirty,
        showModal,
        pendingNavigation,
        handleSaveAndContinue,
        handleContinueWithoutSaving,
        handleCancelNavigation,
    } = useQuestionnaireUnsavedChanges({
        formData: form.data,
        initialData: {
            questionnaire_id: questionnaire.id,
            answers: initialAnswers,
        },
    });

    const handleSave = () => {
        form.post(route('questionnaire-answer.store'), {
            onSuccess: () => {
                setIsDirty(false);
                // Se c'è una navigazione pendente, procedi
                if (pendingNavigation) {
                    handleSaveAndContinue();
                }
            },
        });
    };

    // Reset unsaved changes on successful form submission
    useEffect(() => {
        if (form.wasSuccessful) {
            setIsDirty(false);
        }
    }, [form.wasSuccessful, setIsDirty]);

    return (
        <Authenticated title='Answer Survey' description=''>
            <UnsavedChangesModal
                show={showModal}
                onSave={handleSave}
                onContinueWithoutSaving={handleContinueWithoutSaving}
                onCancel={handleCancelNavigation}
            />
            <Form submit={submit} noBtn={true}>
                <div className='mx-auto rounded-lg mt-7'>
                    <div>
                        <div
                            className='html-description'
                            dangerouslySetInnerHTML={{ __html: questionnaire.description }}
                        />
                    </div>
                    <div className='grid gap-3 lg:grid-cols-1 grid-cols-1 mt-3 mb-5'>
                        <div className='flex justify-end flex-col p-7 pb-0 border border-gray-200 rounded-md'>
                            {questionnaire.questions?.map(question => {
                                const currentCount = question.type === 'title' ? 0 : countQuestion;
                                if (question.type !== 'title') {
                                    countQuestion++;
                                }

                                return (
                                    <div key={question.id}>
                                        <QuestionItem
                                            count={currentCount}
                                            question={question}
                                            form={form}
                                            value={
                                                question.type === 'title'
                                                    ? '' // Title questions don't have values
                                                    : form.data.answers[question.id] ||
                                                      (question.type === 'multiple' ? [] : '')
                                            }
                                            onChange={value => handleAnswerChange(question.id, value)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className='flex justify-end mt-5'>
                        <SecondaryButton
                            className='me-5 text-capitalize'
                            onClick={() => router.visit(route('userquestionnaire.index'))}>
                            {'Back'}
                        </SecondaryButton>
                        <PrimaryButton type={'submit'}>{'Save'}</PrimaryButton>
                    </div>
                </div>
            </Form>
        </Authenticated>
    );
}
