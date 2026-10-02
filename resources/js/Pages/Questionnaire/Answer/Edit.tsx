import Authenticated from '@/Layouts/AuthenticatedLayout';
import { useForm, router } from '@inertiajs/react';
import { Questionnaire, User, QuestionnaireUserState } from '@/types';
import Form from '@/Components/atomica/Forms/Form';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Helpers from '@/Components/atomica/Utils/Helpers';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import QuestionItem from '@/Components/atomica/Forms/Answer/QuestionItem';
import { useEffect } from 'react';
import TitlePage from '@/Components/atomica/TitlePage';

interface FormData {
    questionnaire_id: string;
    answers: any;
    [key: string]: any;
}

export default function Answer({
    questionnaire,
    questionnaire_user_state,
    answers,
    user_questionnaire,
}: {
    questionnaire: Questionnaire;
    questionnaire_user_state: QuestionnaireUserState;
    answers: any;
    user_questionnaire: User;
}) {
    const transformAnswers = () => {
        const transformed: { [key: number]: any } = {};

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
    const submit = Helpers.submitForm(form)('questionnaireanswer', Number(questionnaire_user_state.id));
    const isAdmin = UseHasRoleOrPermissions({ permissions: ['admin', 'all'] });

    let countQuestion = 1;

    const handleAnswerChange = (questionId: number, value: any) => {
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

    //useEffect(() => {
    //    form.data.answers.map((answer: any, index: number) => {});
    //}, [form.data.answers]);

    const questionnaire_name = questionnaire?.name || '';
    const user_fullname = user_questionnaire?.name + ' ' + user_questionnaire?.last_name || '';

    return (
        <Authenticated title='' description=''>
            <TitlePage
                title={`Answers by "${user_fullname}"\nto the survey "${questionnaire_name}"`}
                description={''}
                actionText2={'Back'}
                action2={() => {
                    router.visit(route('questionnaireanswer.index', questionnaire.id));
                }}
            />

            <Form submit={submit} noBtn={true}>
                <div className='mx-auto rounded-lg mt-7'>
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
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className='flex justify-end mt-5'>
                        <SecondaryButton
                            className='me-5 text-capitalize'
                            onClick={() => router.visit(route('questionnaireanswer.index', questionnaire.id))}>
                            {'Back'}
                        </SecondaryButton>
                        <PrimaryButton type={'submit'}>{'Save'}</PrimaryButton>
                    </div>
                </div>
            </Form>
        </Authenticated>
    );
}
