import { Questionnaire, QuestionItem, QuestionOption } from '@/types';
import { useState, useRef } from 'react';
import Input from '@/Components/atomica/Forms/Input';
import Combo from '@/Components/atomica/Utils/Combo';
import { router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { Checkbox } from '@/Components/ui/checkbox';
import EditOption from './EditOption';
import Wysiwyg from '@/Components/atomica/Utils/Wysiwyg';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';

export default function EditQuestion({
    item,
    questionnaire,
    types,
    areas,
    onConfirm,
}: {
    item?: QuestionItem | null;
    questionnaire: Questionnaire;
    types: any;
    areas?: Array<any>;
    onConfirm: () => void;
}) {
    const [question, setQuestion] = useState(item);
    const [errors, setErrors] = useState<any>({});
    const emptyOption: QuestionOption = {
        id: '',
        questionnaire_question_id: '',
    };

    const editorRef = useRef(null);

    const handleQuestionUpdate = (options: QuestionOption[]) => {
        // Update question with new options
        setQuestion((prev: any) => ({
            ...prev,
            options: options,
        }));
    };

    function save() {
        if (question?.id) {
            router.patch(route('questionnaire-question.update', question.id), question as any, {
                preserveState: true,
                preserveScroll: true,
                only: ['questions', 'flash', 'errors'],
                onSuccess: () => {
                    onConfirm();
                },
                onError: errors => setErrors(errors),
            });
            return;
        }
        router.post(
            route('questionnaire-question.store'),
            {
                ...(question as any),
                questionnaire_id: questionnaire.id,
                //order_column: 3, //test
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['questions', 'flash', 'errors'],
                onSuccess: () => onConfirm(),
                onError: errors => setErrors(errors),
            },
        );
    }

    //console.log(question);

    return (
        <div className='p-5 flex flex-col'>
            <Input
                label='Label'
                error={errors.label}
                value={question?.label}
                onChange={(e: any) =>
                    setQuestion((prev: any) => (prev ? { ...prev, label: e.target.value } : { label: e.target.value }))
                }
            />

            <div>
                <Label className='block text-sm font-normal leading-6 text-gray-500'>{'Description'}</Label>
                {/* <Textarea
                    className='mt-2'
                    value={question?.description}
                    onChange={(e: any) =>
                        setQuestion((prev: any) =>
                            prev ? { ...prev, description: e.target.value } : { description: e.target.value },
                        )
                    }
                /> */}
                <Wysiwyg
                    init={(evt: any, editor: any) => (editorRef.current = editor)}
                    change={(e: any) =>
                        setQuestion((prev: any) => (prev ? { ...prev, description: e } : { description: e }))
                    }
                    value={question?.description || ''}
                    initialValue={item?.description || ''}
                />
                <div className='h-[20px]'></div>
            </div>

            <Combo
                label='Type'
                error={errors.type}
                displayValue={'label'}
                items={types}
                selected={types.find((x: any) => x.value === question?.type) || {}}
                onChange={(type: any) => {
                    setQuestion((prev: any) => ({ ...prev, type: type.value }));
                }}
            />

            {question?.type !== 'title' && (
                <div className='flex items-center gap-2 mb-4'>
                    <div className='text-sm text-gray-500 mr-2'>{'Required question?'}</div>

                    <Checkbox
                        value={1}
                        className='border-gray-200'
                        checked={question?.required}
                        onCheckedChange={checked => {
                            setQuestion((prev: any) => ({ ...prev, required: checked }));
                        }}
                    />
                </div>
            )}

            <div
                className={
                    question?.type !== 'options' && question?.type !== 'multiple' && question?.type !== 'vote'
                        ? 'opacity-0'
                        : ''
                }>
                {question?.id && (
                    <EditOption
                        item={emptyOption}
                        question={question}
                        options={question?.options || []}
                        type={question?.type}
                        onQuestionUpdate={handleQuestionUpdate}
                    />
                )}

                {!question?.id &&
                    (question?.type === 'options' || question?.type === 'multiple') &&
                    'Create the question and then add the answer options.'}
            </div>
            <div className='flex justify-end mt-20'>
                <PrimaryButton onClick={() => save()}>{question?.id ? 'Save' : 'Create'}</PrimaryButton>
            </div>
        </div>
    );
}
