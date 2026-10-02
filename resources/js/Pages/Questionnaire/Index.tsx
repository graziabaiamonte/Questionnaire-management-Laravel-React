import Authenticated from '@/Layouts/AuthenticatedLayout';
import { TableData, TableHeaderType } from '@/Components/atomica/AtomicaTable';
import { PageProps } from '@/types';
import { router } from '@inertiajs/react';
import Modal from '@/Components/atomica/Utils/Modal';
import Hooks from '@/Components/atomica/Utils/Hooks';
import AtomicaTable from '@/Components/atomica/AtomicaTable';
import { Trash2, Pencil, ChevronDown, ChevronUp, Eye, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import Helpers from '@/Components/atomica/Utils/Helpers';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import TitlePage from '@/Components/atomica/TitlePage';
import InputLabel from '@/Components/InputLabel';
import Combo from '@/Components/atomica/Utils/Combo';

export default function Index({
    questionnaires,
    applied_filters,
    users,
    projects,
    categories,
}: PageProps<{
    questionnaires: TableData;
    applied_filters: Array<any>;
    users: Array<any>;
    projects: Array<any>;
    categories: Array<any>;
}>) {
    const useDeleteItem = Hooks.useDeleteItem({ routeName: 'questionnaire', only: 'questionnaires' });
    const isAdmin = UseHasRoleOrPermissions({ permissions: ['admin', 'all'] });
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const tableHeaders = [
        {
            label: 'Name',
            key: 'name',
            sortable: true,
        },
        {
            label: 'Projects',
            value: (item: any) => (
                <div className='flex flex-wrap gap-1'>
                    {item.projects?.map((project: any, index: number) => (
                        <span key={project.id} className='inline-flex items-center'>
                            {project.name}
                            {index < item.projects.length - 1 && ','}
                        </span>
                    ))}
                </div>
            ),
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
            label: 'State',
            value: (item: any) => (
                <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        item.closed
                            ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                            : 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                    }`}>
                    {item.closed ? 'Chiuso' : 'Aperto'}
                </span>
            ),
        },
        {
            label: 'View Answers',
            icon: <Eye />,
            action: (item: any) => router.visit(route('questionnaireanswer.index', item.id)),
            hideAction: (item: any) => !item.has_answers,
        },
        {
            label: 'End Date',
            key: 'closed_at',
        },
        {
            label: 'Edit',
            icon: <Pencil />,
            action: (item: any) => router.visit(route('questionnaire.edit', item.id)),
        },
        {
            label: 'Clone',
            icon: <Copy />,
            action: (item: any) => {
                router.post(
                    route('questionnaire.clone', item.id),
                    {},
                    {
                        preserveState: true,
                        preserveScroll: true,
                    },
                );
            },
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
                        routeName: 'questionnaire',
                        filter: newFilter, // cleanUpFilters will handle the role object transformation
                    });
                }
            }}
            search={filters?.search ? filters.search : ''}>
            <TitlePage
                title={'Surveys'}
                description={''}
                actionText={'Add'}
                action={() => router.visit(route('questionnaire.create'))}
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
                                        routeName: 'questionnaire',
                                        filter: newFilter,
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, category: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'questionnaire',
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
                                        routeName: 'questionnaire',
                                        filter: newFilter,
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, project: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'questionnaire',
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
                                        routeName: 'questionnaire',
                                        filter: newFilter,
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, user: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'questionnaire',
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
                data={questionnaires}
                onSort={sort =>
                    Helpers.getItems({
                        routeName: 'questionnaire',
                        page: questionnaires.current_page,
                        per_page: questionnaires.per_page,
                        sort_by: sort,
                    })
                }
                sortBy={route().params?.sort ? String(route().params?.sort) : ''}
                description=''
            />
        </Authenticated>
    );
}
