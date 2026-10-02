/*
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import React, { useState } from 'react';
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Combobox } from '@headlessui/react';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Trash } from 'lucide-react';

function classNames(...classes: Array<string>) {
    return classes.filter(Boolean).join(' ');
}

export default function Combo({
    items,
    label,
    selected,
    onChange,
    displayValue,
    error = '',
    onInputChange,
    multiple = false,
    async = false,
    onChipsDelete,
    by = null,
    onClear,
}: {
    items: Array<any>;
    label?: string;
    selected?: any;
    onChange: (item: any) => any;
    displayValue?: string;
    error?: string;
    onInputChange?: (e: any) => void;
    multiple?: boolean;
    async?: boolean;
    onChipsDelete?: (item: any) => void;
    by?: string | null;
    onClear?: () => void;
}) {
    const [query, setQuery] = useState('');

    const filteredItems =
        query === ''
            ? items
            : !async
              ? items.filter(item => {
                    return displayValue
                        ? item[displayValue].toLowerCase().includes(query.toLowerCase())
                        : String(item).includes(query.toLowerCase());
                })
              : items;

    function compareToSelection(selected: any, selectItem: any) {
        if (by) {
            return selected == selectItem[by];
        }
        return selected == selectItem;
    }

    return (
        // @ts-expect-error - know issue of the headlessui Combobox component (https://github.com/tailwindlabs/headlessui/issues/2669 and https://github.com/tailwindlabs/headlessui/issues/2438)
        <Combobox by={compareToSelection} as='div' value={selected} {...(multiple as object)} onChange={onChange}>
            <Combobox.Label className='block text-sm font-normal leading-6 text-gray-500 cursor-pointer'>
                {label && label}
            </Combobox.Label>
            <div className='relative mt-2'>
                {Boolean(selected) && onClear && (
                    <div
                        onClick={onClear}
                        className='h-full absolute right-0 grid place-items-center cursor-pointer right-[40px]'>
                        <XMarkIcon className={'h-7 w-7 text-gray-400 '}></XMarkIcon>
                    </div>
                )}
                <Combobox.Input
                    className='rounded-md flex h-10 w-full border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    onChange={event => {
                        if (!onInputChange) {
                            setQuery(event.target.value);
                            return;
                        }
                        const search = event.target.value;
                        const isEmpty = /^\s*$/.test(search);
                        if (isEmpty) {
                            return;
                        }
                        if (multiple) {
                            if (selected?.length) {
                                const selectedString = selected?.map((item: any) => item.name).join(',');
                                const cleanedSearch = search.replace(selectedString, '');
                                if (!cleanedSearch || /^\s*$/.test(cleanedSearch)) {
                                    return;
                                }
                                onInputChange(cleanedSearch);
                                return;
                            }
                        }
                        onInputChange(search);
                    }}
                    displayValue={(item: any) => {
                        if (!displayValue) return null;
                        if (multiple) {
                            return null;
                        }
                        if (by) {
                            const selected = items.find(listItem => listItem[by] === item);
                            return selected ? selected[displayValue] : null;
                        }
                        return item && displayValue ? item[displayValue] : item;
                    }}
                />
                <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                    <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </Combobox.Button>

                {Boolean(filteredItems.length > 0) && (
                    <Combobox.Options className='absolute z-10 mt-3 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg border bg-card ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                        {filteredItems.map((item, key) => (
                            <Combobox.Option
                                key={item?.id || key}
                                value={item}
                                className={({ active }) =>
                                    classNames(
                                        'relative cursor-default select-none py-4 pl-8 pr-4',
                                        active ? 'bg-secondary' : 'text-gray-900',
                                    )
                                }>
                                {({ active, selected }) => (
                                    <>
                                        <span className={classNames('block truncate', selected ? 'font-semibold' : '')}>
                                            {displayValue ? item[displayValue] : item}
                                        </span>

                                        {selected && (
                                            <span
                                                className={
                                                    'absolute inset-y-0 left-0 flex items-center pl-1.5 text-primary'
                                                }>
                                                <CheckIcon className='h-5 w-5' aria-hidden='true' />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}
            </div>
            {multiple && Boolean(selected.length) && (
                <div className='flex flex-wrap mt-1'>
                    {selected.map((item: any, key: number) => (
                        <div
                            key={item?.id || key}
                            className='mr-1 mt-3 items-center border border-white border-2 center flex relative inline-block select-none whitespace-nowrap rounded-md   align-baseline font-sans text-sm capitalize leading-none bg-green-300'>
                            <p className='flex-1 px-2 h-full flex justify-center items-center py-0 g text-white text-xs'>
                                {displayValue && item[displayValue]}
                            </p>

                            <Button
                                type={'button'}
                                variant={'ghost'}
                                size={'icon'}
                                className={'h-[30px] text-white hover:text-red-500 hover:bg-green-300'}
                                onClick={() => onChipsDelete && onChipsDelete(item)}>
                                <Trash className='w-4 h-4' />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
            <div className='h-[20px]'>
                <InputError message={error}></InputError>
            </div>
        </Combobox>
    );
}
