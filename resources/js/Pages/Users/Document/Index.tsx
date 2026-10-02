import Authenticated from '@/Layouts/AuthenticatedLayout';
import { TableData, TableHeaderType } from '@/Components/atomica/AtomicaTable';
import { PageProps } from '@/types';
import { router } from '@inertiajs/react';
import Modal from '@/Components/atomica/Utils/Modal';
import Hooks from '@/Components/atomica/Utils/Hooks';
import AtomicaTable from '@/Components/atomica/AtomicaTable';
import { Copy, Eye, Trash2, Pencil, ChevronDown, ChevronUp, Download, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import Helpers from '@/Components/atomica/Utils/Helpers';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import TitlePage from '@/Components/atomica/TitlePage';
import InputLabel from '@/Components/InputLabel';
import Combo from '@/Components/atomica/Utils/Combo';

export default function Index({
    documents,
    applied_filters,
    projects,
}: PageProps<{
    documents: TableData;
    applied_filters: Array<any>;
    projects: Array<any>;
}>) {
    const tableHeaders = [
        {
            label: 'Project',
            key: 'projects_list',
            sortable: true,
        },
        // {
        //     label: 'Num.',
        //     key: 'num',
        //     sortable: true,
        // },
        {
            label: 'Name',
            key: 'name',
            sortable: true,
        },
        {
            label: 'View',
            icon: <ExternalLink />,
            action: (item: any) => window.open(route('media.show', item.media[0].id), '_blank'),
            hideAction: (item: any) => !item.media[0],
        },
        {
            label: 'Download',
            icon: <Download />,
            action: (item: any) => window.open(route('media.download', item.media[0].id), '_blank'),
            hideAction: (item: any) => !item.media[0],
        },
    ];

    const [filters, setFilters] = useState<any>({
        role: '',
        search: '',
    });

    useEffect(() => {
        const filters = Helpers.indexFilters.setupFromResponse(applied_filters);
        setFilters((prev: typeof filters) => ({ ...prev, ...filters }));
    }, []);

    const modifiedDocuments = {
        ...documents,
        data: documents.data.map(document => ({
            ...document,
            name: <div className='flex items-center gap-2 font-semibold'>{document.name}</div>,
        })),
    };

    return (
        <Authenticated
            //title={'Users'}
            //description={'Lorem ipsum dolor sit amet adipiscit elit.'}
            onSearch={(value: string) => {
                const newFilter = { ...filters, search: value };
                setFilters(newFilter);

                if (value === '' || value.length >= 3) {
                    Helpers.getItems({
                        routeName: 'userdocument',
                        filter: newFilter, // cleanUpFilters will handle the role object transformation
                    });
                }
            }}
            search={filters?.search ? filters.search : ''}>
            <TitlePage title={'Documents'} description={''} actionText={'Add'} />

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
                                routeName: 'userdocument',
                                filter: newFilter,
                            });
                        }}
                        onClear={() => {
                            const newFilter = { ...filters, project: '' };
                            setFilters(newFilter);
                            Helpers.getItems({
                                routeName: 'userdocument',
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
                data={modifiedDocuments}
                onSort={sort =>
                    Helpers.getItems({
                        routeName: 'userdocument',
                        page: documents.current_page,
                        per_page: documents.per_page,
                        sort_by: sort,
                    })
                }
                sortBy={route().params?.sort ? String(route().params?.sort) : ''}
                description=''
            />
        </Authenticated>
    );
}
