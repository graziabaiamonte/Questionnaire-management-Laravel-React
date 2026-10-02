import { HTMLAttributes } from 'react';

export default function ApplicationLogo({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
    return (
        <span {...props} className={`inline-flex items-center justify-center font-semibold text-white ${className}`}>
            logo cliente
        </span>
    );
}
