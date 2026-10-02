import React, { useState, PropsWithChildren, ReactNode, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import SidebarLayout from '@/Components/atomica/SidebarLayout';
import { AcademicCapIcon, HashtagIcon } from '@heroicons/react/24/solid';
import Success from '@/Components/atomica/Alerts/Success';
import Error from '@/Components/atomica/Alerts/Error';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';
import {
    Book,
    BookOpen,
    CalendarDays,
    Clipboard,
    Building2,
    FileCheck,
    GraduationCap,
    Hash,
    HeartPulse,
    Home,
    Image,
    LayoutTemplate,
    LucideHome,
    MenuSquare,
    MessageCircleIcon,
    Newspaper,
    ScrollText,
    Users,
    Box,
    ShieldCheck,
    Link2,
    Grid2X2,
    Shapes,
    CircleUser,
    FileText,
    Lightbulb,
    CircleFadingArrowUp,
} from 'lucide-react';

export default function Authenticated({
    header,
    children,
    title,
    description,
    onSearch = null,
    search,
}: PropsWithChildren<{
    header?: ReactNode;
    title?: string;
    description?: string;
    onSearch?: ((value: string) => void) | null;
    search?: string;
}>) {
    /* This code is using the `usePage` hook from Inertia.js to access the `flash` data passed from the server to the
    client. The `flash` data is typically used to display success or error messages to the user after a form submission
    or other action. */
    const { flash, errors, auth } = usePage<PageProps>().props;
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LucideHome,
            current: route().current('dashboard'),
            hide: !UseHasRoleOrPermissions({ permissions: ['admin', 'all', 'manage_users'] }),
        },
        {
            name: 'Welcome',
            href: '/user-area/welcome',
            icon: LucideHome,
            current: route().current('welcome'),
            hide: UseHasRoleOrPermissions({ permissions: ['admin', 'all', 'manage_users'] }),
        },
        {
            name: 'Projects',
            href: route('project.index'),
            icon: Shapes,
            current: route().current('project.*'),
            hide: !UseHasRoleOrPermissions({ permissions: ['admin', 'all', 'manage_users'] }),
        },
        {
            name: 'Companies',
            href: route('company.index'),
            icon: Building2,
            current: route().current('company.*'),
            hide: !UseHasRoleOrPermissions({ permissions: ['admin', 'all', 'manage_users'] }),
        },
        {
            name: 'Users',
            href: route('user.index'),
            icon: CircleUser,
            current: route().current('user.*'),
            hide: !UseHasRoleOrPermissions({ permissions: ['admin', 'all', 'manage_users'] }),
        },
        {
            name: "Content's category",
            href: route('category.index'),
            icon: Grid2X2,
            current: route().current('category.*'),
            hide: !UseHasRoleOrPermissions({ permissions: ['admin', 'all', 'manage_users'] }),
        },
        {
            name: 'Link',
            href: route('link.index'),
            icon: Link2,
            current: route().current('link.*'),
            hide: !UseHasRoleOrPermissions({ permissions: ['admin', 'all', 'manage_users'] }),
        },
        {
            name: 'Documents',
            href: route('document.index'),
            icon: FileText,
            current: route().current('document.*'),
            hide: !UseHasRoleOrPermissions({ permissions: ['admin', 'all', 'manage_users'] }),
        },
        {
            name: 'Surveys',
            href: route('questionnaire.index'),
            icon: Clipboard,
            current: route().current('questionnaire.*'),
            hide: !UseHasRoleOrPermissions({ permissions: ['admin', 'all', 'manage_users'] }),
        },
        //user page
        {
            name: 'Link',
            href: route('userlink.index'),
            icon: Lightbulb,
            current: route().current('userlink.*'),
            hide: UseHasRoleOrPermissions({ permissions: ['admin', 'all', 'manage_users'] }),
        },
        {
            name: 'Documents',
            href: route('userdocument.index'),
            icon: FileText,
            current: route().current('userdocument.*'),
            hide: UseHasRoleOrPermissions({ permissions: ['admin', 'all', 'manage_users'] }),
        },
        {
            name: 'Surveys',
            href: route('userquestionnaire.index'),
            icon: Clipboard,
            current: route().current('userquestionnaire.*'),
            hide: UseHasRoleOrPermissions({ permissions: ['admin', 'all', 'manage_users'] }),
        },
        {
            name: 'Uploads',
            href: route('userupload.index'),
            icon: CircleFadingArrowUp,
            current: route().current('userupload.*'),
            hide: UseHasRoleOrPermissions({ permissions: ['admin', 'all', 'manage_users'] }),
        },
    ];

    useEffect(() => {
        if (flash.success) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        }
    }, [flash]);

    useEffect(() => {
        if (!(Object.keys(errors).length === 0)) {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    }, [errors]);

    return (
        <SidebarLayout
            onSearch={onSearch}
            search={search}
            user={auth.user}
            title={title}
            description={description}
            items={navigation}>
            <Success show={success} message={flash.success ?? 'Success'}></Success>
            <Error show={error} message={Object.values(errors).join(',') ?? 'Error'}></Error>
            {children}
        </SidebarLayout>
    );
}
