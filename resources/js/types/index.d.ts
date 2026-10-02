export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        roles: Array<any>;
        permissions: Array<any>;
    };
    flash: {
        success: string;
    };
    activeStates: Array<EnumShape>;
};

export type RequestParams = {
    page?: number | string;
    per_page: string;
    sort: string;
};

export type RouteParams = {
    page?: number;
    per_page?: number;
    sort?: string;
    filter: Filters;
    dates: Array<any> | null;
    [key: string]: any;
};

export type FileMedia = {
    id: string;
    uuid: string;
    name: string;
    file_name: string;
    mime_type: string;
    order_column: number;
    original_url: string;
};

export type User = {
    id: number;
    name: string;
    last_name: string;
    email: string;
    email_verified_at: string;
    status: number;
};

export type UserType = {
    id: string;
    name: string;
    last_name?: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    role: any;
    status: number;
    projects: Array<{
        value: string;
        name: string;
    }>;
    company_id: number;
    primary_project_id: number;
    media: Array<FileMedia>;
    media_upload: Array<File>;
};

export type Company = {
    id: string;
    name: string;
};

export type Project = {
    id: string;
    name: string;
    description: string;
    /*links: Array<{
        value: string;
        name: string;
    }>;
    users: Array<{
        value: string;
        name: string;
    }>;*/
    company_id: number;
    questionnaire_close_trigger: string;
    users: Array<any>;
    media: Array<FileMedia>;
    media_upload: Array<File>;
    //media_upload: File | null;
};

export type Category = {
    id: string;
    name: string;
};

export type Link = {
    id: string;
    name: string;
    credentials: string;
    link: string;
    order_column: number;
    categories: Array<{
        value: string;
        name: string;
    }>;
    users: Array<{
        value: string;
        name: string;
    }>;
    projects: Array<{
        value: string;
        name: string;
    }>;
};

export type Document = {
    id: string;
    name: string;
    order_column: number;
    categories: Array<{
        value: string;
        name: string;
    }>;
    users: Array<{
        value: string;
        name: string;
    }>;
    projects: Array<{
        value: string;
        name: string;
    }>;
    media: Array<FileMedia>;
    media_upload: Array<File>;
};

export type Questionnaire = {
    id: string;
    name: string;
    description: string;
    questionnaire_close_trigger: string;
    closed: boolean;
    order_column: number;
    categories: Array<{
        value: string;
        name: string;
    }>;
    users: Array<{
        value: string;
        name: string;
    }>;
    projects: Array<{
        value: string;
        name: string;
    }>;
    questions?: Array<any>;
};

export type QuestionnaireUserState = {
    id: string;
    questionnaire_id: string;
    user_id: string;
    state: string;
};

export type QuestionItem = {
    id?: number | string;
    questionnaire_id?: string;
    type: string;
    label: string;
    description: string;
    required: boolean;
    options?: Array<any>;
    //questions?: Array<any>;
    // answers?: Array<any>;
    answer: any;
    answer_notes?: string;
    order_column?: number;
};

export type QuestionOption = {
    id?: string;
    content?: string;
    questionnaire_question_id?: string;
    order_column?: number;
};

// export type Client = {
//     id: string;
//     name: string;
//     last_name?: string;
//     company_name?: string;
//     email?: string;
//     is_juridical_person: boolean;
//     sex: string | Record<string, string>;
//     birth_date: string | number | Date;
//     birth_place: string;
//     cf: string;
//     tax_id?: string;
//     notes: string;
//     address_residence: string;
//     address_domicile: string;
//     address_registered_office: string;
//     client_category: ClientCategory;
//     client_category_id: string;
//     user: UserType;
//     user_id: string;
//     client_tags: Array<ClientTag>;
//     documents: Array<FileDocument>;
//     documents_upload: Array<File>;
// };

export type EnumShape = {
    label: string;
    value: string;
    description: string;
};

type MapByMonth = {
    [key: number]: Array<number>;
};

type MapByYear = {
    [key: number]: MapByMonth;
};
