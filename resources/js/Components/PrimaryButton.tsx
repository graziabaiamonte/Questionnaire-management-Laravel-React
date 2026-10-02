import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-[25px] border border-transparent bg-green-300 px-7 py-3.5 h-auto w-auto  px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-600 transition duration-150 ease-in-out hover:bg-gray-700 hover:text-white focus:text-white focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}>
            {children}
        </button>
    );
}
