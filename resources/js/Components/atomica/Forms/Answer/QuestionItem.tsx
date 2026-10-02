import { Checkbox } from '@/Components/ui/checkbox';
import FormSection from '../FormSection';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import Question from '@/Pages/Questionnaire/components/Question';
import { Star } from 'lucide-react';

export default function QuestionItem({
    question,
    count,
    form,
    onChange,
    value,
    disabled = false,
    //onInputChange,
}: {
    question: any;
    count: number;
    form: any;
    onChange: (item: any) => any;
    value: string;
    disabled?: boolean;
    //onInputChange: (item: any) => any;
}) {
    const classNoPaddingNoBorder = count === 1 ? 'py-0 pb-7' : 'py-7 border-t border-gray-200';

    // Special styling for Title questions
    if (question.type === 'title') {
        return (
            <div className={'flex-nowrap flex-col w-full ' + classNoPaddingNoBorder}>
                <div className='bg-gray-50 p-6 pb-4 mb-4'>
                    <div>
                        <h2 className='text-xl font-bold mt-1 mb-2'>{question?.label}</h2>
                        {question?.description && (
                            <div
                                className='html-description text-base text-gray-600 mt-3'
                                dangerouslySetInnerHTML={{ __html: question?.description }}></div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={'flex-nowrap flex-col w-full ' + classNoPaddingNoBorder}>
            <div className='flex'>
                {question.type !== 'title' && (
                    <div className='bg-black text-white w-[20px] h-[20px] text-center flex-shrink-0 justify-center text-sm mr-2 '>
                        {count}
                    </div>
                )}
                <div>
                    <h3 className='text-sm font-semibold mb-2'>
                        {question?.label}

                        {question?.required && question.type !== 'title' ? (
                            <span className='text-red-500'> * </span>
                        ) : (
                            ''
                        )}
                    </h3>
                    <div
                        className='html-description text-sm text-gray-500'
                        dangerouslySetInnerHTML={{ __html: question?.description || '' }}></div>
                </div>
            </div>
            {question.type === 'text' && (
                <Textarea className='mt-5' value={value} onChange={e => onChange(e.target.value)} disabled={disabled} />
            )}

            {question?.options && (
                <div className='flex flex-wrap gap-10 mt-3'>
                    {question.type === 'multiple' &&
                        question?.options.map((option: any) => {
                            const isChecked = Array.isArray(value) && value.includes(option.id);
                            return (
                                <div key={option.id} className='flex items-center gap-2'>
                                    <Checkbox
                                        id={option.id}
                                        value={option.id}
                                        className='border-gray-200'
                                        checked={isChecked}
                                        onCheckedChange={checked => {
                                            onChange({
                                                checked: checked,
                                                value: option.id,
                                            });
                                        }}
                                        disabled={disabled}
                                    />
                                    <div className='text-sm text-gray-500 ml-2'>{option.content}</div>
                                </div>
                            );
                        })}

                    {(question.type === 'options' || question.type === 'vote') && (
                        <RadioGroup className='mt-2' value={value} onValueChange={onChange} disabled={disabled}>
                            <div className='flex flex-wrap gap-10 mt-3'>
                                {question?.options.map((option: any) => (
                                    <div key={option.id} className='flex items-center gap-2'>
                                        <RadioGroupItem id={option.id} value={option.id} className='border-gray-200' />
                                        {question.type === 'options' && (
                                            <div className='text-sm text-gray-500 ml-2'>{option.content}</div>
                                        )}
                                        {question.type === 'vote' && (
                                            <div className='text-sm text-gray-500 ml-2 flex'>
                                                {isNaN(Number(option.content))
                                                    ? option.content
                                                    : [...Array(Number(option.content))].map((_, index) => (
                                                          <span key={index}>
                                                              <Star />
                                                          </span>
                                                      ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    )}
                </div>
            )}
        </div>
    );
}
