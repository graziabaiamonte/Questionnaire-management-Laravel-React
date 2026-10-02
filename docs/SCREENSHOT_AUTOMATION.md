# Automazione Screenshot - Guida Rapida

Questo script automatizza la cattura degli screenshot necessari per il manuale utente usando Playwright.

## Installazione

1. Installa le dipendenze:

```bash
npm install --save-dev playwright dotenv
npx playwright install chromium
```

2. Configura le credenziali:
    - Copia `.env.screenshot` in `.env` o crea un file `.env.local`
    - Aggiorna le credenziali con quelle reali del tuo ambiente

```bash
cp .env.screenshot .env.local
# Poi modifica .env.local con le credenziali corrette
```

## Configurazione

Modifica il file `.env` con le credenziali per gli screenshot:

```bash
SCREENSHOT_ADMIN_EMAIL=admin@test.com # Email admin
SCREENSHOT_ADMIN_PASSWORD=password123 # Password admin
SCREENSHOT_USER_EMAIL=user@test.com   # Email utente
SCREENSHOT_USER_PASSWORD=password123  # Password utente
```

**Nota**: Lo script usa automaticamente `APP_URL` dal file `.env` principale.

## Preparazione Database

Prima di eseguire lo script, assicurati che il database contenga:

- ✅ Almeno un utente admin con le credenziali configurate
- ✅ Almeno un utente standard con le credenziali configurate
- ✅ Almeno un'azienda
- ✅ Almeno un progetto
- ✅ Almeno un questionario con domande
- ✅ Alcune risposte al questionario (opzionale)

**Suggerimento**: Usa i seeder di Laravel per popolare il database con dati di test:

```bash
php artisan db:seed
```

## Esecuzione

### Avvia l'applicazione

Assicurati che l'applicazione sia in esecuzione:

```bash
# In un terminale
php artisan serve

# In un altro terminale
npm run dev
```

### Cattura gli screenshot

```bash
node scripts/capture-screenshots.js
```

Lo script:

1. ✅ Fa login come admin e utente
2. ✅ Naviga automaticamente a tutte le pagine chiave
3. ✅ Cattura gli screenshot nei punti giusti
4. ✅ Salva tutto in `docs/images/`

## Screenshot Catturati

Lo script genera automaticamente:

- `login.png` - Pagina di login
- `user-welcome.png` - Benvenuto utente
- `user-questionnaires-list.png` - Lista questionari utente
- `questionnaire-fill.png` - Compilazione questionario
- `admin-dashboard.png` - Dashboard amministratore
- `admin-project-create.png` - Form creazione progetto
- `admin-questionnaire-create.png` - Form creazione questionario
- `admin-question-add.png` - Form aggiunta domanda
- `admin-answers-view.png` - Visualizzazione risposte

## Opzioni Avanzate

### Modalità visibile (debug)

Per vedere il browser durante la cattura, modifica `scripts/capture-screenshots.js`:

```javascript
const browser = await chromium.launch({
    headless: false, // Cambia da true a false
});
```

### Personalizzare viewport

Modifica le dimensioni della finestra:

```javascript
const VIEWPORT = { width: 1920, height: 1080 };
```

### Screenshot di pagine specifiche

Puoi commentare le funzioni che non ti servono in `main()`:

```javascript
async function main() {
    // await captureLoginPage(page);       // Disabilita questo
    await captureUserScreenshots(page); // Mantieni solo questo
    // await captureAdminScreenshots(page); // Disabilita questo
}
```

## Troubleshooting

### Errore: "Cannot find module 'playwright'"

```bash
npm install --save-dev playwright
npx playwright install chromium
```

### Errore: "Login failed"

- Verifica che le credenziali in `.env.local` siano corrette
- Verifica che l'applicazione sia in esecuzione
- Controlla l'URL in `SCREENSHOT_BASE_URL`

### Screenshot vuoti o parziali

- Aumenta il timeout: `await page.waitForTimeout(2000);`
- Abilita `fullPage: true` per screenshot completi

### Errore: "Page not found"

- Verifica che i percorsi delle route corrispondano al tuo routing
- Controlla che i dati necessari esistano nel database

## Aggiornare gli screenshot

Per aggiornare gli screenshot:

1. Modifica il database con nuovi dati se necessario
2. Riesegui lo script:

```bash
node scripts/capture-screenshots.js
```

Gli screenshot esistenti verranno sovrascritti automaticamente.

## Script NPM

Puoi aggiungere uno script shortcut in `package.json`:

```json
{
    "scripts": {
        "screenshots": "node scripts/capture-screenshots.js"
    }
}
```

Poi esegui semplicemente:

```bash
npm run screenshots
```
