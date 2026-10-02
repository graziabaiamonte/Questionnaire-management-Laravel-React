import { usePage } from '@inertiajs/react';
import { PageProps, EnumShape } from '@/types';
import Combo from './Combo';
import { Label } from '@/Components/ui/label';

type StatusComboProps = {
    value: number;
    onChange: (value: number) => void;
    error?: string;
    label?: string;
};

export default function StatusCombo({ value, onChange, error, label = 'Status' }: StatusComboProps) {
    const { activeStates } = usePage<PageProps>().props;

    return (
        <div>
            <Label className='block text-sm font-normal leading-6 text-gray-500'>{label}</Label>
            <Combo
                items={activeStates}
                error={error}
                selected={activeStates.find((state: EnumShape) => Number(state.value) === value)}
                //label={label}
                displayValue='description'
                onChange={(status: EnumShape) => onChange(Number(status.value))}
            />
        </div>
    );
}
