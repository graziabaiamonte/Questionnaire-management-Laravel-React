import { router } from '@inertiajs/react';
import { useState } from 'react';

// The idea here is to keep the code DRY, having a wrapper for several custom hooks that holds logic shared between components or pages

const useDeleteItem = ({ routeName, only }: { routeName?: string; only?: string }) => {
    const [recordToDelete, setRecordToDelete] = useState<number | number[] | null>(null);
    // const [trigger, setTrigger] = useState(false);

    // Can be triggered externally, passing all the params at once
    const Delete = (id?: string | number | Array<number> | null, routeName?: string | null) => {
        if (!id || !routeName) {
            return;
        }
        const bulk = Array.isArray(id);
        const url = bulk ? route(`${routeName}.destroy`) : route(`${routeName}.destroy`, id);

        router.visit(url, {
            preserveScroll: true,
            data: bulk
                ? {
                      ids: id,
                  }
                : {},
            preserveState: false,
            method: 'delete',
            onFinish: () => setRecordToDelete(null),
        });
    };

    const doDelete = () => {
        Delete(recordToDelete, routeName);
    };

    const changeRecordToDelete = (itemId: number | Array<number> | null) => {
        setRecordToDelete(itemId);
    };

    return { recordToDelete, changeRecordToDelete, doDelete, Delete };
};

export default {
    useDeleteItem: useDeleteItem,
};
