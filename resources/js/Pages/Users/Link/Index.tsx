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
    links,
    applied_filters,
    projects,
}: PageProps<{
    links: TableData;
    applied_filters: Array<any>;
    projects: Array<any>;
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
            label: '',
            key: 'credentials',
            sortable: false,
        },
        {
            label: 'Link',
            icon: <ExternalLink />,
            action: (item: any) => {
                window.open(item.link, '_blank');
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

    const [visibleCredentials, setVisibleCredentials] = useState<number[]>([]);

    const modifiedLinks = {
        ...links,
        data: links.data.map(link => ({
            ...link,
            name: <div className='flex items-center gap-2 font-semibold'>{link.name}</div>,
            credentials: (
                <>
                    <button
                        className='p-0 rounded-full text-green-300 flex items-center gap-2'
                        onClick={() => {
                            setVisibleCredentials(prev =>
                                prev.includes(link.id) ? prev.filter(id => id !== link.id) : [...prev, link.id],
                            );
                        }}>
                        {'Show credentials'}
                        <div className={visibleCredentials.includes(link.id) ? 'rotate-180' : ''}>
                            <svg width='8' height='5' viewBox='0 0 8 5' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M4 4.25L0.25 0.5H7.75L4 4.25Z' fill='#9BBF07' />
                            </svg>
                        </div>
                    </button>
                    {visibleCredentials.includes(link.id) && <div>{link.credentials}</div>}
                </>
            ),
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
                        routeName: 'userlink',
                        filter: newFilter, // cleanUpFilters will handle the role object transformation
                    });
                }
            }}
            search={filters?.search ? filters.search : ''}>
            <TitlePage title={'Links'} description={''} />

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
                                routeName: 'userlink',
                                filter: newFilter,
                            });
                        }}
                        onClear={() => {
                            const newFilter = { ...filters, project: '' };
                            setFilters(newFilter);
                            Helpers.getItems({
                                routeName: 'userlink',
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
                data={modifiedLinks}
                onSort={sort =>
                    Helpers.getItems({
                        routeName: 'userlink',
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
