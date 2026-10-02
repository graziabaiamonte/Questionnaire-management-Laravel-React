import Authenticated from '@/Layouts/AuthenticatedLayout';
import { TableData, TableHeaderType } from '@/Components/atomica/AtomicaTable';
import { PageProps, Questionnaire } from '@/types';
import { router } from '@inertiajs/react';
import Modal from '@/Components/atomica/Utils/Modal';
import Hooks from '@/Components/atomica/Utils/Hooks';
import AtomicaTable from '@/Components/atomica/AtomicaTable';
import { Trash2, Pencil, Download, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import Helpers from '@/Components/atomica/Utils/Helpers';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import TitlePage from '@/Components/atomica/TitlePage';
import InputLabel from '@/Components/InputLabel';
import Combo from '@/Components/atomica/Utils/Combo';

export default function Index({
    questionnaire,
    questionnaire_user_states,
    applied_filters,
}: PageProps<{
    questionnaire: Questionnaire;
    questionnaire_user_states: TableData;
    applied_filters: Array<any>;
}>) {
    const tableHeaders = [
        {
            label: 'User name',
            key: 'user_fullname',
            sortable: true,
        },
        {
            label: 'View answers',
            icon: <Eye />,
            action: (item: any) => {
                router.visit(route('questionnaireanswer.edit', item.id));
            },
        },
    ];

    const [filters, setFilters] = useState<any>({
        search: '',
    });

    useEffect(() => {
        const filters = Helpers.indexFilters.setupFromResponse(applied_filters);
        setFilters((prev: typeof filters) => ({ ...prev, ...filters }));
    }, []);

    const questionnaire_name = questionnaire?.name || '';

    return (
        <Authenticated
            //title={'Users'}
            //description={'Lorem ipsum dolor sit amet adipiscit elit.'}
            onSearch={(value: string) => {
                const newFilter = { ...filters, search: value };
                setFilters(newFilter);

                if (value === '' || value.length >= 3) {
                    Helpers.getItems({
                        routeName: 'questionnaireanswer',
                        filter: newFilter, // cleanUpFilters will handle the role object transformation
                    });
                }
            }}
            search={filters?.search ? filters.search : ''}>
            <TitlePage
                title={`Answers to survey "${questionnaire_name}"`}
                description={''}
                actionText={'Download'}
                action={() => {
                    window.open(route('questionnaireanswerexport.export', questionnaire.id), '_blank');
                }}
                iconAction={<Download width={'14px'} height={'14px'} className='ml-2.5' />}
                actionText2={'Back'}
                action2={() => {
                    router.visit(route('questionnaire.index'));
                }}
            />

            <div className='size-9'></div>

            <AtomicaTable
                //actionText={'Crea utente'}
                //action={() => router.visit(route('user.create'))}
                headers={tableHeaders as Array<TableHeaderType>}
                data={questionnaire_user_states}
                onSort={sort =>
                    Helpers.getItems({
                        routeName: 'questionnaireanswer',
                        page: questionnaire_user_states.current_page,
                        per_page: questionnaire_user_states.per_page,
                        sort_by: sort,
                    })
                }
                sortBy={route().params?.sort ? String(route().params?.sort) : ''}
                description=''
            />
        </Authenticated>
    );
}
