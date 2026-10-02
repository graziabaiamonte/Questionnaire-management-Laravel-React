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
    categories,
    applied_filters,
    links,
    documents,
    questionnaires,
}: PageProps<{
    categories: TableData;
    applied_filters: Array<any>;
    links: Array<any>;
    documents: Array<any>;
    questionnaires: Array<any>;
}>) {
    const useDeleteItem = Hooks.useDeleteItem({ routeName: 'category', only: 'categories' });
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
            action: (item: any) => router.visit(route('category.edit', item.id)),
        },
        {
            label: <span>{'Delete'}</span>,
            icon: <Trash2 />,
            danger: true,
            action: (item: { id: number }) => useDeleteItem.changeRecordToDelete(item.id),
        },
    ];

    const [filters, setFilters] = useState<any>({
        link: '',
        document: '',
        questionnaire: '',
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
                        routeName: 'category',
                        filter: newFilter, // cleanUpFilters will handle the role object transformation
                    });
                }
            }}
            search={filters?.search ? filters.search : ''}>
            <TitlePage
                title={"Content's category"}
                description={''}
                actionText={'Add'}
                action={() => router.visit(route('category.create'))}
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
                            <InputLabel>{'Filter by assigned link'}</InputLabel>
                            <Combo
                                items={links}
                                displayValue={'name'}
                                selected={filters?.link ? links.find((item: any) => item.id === filters.link) : ''}
                                onChange={item => {
                                    const newFilter = { ...filters, link: item.id };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'category',
                                        filter: newFilter,
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, link: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'category',
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
                                        routeName: 'category',
                                        filter: newFilter,
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, document: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'category',
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
                                        routeName: 'category',
                                        filter: newFilter,
                                    });
                                }}
                                onClear={() => {
                                    const newFilter = { ...filters, questionnaire: '' };
                                    setFilters(newFilter);
                                    Helpers.getItems({
                                        routeName: 'category',
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
                data={categories}
                onSort={sort =>
                    Helpers.getItems({
                        routeName: 'category',
                        page: categories.current_page,
                        per_page: categories.per_page,
                        sort_by: sort,
                    })
                }
                sortBy={route().params?.sort ? String(route().params?.sort) : ''}
                description=''
            />
        </Authenticated>
    );
}
