import { router, useForm } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { TableData, TableHeaderType } from '@/Components/atomica/AtomicaTable';
import Modal from '@/Components/atomica/Utils/Modal';
import Helpers from '@/Components/atomica/Utils/Helpers';
import Hooks from '@/Components/atomica/Utils/Hooks';
import AtomicaTable from '@/Components/atomica/AtomicaTable';
import { Trash2, Eye, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import Combo from '@/Components/atomica/Utils/Combo';
import TitlePage from '@/Components/atomica/TitlePage';

export default function Uploads({
    user,
    uploads,
    applied_filters,
    projects,
}: {
    user: any;
    uploads: any;
    applied_filters: Array<any>;
    projects: Array<any>;
}) {
    const useDeleteItem = Hooks.useDeleteItem({ routeName: 'user.uploads', only: 'uploads' });
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [filters, setFilters] = useState<any>({
        project: '',
        search: '',
    });

    const tableHeaders: Array<TableHeaderType> = [
        {
            label: 'Name',
            key: 'name',
            sortable: true,
        },
        {
            label: 'Project',
            key: 'project',
            // value: (item: any) => item.project?.name || 'Nessun progetto',
        },
        {
            label: 'Data',
            key: 'created_at',
            sortable: true,
        },
        {
            label: 'View',
            icon: <Eye />,
            action: (item: any) => window.open(route('media.show', item.media[0].id), '_blank'),
            hideAction: (item: any) => !item.media[0],
        },
        {
            label: 'Download',
            icon: <Download />,
            action: (item: any) => window.open(route('media.download', item.media[0].id), '_blank'),
            hideAction: (item: any) => !item.media[0],
        },
        {
            label: <span>{'Delete'}</span>,
            icon: <Trash2 />,
            danger: true,
            action: (item: { id: number }) => useDeleteItem.changeRecordToDelete(item.id),
        },
    ];

    return (
        <Authenticated
            // title={''}
            // description={''}
            onSearch={(value: string) => {
                const newFilter = { ...filters, search: value };
                setFilters(newFilter);

                if (value === '' || value.length >= 3) {
                    Helpers.getItems({
                        routeName: `user.uploads`,
                        routeParams: { user: user.id },
                        filter: newFilter,
                    });
                }
            }}
            search={filters?.search ? filters.search : ''}>
            <TitlePage
                title={`${user.name}'s Uploads`}
                description={''}
                actionText2={'Back'}
                action2={() => router.visit(route('user.index'))}
            />
            <Modal
                type='danger'
                onClose={() => useDeleteItem.changeRecordToDelete(null)}
                onConfirm={() => useDeleteItem.doDelete()}
                show={Boolean(useDeleteItem.recordToDelete)}
            />

            <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`w-full flex items-center justify-between p-4 mt-9 text-left text-white bg-gray-500 hover:opacity-90 md:hidden ${isFiltersOpen ? 'rounded-t-md' : 'rounded-md'}`}>
                <span className='font-medium'>Filtri</span>
                {isFiltersOpen ? <ChevronUp className='h-5 w-5' /> : <ChevronDown className='h-5 w-5' />}
            </button>

            <div
                className={`pt-5 pb-4 px-3 md:py-9 md:px-0 bg-white md:bg-none border md:border-0 grid md:grid-cols-2 gap-3 ${isFiltersOpen ? 'block rounded-b-md' : 'hidden md:grid'}`}>
                <div className=''>
                    <InputLabel>{'Filter by assigned projects'}</InputLabel>
                    <Combo
                        items={projects}
                        displayValue={'name'}
                        selected={filters?.project ? projects.find((item: any) => item.id === filters.project) : ''}
                        onChange={item => {
                            const newFilter = { ...filters, project: item.id };
                            setFilters(newFilter);
                            Helpers.getItems({
                                routeName: 'user.uploads',
                                routeParams: { user: user.id },
                                filter: newFilter,
                            });
                        }}
                        onClear={() => {
                            const newFilter = { ...filters, project: '' };
                            setFilters(newFilter);
                            Helpers.getItems({
                                routeName: 'user.uploads',
                                routeParams: { user: user.id },
                                filter: newFilter,
                            });
                        }}
                    />
                </div>
            </div>

            <AtomicaTable
                headers={tableHeaders as Array<TableHeaderType>}
                data={uploads}
                onSort={sort =>
                    Helpers.getItems({
                        routeName: 'user.uploads',
                        routeParams: { user: user.id },
                        page: uploads.current_page,
                        per_page: uploads.per_page,
                        sort_by: sort,
                    })
                }
                sortBy={route().params?.sort ? String(route().params?.sort) : ''}
                description=''
            />
        </Authenticated>
    );
}
