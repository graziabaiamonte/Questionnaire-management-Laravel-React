import Authenticated from '@/Layouts/AuthenticatedLayout';
import { TableData, TableHeaderType } from '@/Components/atomica/AtomicaTable';
import { PageProps } from '@/types';
import { router } from '@inertiajs/react';
import Modal from '@/Components/atomica/Utils/Modal';
import Hooks from '@/Components/atomica/Utils/Hooks';
import AtomicaTable from '@/Components/atomica/AtomicaTable';
import { Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import Helpers from '@/Components/atomica/Utils/Helpers';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import TitlePage from '@/Components/atomica/TitlePage';
import InputLabel from '@/Components/InputLabel';
import Combo from '@/Components/atomica/Utils/Combo';

export default function Index({
    projects,
    applied_filters,
    companies,
    users,
}: PageProps<{ projects: TableData; applied_filters: Array<any>; companies: Array<any>; users: Array<any> }>) {
    const useDeleteItem = Hooks.useDeleteItem({ routeName: 'project', only: 'projects' });
    const isAdmin = UseHasRoleOrPermissions({ permissions: ['admin', 'all'] });
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const tableHeaders = [
        {
            label: 'Name',
            key: 'name',
            sortable: true,
        },
        {
            label: 'Edit',
            icon: <Pencil />,
            action: (item: any) => router.visit(route('project.edit', item.id)),
        },
        {
            label: <span>{'Delete'}</span>,
            icon: <Trash2 />,
            danger: true,
            action: (item: { id: number }) => useDeleteItem.changeRecordToDelete(item.id),
        },
    ];

    const [filters, setFilters] = useState<any>({
        company: '',
        user: '',
        search: '',
    });

    useEffect(() => {
        const filters = Helpers.indexFilters.setupFromResponse(applied_filters);
        setFilters((prev: typeof filters) => ({ ...prev, ...filters }));
    }, []);

    return (
        <Authenticated
            //title={'Users'}
            //description={'Lorem ipsum dolor sit amet adipiscit elit.'}
            onSearch={(value: string) => {
                const newFilter = { ...filters, search: value };
                setFilters(newFilter);

                if (value === '' || value.length >= 3) {
                    Helpers.getItems({
                        routeName: 'project',
                        filter: newFilter, // cleanUpFilters will handle the role object transformation
                    });
                }
            }}
            search={filters?.search ? filters.search : ''}>
            <TitlePage
                title={'Projects'}
                description={''}
                actionText={'Add'}
                action={() => router.visit(route('project.create'))}
            />
            <Modal
                type='danger'
                onClose={() => useDeleteItem.changeRecordToDelete(null)}
                onConfirm={() => useDeleteItem.doDelete()}
                show={Boolean(useDeleteItem.recordToDelete)}
            />

            {isAdmin && (
                <>
                    <button
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        className={`w-full flex items-center justify-between p-4 mt-9 text-left text-white bg-gray-500 hover:opacity-90 md:hidden ${isFiltersOpen ? 'rounded-t-md' : 'rounded-md'}`}>
                        <span className='font-medium'>Filtri</span>
                        {isFiltersOpen ? <ChevronUp className='h-5 w-5' /> : <ChevronDown className='h-5 w-5' />}
                    </button>

                    <div
                        className={`pt-5 pb-4 px-3 md:py-9 md:px-0 bg-white md:bg-none border md:border-0 grid md:grid-cols-2 gap-3 ${isFiltersOpen ? 'block rounded-b-md' : 'hidden md:grid'}`}>
                        <div className=''>
                            <InputLabel>{'Filter by company'}</InputLabel>
                            <Combo
                                items={companies}
                                displayValue={'name'}
                                //selected={filters.company}
                                selected={
                                    filters?.company ? companies.find((item: any) => item.id === filters.company) : ''
                                }
                                onChange={item => {
                                    const newFilter = { ...filters, company: item.id };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'project',
                                        filter: { ...newFilter, company: item.id },
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, company: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'project',
                                        filter: newFilter,
                                    });
                                }}
                            />
                        </div>
                        <div className=''>
                            <InputLabel>{'Filter by assigned users'}</InputLabel>
                            <Combo
                                items={users}
                                displayValue={'full_name'}
                                //selected={filters.user}
                                selected={filters?.user ? users.find((item: any) => item.id === filters.user) : ''}
                                onChange={item => {
                                    const newFilter = { ...filters, user: item.id };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'project',
                                        filter: { ...newFilter, user: item.id },
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, user: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'project',
                                        filter: newFilter,
                                    });
                                }}
                            />
                        </div>
                    </div>
                </>
            )}

            <div className='size-9'></div>

            <AtomicaTable
                //actionText={'Crea utente'}
                //action={() => router.visit(route('user.create'))}
                headers={tableHeaders as Array<TableHeaderType>}
                data={projects}
                onSort={sort =>
                    Helpers.getItems({
                        routeName: 'project',
                        page: projects.current_page,
                        per_page: projects.per_page,
                        sort_by: sort,
                    })
                }
                sortBy={route().params?.sort ? String(route().params?.sort) : ''}
                description=''
            />
        </Authenticated>
    );
}
