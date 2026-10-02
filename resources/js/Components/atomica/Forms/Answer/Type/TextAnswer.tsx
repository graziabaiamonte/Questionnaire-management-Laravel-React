import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';

export default function TextAnswer() {
    return (
        <div className='grid gap-3 grid-cols-1 mt-3'>
            <div>
                <Textarea className='mt-2' value={''} />
            </div>
        </div>
    );
}
