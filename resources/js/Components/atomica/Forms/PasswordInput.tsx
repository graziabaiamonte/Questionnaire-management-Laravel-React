import React, { forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes, useState } from 'react';
import InputError from '@/Components/InputError';
import { twMerge } from 'tailwind-merge';
import { Input as ShadInput } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

export default forwardRef(function PasswordInput(
    {
        className = '',
        isFocused = false,
        label = '',
        error = '',
        children,
        required = false,
        value = '',
        onChange,
        id,
        ...props
    }: InputHTMLAttributes<HTMLInputElement> & {
        isFocused?: boolean;
        label?: string;
        error?: string;
        children?: React.ReactNode;
        required?: boolean;
        value?: string;
        onChange?: React.ChangeEventHandler<HTMLInputElement>;
        id?: string;
    },
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div className=''>
            {label && (
                <Label className='block text-sm font-normal leading-6 text-gray-500'>
                    {label} {required && '*'}
                </Label>
            )}
            <div className='mt-2 flex relative rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600'>
                <ShadInput
                    {...props}
                    id={id}
                    value={value}
                    onChange={onChange}
                    type={showPassword ? 'text' : 'password'}
                    className={twMerge('pr-10', className)}
                    ref={localRef}
                />
                <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center h-full hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                        <EyeOff className='h-4 w-4 text-gray-400' />
                    ) : (
                        <Eye className='h-4 w-4 text-gray-400' />
                    )}
                </Button>
                {children && children}
            </div>
            <div className='h-[20px]'>
                <InputError message={error} />
            </div>
        </div>
    );
});
