import Authenticated from '@/Layouts/AuthenticatedLayout';
import { TableData, TableHeaderType } from '@/Components/atomica/AtomicaTable';
import { PageProps } from '@/types';
import { router } from '@inertiajs/react';
import Modal from '@/Components/atomica/Utils/Modal';
import Hooks from '@/Components/atomica/Utils/Hooks';
import AtomicaTable from '@/Components/atomica/AtomicaTable';
import { Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import Combo from '@/Components/atomica/Utils/Combo';
import { useEffect, useState } from 'react';
import Helpers from '@/Components/atomica/Utils/Helpers';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import { Button } from '@/Components/ui/button';
import TitlePage from '@/Components/atomica/TitlePage';

export default function Index({
    users,
    roles,
    applied_filters,
    companies,
    projects,
    links,
    questionnaires,
    documents,
}: PageProps<{
    users: TableData;
    roles: any;
    applied_filters: Array<any>;
    companies: Array<any>;
    projects: Array<any>;
    links: Array<any>;
    questionnaires: Array<any>;
    documents: Array<any>;
}>) {
    const useDeleteItem = Hooks.useDeleteItem({ routeName: 'user', only: 'users' });
    const isAdmin = UseHasRoleOrPermissions({ permissions: ['admin', 'all'] });
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const tableHeaders = [
        {
            label: 'Name',
            key: 'name',
            sortable: true,
        },
        {
            label: 'Surname',
            key: 'last_name',
            sortable: true,
        },
        {
            label: 'Type',
            key: 'role_name',
            sortable: true,
        },
        {
            label: 'Uploads',
            // icon: <Pencil />,
            value: (item: any) => {
                return (
                    item.uploads.length > 0 && (
                        <Button
                            variant='link'
                            className='text-green-300'
                            onClick={() => router.visit(route('user.uploads.index', item.id))}>
                            {'View'}
                        </Button>
                    )
                );
            },
            // action: (item: any) => router.visit(route('user.uploads', item.id)),
        },
        {
            label: 'Edit',
            icon: <Pencil />,
            action: (item: any) => router.visit(route('user.edit', item.id)),
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
        project: '',
        link: '',
        document: '',
        role: '',
        search: '',
    });

    useEffect(() => {
        const filters = Helpers.indexFilters.setupFromResponse(applied_filters, roles);
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
                        routeName: 'user',
                        filter: newFilter, // cleanUpFilters will handle the role object transformation
                    });
                }
            }}
            search={filters?.search ? filters.search : ''}>
            <TitlePage
                title={'Users'}
                description={''}
                actionText={'Add'}
                action={() => router.visit(route('user.create'))}
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
                        className={`pt-5 pb-4 px-3 md:py-9 md:px-0 bg-white md:bg-none border md:border-0 grid md:grid-cols-3 lg:grid-cols-5 gap-3 ${isFiltersOpen ? 'block rounded-b-md' : 'hidden md:grid'}`}>
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
                                        routeName: 'user',
                                        filter: newFilter,
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, project: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'user',
                                        filter: newFilter,
                                    });
                                }}
                            />
                        </div>

                        <div className=''>
                            <InputLabel>{'Filter by company'}</InputLabel>
                            <Combo
                                items={companies}
                                displayValue={'name'}
                                selected={
                                    filters?.company ? companies.find((item: any) => item.id === filters.company) : ''
                                }
                                onChange={item => {
                                    const newFilter = { ...filters, company: item.id };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'user',
                                        filter: newFilter,
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, company: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'user',
                                        filter: newFilter,
                                    });
                                }}
                            />
                        </div>

                        <div className=''>
                            <InputLabel>{'Filter by assigned link'}</InputLabel>
                            <Combo
                                items={links}
                                displayValue={'name'}
                                selected={filters?.link ? links.find((item: any) => item.id === filters.link) : ''}
                                onChange={item => {
                                    const newFilter = { ...filters, link: item.id };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'user',
                                        filter: newFilter,
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, link: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'user',
                                        filter: newFilter,
                                    });
                                }}
                            />
                        </div>

                        <div className=''>
                            <InputLabel>{'Filter by assigned documents'}</InputLabel>
                            <Combo
                                items={documents}
                                displayValue={'name'}
                                selected={
                                    filters?.document ? documents.find((item: any) => item.id === filters.document) : ''
                                }
                                onChange={item => {
                                    const newFilter = { ...filters, document: item.id };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'user',
                                        filter: newFilter,
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, document: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'user',
                                        filter: newFilter,
                                    });
                                }}
                            />
                        </div>

                        <div className=''>
                            <InputLabel>{'Filter by assigned surveys'}</InputLabel>
                            <Combo
                                items={questionnaires}
                                displayValue={'name'}
                                selected={
                                    filters?.questionnaire
                                        ? questionnaires.find((item: any) => item.id === filters.questionnaire)
                                        : ''
                                }
                                onChange={item => {
                                    const newFilter = { ...filters, questionnaire: item.id };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'user',
                                        filter: newFilter,
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, questionnaire: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'user',
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
                data={users}
                onSort={sort =>
                    Helpers.getItems({
                        routeName: 'user',
                        page: users.current_page,
                        per_page: users.per_page,
                        sort_by: sort,
                    })
                }
                sortBy={route().params?.sort ? String(route().params?.sort) : ''}
                description=''
            />
        </Authenticated>
    );
}
