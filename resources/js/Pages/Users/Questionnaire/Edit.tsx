import Authenticated from '@/Layouts/AuthenticatedLayout';
import { useForm, router, usePage } from '@inertiajs/react';
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

export default function Edit({
    questionnaire,
    answers,
    canEdit,
}: {
    questionnaire: Questionnaire;
    answers: any;
    canEdit: boolean;
}) {
    const transformAnswers = () => {
        // Inizializza tutte le domande con null o array vuoto, but skip title questions
        const transformed: { [key: number]: any } = {};
        questionnaire.questions?.forEach((question: any) => {
            if (question.type !== 'title') {
                transformed[question.id] = question.type === 'multiple' ? [] : null;
            }
        });

        // Sovrascrive solo le domande che hanno risposte
        answers.forEach((answer: any) => {
            const questionId = answer.questionnaire_question_id;
            if (answer.answer !== null) {
                transformed[questionId] = answer.answer;
            } else if (answer.questionnaire_question_option_id !== null) {
                if (!transformed[questionId]) {
                    transformed[questionId] = [];
                }
                transformed[questionId].push(answer.questionnaire_question_option_id);
            }
        });

        return transformed;
    };

    const form = useForm<FormData>({
        questionnaire_id: questionnaire.id,
        answers: transformAnswers(),
    });

    const inputChange = Helpers.inputChange(form.setData);
    const submit = Helpers.submitForm(form)('questionnaire-answer', Number(questionnaire.id));
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

    const { flash } = usePage().props;

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
            answers: transformAnswers(),
        },
        enabled: canEdit,
    });

    const handleSave = () => {
        form.patch(route('questionnaire-answer.update', Number(questionnaire.id)), {
            onSuccess: () => {
                setIsDirty(false);
                if (pendingNavigation) {
                    handleSaveAndContinue();
                }
            },
        });
    };

    useEffect(() => {
        if (form.wasSuccessful) {
            setIsDirty(false);
        }
    }, [form.wasSuccessful, setIsDirty]);

    //useEffect(() => {
    //    form.data.answers.map((answer: any, index: number) => {});
    //}, [form.data.answers]);

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
                                                    : question.type === 'multiple'
                                                      ? form.data.answers[question.id] || []
                                                      : question.type === 'text'
                                                        ? form.data.answers[question.id] || ''
                                                        : question.type === 'options' || question.type === 'vote'
                                                          ? (Array.isArray(form.data.answers[question.id])
                                                                ? form.data.answers[question.id][0]
                                                                : form.data.answers[question.id]) || ''
                                                          : form.data.answers[question.id] || ''
                                            }
                                            onChange={value => handleAnswerChange(question.id, value)}
                                            disabled={!canEdit}
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
                        {canEdit && <PrimaryButton type={'submit'}>{'Save'}</PrimaryButton>}
                    </div>

                    {flash.success && (
                        <div className='my-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded'>
                            {'Thank you for completing the questions.'}
                        </div>
                    )}
                </div>
            </Form>
        </Authenticated>
    );
}
