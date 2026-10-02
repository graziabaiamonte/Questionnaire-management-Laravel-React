import React, { Fragment, useState } from 'react';
import { Dialog, Menu, Disclosure, Transition } from '@headlessui/react';
import { Bars3Icon, Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Link } from '@inertiajs/react';
import { User } from '@/types';
import { Method } from '@inertiajs/core';
import { Button, buttonVariants } from '@/Components/ui/button';
import { Settings, LogOut } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import UseHasRoleOrPermissions from '@/Hooks/UseHasRoleOrPermissions';

const teams = [{ id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false }];
const userNavigation = [
    {
        name: 'Your profile',
        href: route('profile.edit'),
        method: 'get' as Method,
    },
    {
        name: 'Log out',
        href: route('logout'),
        method: 'post' as Method,
    },
];

function classNames(...classes: Array<string>) {
    return classes.filter(Boolean).join(' ');
}

export default function SidebarLayout({
    children,
    items,
    title,
    description,
    user,
    onSearch,
    search,
}: {
    children: React.ReactNode;
    items: Array<any>;
    title?: string | null | undefined;
    description?: string | null | undefined;
    user: User;
    onSearch?: ((value: string) => void) | null;
    search?: string | null;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    return (
        <div>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as='div' className='relative z-50 lg:hidden' onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter='transition-opacity ease-linear duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='transition-opacity ease-linear duration-300'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'>
                        <div className='fixed inset-0 bg-gray-900/80' />
                    </Transition.Child>

                    <div className='fixed inset-0 flex'>
                        <Transition.Child
                            as={Fragment}
                            enter='transition ease-in-out duration-300 transform'
                            enterFrom='-translate-x-full'
                            enterTo='translate-x-0'
                            leave='transition ease-in-out duration-300 transform'
                            leaveFrom='translate-x-0'
                            leaveTo='-translate-x-full'>
                            <Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1'>
                                <Transition.Child
                                    as={Fragment}
                                    enter='ease-in-out duration-300'
                                    enterFrom='opacity-0'
                                    enterTo='opacity-100'
                                    leave='ease-in-out duration-300'
                                    leaveFrom='opacity-100'
                                    leaveTo='opacity-0'>
                                    <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
                                        <button
                                            type='button'
                                            className='-m-2.5 p-2.5'
                                            onClick={() => setSidebarOpen(false)}>
                                            <span className='sr-only'>Close sidebar</span>
                                            <XMarkIcon className='h-6 w-6 text-white' aria-hidden='true' />
                                        </button>
                                    </div>
                                </Transition.Child>
                                {/* Sidebar component, swap this element with another sidebar if you like */}
                                <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-gray-500 ring-1 ring-white/10'>
                                    <nav className='flex flex-1 flex-col'>
                                        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                                            <li>
                                                <ul role='list' className='mt-5'>
                                                    {items.map((item, i) => (
                                                        <div key={i}>
                                                            {!item?.hide && (
                                                                <>
                                                                    <li>
                                                                        <Disclosure>
                                                                            <div className='relative'>
                                                                                <Link
                                                                                    href={item.href}
                                                                                    className={buttonVariants({
                                                                                        variant:
                                                                                            item.current ||
                                                                                            item.children?.find(
                                                                                                (childItem: any) =>
                                                                                                    childItem.current,
                                                                                            )
                                                                                                ? 'default'
                                                                                                : 'ghost',
                                                                                        className: `btn-start h-[50px] pl-[10px] w-[95%] rounded-r-[25px] rounded-l-none`,
                                                                                    })}>
                                                                                    <item.icon
                                                                                        className='h-[20px] mr-2 shrink-0'
                                                                                        aria-hidden='true'
                                                                                    />
                                                                                    {item.name}
                                                                                </Link>
                                                                                {item.children && (
                                                                                    <Disclosure.Button className='absolute top-1/2 right-4 -translate-y-2/4	h-full flex justify-items-center items-center'>
                                                                                        <ChevronDownIcon
                                                                                            className='h-5 w-5 text-gray-400'
                                                                                            aria-hidden='true'
                                                                                        />
                                                                                    </Disclosure.Button>
                                                                                )}
                                                                            </div>
                                                                            {item.children && (
                                                                                <Disclosure.Panel
                                                                                    className={'bg-gray-100'}>
                                                                                    <ul>
                                                                                        {item.children.map(
                                                                                            (
                                                                                                childItem: any,
                                                                                                y: number,
                                                                                            ) =>
                                                                                                !childItem?.hide && (
                                                                                                    <li key={y}>
                                                                                                        <Link
                                                                                                            href={
                                                                                                                childItem.href
                                                                                                            }
                                                                                                            className={buttonVariants(
                                                                                                                {
                                                                                                                    variant:
                                                                                                                        childItem.current
                                                                                                                            ? 'default'
                                                                                                                            : 'ghost',
                                                                                                                    className: `btn-start w-full h-[50px] pl-[10px]`,
                                                                                                                },
                                                                                                            )}>
                                                                                                            {
                                                                                                                childItem.name
                                                                                                            }
                                                                                                        </Link>
                                                                                                    </li>
                                                                                                ),
                                                                                        )}
                                                                                    </ul>
                                                                                </Disclosure.Panel>
                                                                            )}
                                                                        </Disclosure>
                                                                    </li>
                                                                </>
                                                            )}
                                                        </div>
                                                    ))}
                                                </ul>
                                            </li>
                                            {/* {UseHasRoleOrPermissions({ permissions: ['admin', 'all'] }) && ( */}
                                            <Button
                                                className={'h-[50px] text-left justify-start'}
                                                asChild
                                                variant={
                                                    !route().current('admin.settings.*')
                                                        ? 'ghost'
                                                        : ('' as unknown as null)
                                                }>
                                                <Button
                                                    className={
                                                        'h-[50px] text-left mt-auto justify-start text-sm font-normal bg-gray-600 w-[95%] rounded-none rounded-tr-[25px] hover:text-gray-600'
                                                    }
                                                    asChild
                                                    // variant={
                                                    //     !route().current('admin.settings.*')
                                                    //         ? 'ghost'
                                                    //         : ('' as unknown as null)
                                                    // }>
                                                >
                                                    <Link
                                                        href={route('logout')}
                                                        method='post'
                                                        className='text-white text-opacity-50 hover:text-white hover:text-opacity-100'>
                                                        <LogOut
                                                            className='h-[18px] mr-2 w-6 shrink-0 w-[18px]'
                                                            aria-hidden='true'
                                                        />{' '}
                                                        Logout
                                                    </Link>
                                                </Button>
                                            </Button>
                                            {/* )} */}
                                        </ul>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div
                    /* The above code appears to be a comment in a TypeScript React file. It is using the triple slash
                    comment syntax (///) to provide a brief description or explanation of the code that follows. The
                    comment mentions "border-accent" which could be a CSS class or style used for adding an accent
                    border to an element in the React component. */
                    className='flex grow flex-col gap-y-5 overflow-y-auto bg-gray-500 border-r-2 border-accent'>
                    <div className='flex h-16 pl-[1rem] shrink-0 items-center  mt-[15px]'>
                        <ApplicationLogo className='w-auto h-12' />
                    </div>
                    <nav className='flex flex-1 flex-col'>
                        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                            <li>
                                <ul role='list' className=''>
                                    {items.map(
                                        (item, i) =>
                                            !item?.hide && (
                                                <li key={i}>
                                                    <Disclosure>
                                                        <div className='relative'>
                                                            <Link
                                                                href={item.href}
                                                                className={buttonVariants({
                                                                    variant:
                                                                        item.current ||
                                                                        item.children?.find(
                                                                            (childItem: any) => childItem.current,
                                                                        )
                                                                            ? 'default'
                                                                            : 'ghost',
                                                                    className: `btn-start w-[95%] h-[50px] pl-[10px] rounded-r-[25px] rounded-l-none`,
                                                                })}>
                                                                {item.current ||
                                                                item.children?.find(
                                                                    (childItem: any) => childItem.current,
                                                                ) ? (
                                                                    <item.icon
                                                                        className='h-[20px] mr-2 shrink-0 text-gray-700'
                                                                        aria-hidden='true'
                                                                    />
                                                                ) : (
                                                                    <item.icon
                                                                        className='h-[20px] mr-2 shrink-0 text-green-300'
                                                                        aria-hidden='true'
                                                                    />
                                                                )}

                                                                {item.name}
                                                            </Link>
                                                            {item.children &&
                                                                item.children.some(
                                                                    (childItem: any) => childItem.hide === false,
                                                                ) && (
                                                                    <Disclosure.Button className='absolute top-1/2 right-4 -translate-y-2/4	h-full flex justify-items-center items-center'>
                                                                        <ChevronDownIcon
                                                                            className='ml-2 h-5 w-5 text-gray-400'
                                                                            aria-hidden='true'
                                                                        />
                                                                    </Disclosure.Button>
                                                                )}
                                                        </div>
                                                        {item.children && (
                                                            <Disclosure.Panel className={'bg-gray-100'}>
                                                                <ul>
                                                                    {item.children.map(
                                                                        (childItem: any, y: number) =>
                                                                            !childItem?.hide && (
                                                                                <li key={y}>
                                                                                    <Link
                                                                                        href={childItem.href}
                                                                                        className={buttonVariants({
                                                                                            variant: childItem.current
                                                                                                ? 'default'
                                                                                                : 'ghost',
                                                                                            className: `btn-start w-full h-[50px] pl-[10px]`,
                                                                                        })}>
                                                                                        {childItem.name}
                                                                                    </Link>
                                                                                </li>
                                                                            ),
                                                                    )}
                                                                </ul>
                                                            </Disclosure.Panel>
                                                        )}
                                                    </Disclosure>
                                                </li>
                                            ),
                                    )}
                                </ul>
                            </li>
                            <li>
                                <div className='text-xs font-semibold leading-6 text-gray-400'></div>
                                <ul></ul>
                            </li>
                            {/* {UseHasRoleOrPermissions({ permissions: ['admin', 'all'] }) && ( */}
                            <Button
                                className={
                                    'h-[50px] text-left mt-auto justify-start text-sm font-normal bg-gray-600 w-[95%] rounded-none rounded-tr-[25px] hover:text-gray-600'
                                }
                                asChild
                                // variant={!route().current('admin.settings.*') ? 'ghost' : ('' as unknown as null)}>
                            >
                                <Link
                                    href={route('logout')}
                                    method='post'
                                    className='text-white text-opacity-50 hover:text-white hover:text-opacity-100'>
                                    <LogOut className='h-[18px] mr-2 w-6 shrink-0 w-[18px]' aria-hidden='true' /> Log
                                    out
                                </Link>
                            </Button>
                            {/* )} */}
                        </ul>
                    </nav>
                </div>
            </div>

            <div className='lg:pl-72'>
                <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4  bg-background px-4 sm:gap-x-6 sm:px-6 lg:px-8'>
                    <button
                        type='button'
                        className='-m-2.5 p-2.5 text-gray-700 lg:hidden'
                        onClick={() => setSidebarOpen(true)}>
                        <span className='sr-only'>Open sidebar</span>
                        <Bars3Icon className='h-6 w-6' aria-hidden='true' />
                    </button>

                    {/* Separator */}
                    <div className='h-6 w-px bg-gray-900/10 lg:hidden' aria-hidden='true' />

                    <div className='flex h-16 shrink-0 items-center lg:hidden'>
                        <ApplicationLogo className='w-auto h-10 bg-gray-500 py-1 px-2 rounded-md' />
                    </div>

                    <div className='flex flex-1 lg:gap-x-4 self-stretch lg:gap-x-6'>
                        {onSearch && (
                            <div className='flex flex-1 justify-end lg:justify-start'>
                                <button
                                    className='flex items-center lg:hidden'
                                    onClick={() => setMobileSearchOpen(!mobileSearchOpen)}>
                                    {!mobileSearchOpen && <MagnifyingGlassIcon className='h-6' />}
                                    {mobileSearchOpen && <XMarkIcon className='h-6' />}
                                </button>
                                <div
                                    className={`absolute top-full left-0 -mt-1.5 lg:mt-0 w-full bg-background border-b lg:border-b-0 px-4 sm:px-6 lg:px-0 lg:relative lg:top-auto lg:left-auto lg:flex flex-1 transition transform ${!mobileSearchOpen && 'opacity-0 scale-95'} lg:opacity-100 lg:scale-100`}>
                                    <form
                                        className='w-full h-10 lg:h-auto pb-2 lg:pt-2'
                                        action='#'
                                        method='GET'
                                        onSubmit={e => e.preventDefault()}>
                                        <label htmlFor='search-field' className='sr-only'>
                                            Search
                                        </label>
                                        <MagnifyingGlassIcon
                                            className='pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 hidden lg:block'
                                            aria-hidden='true'
                                        />
                                        <input
                                            id='search-field'
                                            className='block h-full w-full rounded-md border-0 py-0 lg:pl-8 bg-background pr-0 text-gray-500 placeholder:text-gray-400 font-semibold focus:ring-0 sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                                            placeholder='Search...'
                                            type='search'
                                            onChange={({ target: { value } }) => onSearch(value)}
                                            value={search as any}
                                            name='search'
                                        />
                                    </form>
                                </div>
                            </div>
                        )}
                        <div className='flex items-center gap-x-4 lg:gap-x-6 ml-auto'>
                            <button type='button' className='hidden p-2.5 text-gray-400 hover:text-gray-500'>
                                <span className='sr-only'>View notifications</span>
                            </button>

                            {/* Separator */}
                            <div className='hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10' aria-hidden='true' />

                            {/* Profile dropdown */}
                            <Menu as='div' className='relative'>
                                <Menu.Button className='-me-1.5 lg:-m-1.5 flex items-center p-1.5'>
                                    <span className='sr-only'>Open user menu</span>
                                    <span className='flex items-center'>
                                        <span
                                            className='ml-4 text-sm font-semibold leading-6 text-gray-900'
                                            aria-hidden='true'>
                                            {user.name}
                                        </span>
                                        <ChevronDownIcon className='ml-2 h-5 w-5 text-gray-500' aria-hidden='true' />
                                    </span>
                                </Menu.Button>
                                <Transition
                                    as={Fragment}
                                    enter='transition ease-out duration-100'
                                    enterFrom='transform opacity-0 scale-95'
                                    enterTo='transform opacity-100 scale-100'
                                    leave='transition ease-in duration-75'
                                    leaveFrom='transform opacity-100 scale-100'
                                    leaveTo='transform opacity-0 scale-95'>
                                    <Menu.Items className='absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
                                        {userNavigation.map(item => (
                                            <Menu.Item key={item.name}>
                                                {({ active }) => (
                                                    <Link
                                                        href={item.href}
                                                        method={item.method}
                                                        className={classNames(
                                                            active ? 'bg-gray-50' : '',
                                                            'block px-3 py-1 text-sm leading-6 text-gray-900',
                                                        )}>
                                                        {item.name}
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                </div>
                <main className='py-10'>
                    <div className='px-4 sm:px-6 lg:px-8'>
                        <div className='sm:flex-auto'>
                            {title && <h1 className='text-2xl font-semibold leading-6 text-gray-600'>{title}</h1>}
                            {description && <p className='mt-2 text-sm text-gray-500'>{description}</p>}
                        </div>

                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
