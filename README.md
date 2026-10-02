# About the project

A management web application for handling companies, projects, users and questionnaires in one place. It has two separate areas: an **admin area**, where administrators manage users, companies, projects, categories, links, documents and questionnaires (questions, options, answers and exports), and a **user area**, where regular users access their documents, upload files, follow their activity and fill in the questionnaires assigned to them.

It is useful for collecting structured information from users or clients (through configurable questionnaires), sharing documents securely with the right people, and giving administrators a single dashboard to monitor and export the collected data.

### How it was built

- **Backend:** Laravel 12 (PHP 8.2+), with role-based access control (spatie/laravel-permission), file uploads (spatie/laravel-medialibrary), filtering (spatie/laravel-query-builder) and Excel exports (maatwebsite/excel).
- **Frontend:** React 18 + TypeScript served through Inertia.js v2, bundled with Vite and styled with Tailwind CSS and Radix UI / shadcn-style components. Drag and drop reordering of questions uses dnd-kit.
- **Environment:** local development with Docker via Laravel Sail (MySQL, Mailpit, phpMyAdmin).

## Required secrets

RECAPTCHA_SITEKEY
RECAPTCHA_SECRETKEY
PASSWORD_RECOVERY_KEY

## User documentation

User documentation is in the `_docs/user` folder.

### Generate screenshots

1. Add login credential for two users (one with role 'user' and one 'admin') in the `.env` file:

```
SCREENSHOT_ADMIN_EMAIL
SCREENSHOT_ADMIN_PASSWORD
SCREENSHOT_USER_EMAIL
SCREENSHOT_USER_PASSWORD
```

2. Run the project locally

3. Install node dependencies `sail npm i`

4. Run `sail npm run screenshots`

### Convert to PDF

1. Install the extension `yzane.markdown-pdf`

2. Open the file `_docs/user/USER_MANUAL.md`

3. In the VS Code bar type `> Markdown PDF: Export (pdf)`
