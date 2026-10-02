import { ChangeEvent, DragEvent, useState } from 'react';
import { CloudUpload } from 'lucide-react';

export default function Dropzone({
    onChange,
    label,
    buttonText,
    error = '',
    id = 'dropzone-file',
}: {
    onChange: (file: any) => void;
    label: string;
    buttonText?: string;
    error?: string;
    id?: string;
}) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            onChange(file);
        }
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
        }
    };

    return (
        <div
            className={`flex items-center bg-white justify-center w-full ${error ? 'border-red-500' : 'border-input'} h-full max-h-full rounded-md border border-dashed transition-all`}>
            <label
                htmlFor={id}
                className={`${isDragging && 'bg-gray-200'} group flex flex-col items-center justify-center w-full h-64  rounded-lg cursor-pointer`}
                onDragEnter={handleDragEnter}
                onDragOver={e => {
                    e.preventDefault();
                }}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}>
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                    <CloudUpload className='w-12 h-12 text-gray-300 mb-2' />
                    <div className='mb-2 text-lg tracking-wider text-gray-500 '>
                        {error ? (
                            <span className='text-red-500'>{error}</span>
                        ) : (
                            <>
                                <p className='font-medium text-gray-300 text-xs text-center'>
                                    {label || 'Click or drag the file.'}
                                </p>
                                <p className='text-gray-300 text-xs text-center mt-2'>or</p>
                                <p className='text-center mt-3'>
                                    <span className={'text-white bg-gray-300 rounded-md text-xs py-2 px-3'}>
                                        {buttonText || 'Upload file'}
                                    </span>
                                </p>
                            </>
                        )}
                    </div>
                </div>
                <input onChange={handleFileInputChange} id={id} type='file' className='hidden' />
            </label>
        </div>
    );
}
