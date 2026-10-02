import Authenticated from '@/Layouts/AuthenticatedLayout';
import { TableData, TableHeaderType } from '@/Components/atomica/AtomicaTable';
import { PageProps } from '@/types';
import { router } from '@inertiajs/react';
import Modal from '@/Components/atomica/Utils/Modal';
import Hooks from '@/Components/atomica/Utils/Hooks';
import AtomicaTable from '@/Components/atomica/AtomicaTable';
import { Trash2, Pencil, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import Helpers from '@/Components/atomica/Utils/Helpers';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import TitlePage from '@/Components/atomica/TitlePage';
import InputLabel from '@/Components/InputLabel';
import Combo from '@/Components/atomica/Utils/Combo';

export default function Index({
    questionnaires,
    applied_filters,
    projects,
    categories,
}: PageProps<{
    questionnaires: TableData;
    applied_filters: Array<any>;
    projects: Array<any>;
    categories: Array<any>;
}>) {
    const tableHeaders = [
        {
            label: 'Project',
            key: 'projects_list',
            sortable: true,
        },
        {
            label: 'Name',
            key: 'name',
            sortable: true,
        },
        {
            label: 'Categories',
            key: 'categories',
            value: (item: any) => (
                <div className='flex flex-wrap gap-1'>
                    {item.categories?.map((category: any, index: number) => (
                        <span
                            //key={category.id}
                            key={index}
                            className='inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10'>
                            {category.name}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            label: 'State',
            value: (item: any) => {
                // Check if the questionnaire is manually closed
                if (item.closed) {
                    return (
                        <span
                            className='inline-flex items-center rounded-md px-2 py-1 text-xs font-medium 
                                       bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'>
                            {'Closed'}
                        </span>
                    );
                }

                // Get effective trigger - from questionnaire or from project
                const effectiveTrigger =
                    item.questionnaire_close_trigger?.value ||
                    (item.projects?.length > 0 ? item.projects[0]?.questionnaire_close_trigger?.value : 'manual');

                // Check if auto-closed (user has already answered)
                const isAutoCloseTriggered =
                    effectiveTrigger === 'auto' && Object.keys(item.questionnaire_user_state).length > 0;

                if (isAutoCloseTriggered) {
                    return (
                        <span
                            className='inline-flex items-center rounded-md px-2 py-1 text-xs font-medium 
                                       bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20'>
                            {'Completed'}
                        </span>
                    );
                }

                // Otherwise show open
                return (
                    <span
                        className='inline-flex items-center rounded-md px-2 py-1 text-xs font-medium 
                                   bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'>
                        {'Open'}
                    </span>
                );
            },
        },
        {
            label: 'End Date',
            key: 'closed_at',
        },
        {
            label: 'View',
            icon: <ExternalLink />,
            action: (item: any) => {
                if (Object.keys(item.questionnaire_user_state).length > 0) {
                    router.visit(route('userquestionnaire.edit', item.id));
                } else {
                    router.visit(route('userquestionnaire.answer', item.id));
                }
            },
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
                        routeName: 'userquestionnaire',
                        filter: newFilter, // cleanUpFilters will handle the role object transformation
                    });
                }
            }}
            search={filters?.search ? filters.search : ''}>
            <TitlePage title={'Surveys'} description={''} />

            <div className='px-0 grid grid-cols-3 gap-3 my-9'>
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
                                routeName: 'userquestionnaire',
                                filter: newFilter,
                            });
                        }}
                        onClear={() => {
                            const newFilter = { ...filters, project: '' };
                            setFilters(newFilter);
                            Helpers.getItems({
                                routeName: 'userquestionnaire',
                                filter: newFilter,
                            });
                        }}
                    />
                </div>
            </div>

            <div className='size-9'></div>

            <AtomicaTable
                //actionText={'Crea utente'}
                //action={() => router.visit(route('user.create'))}
                headers={tableHeaders as Array<TableHeaderType>}
                data={questionnaires}
                onSort={sort =>
                    Helpers.getItems({
                        routeName: 'userquestionnaire',
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
