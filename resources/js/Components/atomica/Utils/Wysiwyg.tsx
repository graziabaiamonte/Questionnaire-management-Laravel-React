import 'tinymce/tinymce';
import 'tinymce/plugins/link';
import 'tinymce/plugins/table';
import 'tinymce/plugins/lists';
import 'tinymce/skins/ui/oxide/skin.min.css';
import contentUiCss from 'tinymce/skins/content/default/content.min.css?inline';
import 'tinymce/icons/default/icons';
import 'tinymce/themes/silver/theme';
import 'tinymce/models/dom/model';
import { Editor } from '@tinymce/tinymce-react';
import { Label } from '@/Components/ui/label';
import InputError from '@/Components/InputError';
import { useEffect } from 'react';

export default function Wysiwyg({
    init,
    change,
    value,
    initialValue,
    label,
    required,
    error,
}: {
    init?: any;
    change?: any;
    value?: any;
    initialValue?: string;
    label?: string;
    required?: boolean;
    error?: string;
}) {
    // useEffect(() => {
    //     change(initialValue ?? value ?? '');
    //     console.log('change');
    // }, [change, initialValue, value]);
    return (
        <div className=''>
            {label && (
                <Label className='block text-sm font-medium leading-6 text-gray-900'>
                    {label} {required && '*'}
                </Label>
            )}
            <Editor
                onInit={init}
                onEditorChange={change}
                initialValue={initialValue || ''}
                //value={value || ''}
                // apiKey='3yptn7nzka8zzwi48tm662n1ss30l69jphv9u2tb913y46sp'
                tinymceScriptSrc=''
                licenseKey='gpl'
                init={{
                    height: 500,
                    menubar: false,
                    plugins: ['link', 'lists'],
                    // plugins: [
                    //     'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                    //     'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    //     'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    // ],
                    // toolbar: 'undo redo | blocks | ' +
                    //     'bold italic underline | alignleft aligncenter ' +
                    //     'alignright alignjustify | bullist numlist | table | ' +
                    //     'removeformat | help',
                    toolbar:
                        'undo redo | ' +
                        'bold italic underline | table | ' +
                        'removeformat | help' +
                        '| h1 h2 h3 h4 h5 h6' +
                        '| bullist numlist' +
                        '| link',
                    table_toolbar:
                        'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow tablerowheader | tableinsertcolbefore tableinsertcolafter tabledeletecol',
                    // https://stackoverflow.com/questions/73699951/vite-inline-not-working-as-expected-when-loading-css-for-tinymce
                    skin: false, // prevent tinymce script from looking for the skin css files since they're manually imported above
                    content_css: false, // prevent tinymce script from looking for the content css files, use the imported styles below
                    content_style: contentUiCss,
                    relative_urls: false,
                }}
            />
            <div className='h-[20px]'>
                <InputError message={error} />
            </div>
        </div>
    );
}
