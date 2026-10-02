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
    links,
    applied_filters,
    users,
    projects,
    categories,
}: PageProps<{
    links: TableData;
    applied_filters: Array<any>;
    users: Array<any>;
    projects: Array<any>;
    categories: Array<any>;
}>) {
    const useDeleteItem = Hooks.useDeleteItem({ routeName: 'link', only: 'links' });
    const isAdmin = UseHasRoleOrPermissions({ permissions: ['admin', 'all'] });
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const tableHeaders = [
        {
            label: 'Name',
            key: 'name',
            sortable: true,
        },
        {
            label: 'Categories',
            value: (item: any) => (
                <div className='flex flex-wrap gap-1'>
                    {item.categories?.map((category: any) => (
                        <span
                            key={category.id}
                            className='inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10'>
                            {category.name}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            label: 'Edit',
            icon: <Pencil />,
            action: (item: any) => router.visit(route('link.edit', item.id)),
        },
        {
            label: <span>{'Delete'}</span>,
            icon: <Trash2 />,
            danger: true,
            action: (item: { id: number }) => useDeleteItem.changeRecordToDelete(item.id),
        },
    ];

    const [filters, setFilters] = useState<any>({
        user: '',
        search: '',
        category: '',
        project: '',
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
                        routeName: 'link',
                        filter: newFilter, // cleanUpFilters will handle the role object transformation
                    });
                }
            }}
            search={filters?.search ? filters.search : ''}>
            <TitlePage
                title={'Link'}
                description={''}
                actionText={'Add'}
                action={() => router.visit(route('link.create'))}
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
                        className={`pt-5 pb-4 px-3 md:py-9 md:px-0 bg-white md:bg-none border md:border-0 grid md:grid-cols-3 gap-3 ${isFiltersOpen ? 'block rounded-b-md' : 'hidden md:grid'}`}>
                        <div className=''>
                            <InputLabel>{'Filter by category'}</InputLabel>
                            <Combo
                                items={categories}
                                displayValue={'name'}
                                selected={
                                    filters?.category
                                        ? categories.find((item: any) => item.id === filters.category)
                                        : ''
                                }
                                onChange={item => {
                                    const newFilter = { ...filters, category: item.id };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'link',
                                        filter: newFilter,
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, category: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'link',
                                        filter: newFilter,
                                    });
                                }}
                            />
                        </div>

                        <div className=''>
                            <InputLabel>{'Filter by assigned projects'}</InputLabel>
                            <Combo
                                items={projects}
                                displayValue={'name'}
                                selected={
                                    filters?.project ? projects.find((item: any) => item.id === filters.project) : ''
                                }
                                onChange={item => {
                                    const newFilter = { ...filters, project: item.id };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'link',
                                        filter: newFilter,
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, project: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'link',
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
                                selected={filters?.user ? users.find((item: any) => item.id === filters.user) : ''}
                                onChange={item => {
                                    const newFilter = { ...filters, user: item.id };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'link',
                                        filter: newFilter,
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, user: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'link',
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
                data={links}
                onSort={sort =>
                    Helpers.getItems({
                        routeName: 'link',
                        page: links.current_page,
                        per_page: links.per_page,
                        sort_by: sort,
                    })
                }
                sortBy={route().params?.sort ? String(route().params?.sort) : ''}
                description=''
            />
        </Authenticated>
    );
}
