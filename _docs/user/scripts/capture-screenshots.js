import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const BASE_URL = process.env.APP_URL || 'http://localhost';
const ADMIN_EMAIL = process.env.SCREENSHOT_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.SCREENSHOT_ADMIN_PASSWORD || 'password';
const USER_EMAIL = process.env.SCREENSHOT_USER_EMAIL || 'user@example.com';
const USER_PASSWORD = process.env.SCREENSHOT_USER_PASSWORD || 'password';
const OUTPUT_DIR = join(__dirname, '../images');

// Screenshot configuration
const VIEWPORT = { width: 1920, height: 1080 };
const SCREENSHOT_OPTIONS = {
  fullPage: false,
  animations: 'disabled',
};

async function takeScreenshot(page, filename, options = {}) {
  const filepath = join(OUTPUT_DIR, filename);
  
  // Wait for page to be fully loaded (skip for modals)
  if (!options.skipLoadWait) {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Extra wait for animations
  }
  
  const screenshotOptions = { ...SCREENSHOT_OPTIONS, ...options };
  delete screenshotOptions.skipLoadWait; // Remove custom option before passing to screenshot
  
  await page.screenshot({
    path: filepath,
    ...screenshotOptions,
  });
  
  console.log(`✓ Screenshot saved: ${filename}`);
}

async function login(page, email, password) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForSelector('input[type="email"]');
  
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  
  // Find the login button - try multiple selectors
  const loginButton = await page.locator('button:has-text("Accedi"), button:has-text("Login"), button[type="submit"], button').first();
  await loginButton.click();
  
  // Wait for navigation after login
  await page.waitForLoadState('networkidle');
}

async function captureLoginPage(page) {
  console.log('\n📸 Capturing login page...');
  try {
    await page.goto(`${BASE_URL}/login`);
    await takeScreenshot(page, 'login.png');
  } catch (error) {
    console.log('⚠ Failed to capture login page:', error.message);
  }
}

async function captureUserScreenshots(page) {
  console.log('\n📸 Capturing user screenshots...');
  
  try {
    // Login as user
    await login(page, USER_EMAIL, USER_PASSWORD);
    console.log('✓ Logged in as user');
  } catch (error) {
    console.log('⚠ Failed to login as user:', error.message);
    return;
  }
  
  // 1. Welcome page
  try {
    await page.goto(`${BASE_URL}/user-area/welcome`);
    await takeScreenshot(page, 'user-welcome.png');
  } catch (error) {
    console.log('⚠ Failed to capture welcome page:', error.message);
  }
  
  // 2. Questionnaires list
  try {
    await page.goto(`${BASE_URL}/user-area/questionnaire`);
    await takeScreenshot(page, 'user-questionnaires-list.png');
  } catch (error) {
    console.log('⚠ Failed to capture questionnaires list:', error.message);
  }
  
  // 3. Questionnaire fill (try to open first available questionnaire)
  try {
    await page.goto(`${BASE_URL}/user-area/questionnaire`);
    // Find the first "View" button in the table (ExternalLink icon button)
    const firstQuestionnaireButton = await page.locator('table tbody tr button[aria-label="View"], table tbody tr button:has(svg)').first();
    if (await firstQuestionnaireButton.isVisible()) {
      await firstQuestionnaireButton.click();
      await page.waitForLoadState('networkidle');
      await takeScreenshot(page, 'questionnaire-fill.png', { fullPage: true });
    } else {
      console.log('⚠ No questionnaire available for user');
    }
  } catch (error) {
    console.log('⚠ Could not capture questionnaire fill page:', error.message);
  }
  
  // Logout
  try {
    // Open the user menu dropdown by finding button with sr-only "Open user menu"
    const menuButton = await page.locator('button:has(span.sr-only:text-is("Open user menu"))').first();
    await menuButton.click();
    await page.waitForTimeout(500); // Wait for dropdown animation
    
    // Click on the "Log out" button in the dropdown menu (Headless UI Menu.Item renders as button)
    const logoutButton = await page.locator('button[role="menuitem"]:has-text("Log out")').first();
    await logoutButton.click();
    await page.waitForLoadState('networkidle');
    console.log('✓ Logged out successfully');
  } catch (error) {
    console.log('⚠ Could not logout:', error.message);
  }
}

async function captureAdminScreenshots(page) {
  console.log('\n📸 Capturing admin screenshots...');
  
  // Login as admin
  try {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✓ Logged in as admin');
  } catch (error) {
    console.log('⚠ Failed to login as admin:', error.message);
    return;
  }
  
  // 1. Dashboard
  try {
    await page.goto(`${BASE_URL}/dashboard`);
    await takeScreenshot(page, 'admin-dashboard.png');
  } catch (error) {
    console.log('⚠ Failed to capture dashboard:', error.message);
  }
  
  // 2. Project create form
  try {
    await page.goto(`${BASE_URL}/project/create`);
    await page.waitForSelector('form');
    await takeScreenshot(page, 'admin-project-create.png', { fullPage: true });
  } catch (error) {
    console.log('⚠ Failed to capture project create form:', error.message);
  }
  
  // 3. Questionnaire create form
  try {
    await page.goto(`${BASE_URL}/questionnaire/create`);
    await page.waitForSelector('form');
    await takeScreenshot(page, 'admin-questionnaire-create.png', { fullPage: true });
  } catch (error) {
    console.log('⚠ Failed to capture questionnaire create form:', error.message);
  }
  
  // 4. Add question modal - Navigate to edit questionnaire page
  try {
    await page.goto(`${BASE_URL}/questionnaire`);
    await page.waitForTimeout(1000);
    
    // Find and click the edit button (pencil icon) in the first row
    const firstRow = await page.locator('table tbody tr').first();
    const editButton = await firstRow.locator('button').nth(1);
    
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      console.log('✓ Opened questionnaire edit page');
      
      // Find the "Add question" button in TitlePage (it's a PrimaryButton with the action text)
      const addQuestionButton = await page.locator('button:has-text("Add question")').first();
      await addQuestionButton.waitFor({ state: 'visible', timeout: 5000 });
      await addQuestionButton.click();
      console.log('✓ Clicked Add question button');
      
      // Wait for SimpleModal to open - it uses Headless UI Dialog
      await page.waitForSelector('[id="modal"]', { state: 'visible', timeout: 5000 });
      await page.waitForTimeout(1000); // Wait for modal animation
      console.log('✓ Modal opened');
      
      // Take screenshot of empty modal
      await takeScreenshot(page, 'admin-question-add.png', { fullPage: true, skipLoadWait: true });
      console.log('✓ Captured base question modal');
      
      // Now capture screenshots for each question type
      
      // 4a. TEXT type screenshot
      try {
        console.log('📸 Setting up TEXT question type...');
        
        // Find the Type Combobox button - be more specific
        const typeComboButton = await page.locator('label:has-text("Type") ~ div button').first();
        await typeComboButton.waitFor({ state: 'visible', timeout: 5000 });
        await typeComboButton.click({ force: true });
        await page.waitForTimeout(800);
        
        // Wait for options to be visible and find "Testuale" or "Text" option
        await page.waitForSelector('[role="option"]', { state: 'visible', timeout: 5000 });
        const textOption = await page.locator('[role="option"]:has-text("Testuale"), [role="option"]:has-text("Text")').first();
        await textOption.click();
        await page.waitForTimeout(500);
        
        await takeScreenshot(page, 'admin-question-text-add.png', { fullPage: true, skipLoadWait: true });
        console.log('✓ Captured TEXT question type');
      } catch (error) {
        console.log('⚠ Could not capture TEXT question type:', error.message);
      }
      
      // 4b. OPTIONS type screenshot
      try {
        console.log('📸 Setting up OPTIONS question type...');
        
        // Click combobox button again to open dropdown
        const typeComboButton = await page.locator('label:has-text("Type") ~ div button').first();
        await typeComboButton.click({ force: true });
        await page.waitForTimeout(800);
        
        // Wait for options and find "Opzioni" or "Options" option
        await page.waitForSelector('[role="option"]', { state: 'visible', timeout: 5000 });
        const optionsOption = await page.locator('[role="option"]:has-text("Opzioni"), [role="option"]:has-text("Options")').first();
        await optionsOption.click();
        await page.waitForTimeout(500);
        
        // Fill label to show more complete form (find the first input that's not the combobox)
        const labelInput = await page.locator('label:has-text("Label") ~ div input').first();
        await labelInput.fill('Seleziona una opzione');
        await page.waitForTimeout(300);
        
        await takeScreenshot(page, 'admin-question-options-add.png', { fullPage: true, skipLoadWait: true });
        console.log('✓ Captured OPTIONS question type');
        
        // Now save the question and reopen to capture step 2
        const createButton = await page.locator('button:has-text("Create")').first();
        await createButton.click();
        console.log('✓ Clicked Create button');
        
        // Wait for modal to close and page to update
        await page.waitForSelector('[id="modal"]', { state: 'hidden', timeout: 10000 });
        await page.waitForTimeout(1500);
        console.log('✓ Modal closed after save');
        
        // Wait for the questions list to be stable
        await page.waitForSelector('div.flex.items-start.gap-4', { state: 'visible', timeout: 5000 });
        await page.waitForTimeout(500);
        
        // Find all edit buttons (pencil icons) in the questions list
        const editButtons = await page.locator('button svg').all();
        console.log(`Found ${editButtons.length} buttons with svg icons`);
        
        // Click on the last pencil edit button (the newly created question should be last)
        if (editButtons.length > 0) {
          // Look for buttons in question cards and get the last one
          const questionCards = await page.locator('div.flex.items-start.gap-4').all();
          const lastCard = questionCards[questionCards.length - 1];
          const editButton = await lastCard.locator('button').first();
          
          await editButton.click();
          await page.waitForTimeout(1000);
          console.log('✓ Reopened question for editing');
          
          // Wait for modal to open again
          await page.waitForSelector('[id="modal"]', { state: 'visible', timeout: 5000 });
          await page.waitForTimeout(500);
          
          // Fill in the option input field
          const optionInput = await page.locator('input[placeholder="New option"]').first();
          await optionInput.fill('Opzione 1');
          await page.waitForTimeout(300);
          
          await takeScreenshot(page, 'admin-question-options-add2.png', { fullPage: true, skipLoadWait: true });
          console.log('✓ Captured OPTIONS question step 2');
          
          // Close modal
          await page.keyboard.press('Escape');
          await page.waitForTimeout(1000);
        } else {
          console.log('⚠ No edit buttons found');
        }
      } catch (error) {
        console.log('⚠ Could not capture OPTIONS question type:', error.message);
      }
      
      // 4c. MULTIPLE type screenshot
      try {
        console.log('📸 Setting up MULTIPLE question type...');
        
        // Open add question modal again
        const addQuestionButton = await page.locator('button:has-text("Add question")').first();
        await addQuestionButton.click();
        await page.waitForTimeout(1000);
        
        // Wait for modal
        await page.waitForSelector('[id="modal"]', { state: 'visible', timeout: 5000 });
        await page.waitForTimeout(500);
        
        // Fill label
        const labelInput = await page.locator('label:has-text("Label") ~ div input').first();
        await labelInput.fill('Seleziona una o più opzioni');
        
        // Click combobox button to change type
        const typeComboButton = await page.locator('label:has-text("Type") ~ div button').first();
        await typeComboButton.click({ force: true });
        await page.waitForTimeout(800);
        
        // Wait for options and find "Multipla" or "Multiple" option
        await page.waitForSelector('[role="option"]', { state: 'visible', timeout: 5000 });
        const multipleOption = await page.locator('[role="option"]:has-text("Multipla"), [role="option"]:has-text("Multiple")').first();
        await multipleOption.click();
        await page.waitForTimeout(500);
        
        await takeScreenshot(page, 'admin-question-multiple-add.png', { fullPage: true, skipLoadWait: true });
        console.log('✓ Captured MULTIPLE question type');
        
        // Save and reopen for step 2
        const createButton = await page.locator('button:has-text("Create")').first();
        await createButton.click();
        console.log('✓ Clicked Create button');
        
        // Wait for modal to close
        await page.waitForSelector('[id="modal"]', { state: 'hidden', timeout: 10000 });
        await page.waitForTimeout(1500);
        console.log('✓ Modal closed after save');
        
        // Wait for questions list to be stable
        await page.waitForSelector('div.flex.items-start.gap-4', { state: 'visible', timeout: 5000 });
        await page.waitForTimeout(500);
        
        // Find the last question card and click edit button
        const questionCards = await page.locator('div.flex.items-start.gap-4').all();
        const lastCard = questionCards[questionCards.length - 1];
        const editButton = await lastCard.locator('button').first();
        
        await editButton.click();
        await page.waitForTimeout(1000);
        console.log('✓ Reopened question for editing');
        
        // Wait for modal
        await page.waitForSelector('[id="modal"]', { state: 'visible', timeout: 5000 });
        await page.waitForTimeout(500);
        
        // Fill in the option input field
        const optionInput = await page.locator('input[placeholder="New option"]').first();
        await optionInput.fill('Opzione A');
        await page.waitForTimeout(300);
        
        await takeScreenshot(page, 'admin-question-multiple-add2.png', { fullPage: true, skipLoadWait: true });
        console.log('✓ Captured MULTIPLE question step 2');
        
        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
      } catch (error) {
        console.log('⚠ Could not capture MULTIPLE question type:', error.message);
      }
      
      // 4d. VOTE type screenshot
      try {
        console.log('📸 Setting up VOTE question type...');
        
        // Open add question modal again
        const addQuestionButton = await page.locator('button:has-text("Add question")').first();
        await addQuestionButton.click();
        await page.waitForTimeout(1000);
        
        // Wait for modal
        await page.waitForSelector('[id="modal"]', { state: 'visible', timeout: 5000 });
        await page.waitForTimeout(500);
        
        // Fill label
        const labelInput = await page.locator('label:has-text("Label") ~ div input').first();
        await labelInput.fill('Dai un voto da 1 a 5');
        
        // Click combobox button to change type
        const typeComboButton = await page.locator('label:has-text("Type") ~ div button').first();
        await typeComboButton.click({ force: true });
        await page.waitForTimeout(800);
        
        // Wait for options and find "Voto" or "Vote" option
        await page.waitForSelector('[role="option"]', { state: 'visible', timeout: 5000 });
        const voteOption = await page.locator('[role="option"]:has-text("Voto"), [role="option"]:has-text("Vote")').first();
        await voteOption.click();
        await page.waitForTimeout(500);
        
        await takeScreenshot(page, 'admin-question-vote-add.png', { fullPage: true, skipLoadWait: true });
        console.log('✓ Captured VOTE question type');
        
        // Save and reopen for step 2
        const createButton = await page.locator('button:has-text("Create")').first();
        await createButton.click();
        console.log('✓ Clicked Create button');
        
        // Wait for modal to close
        await page.waitForSelector('[id="modal"]', { state: 'hidden', timeout: 10000 });
        await page.waitForTimeout(1500);
        console.log('✓ Modal closed after save');
        
        // Wait for questions list to be stable
        await page.waitForSelector('div.flex.items-start.gap-4', { state: 'visible', timeout: 5000 });
        await page.waitForTimeout(500);
        
        // Find the last question card and click edit button
        const questionCards = await page.locator('div.flex.items-start.gap-4').all();
        const lastCard = questionCards[questionCards.length - 1];
        const editButton = await lastCard.locator('button').first();
        
        await editButton.click();
        await page.waitForTimeout(1000);
        console.log('✓ Reopened question for editing');
        
        // Wait for modal
        await page.waitForSelector('[id="modal"]', { state: 'visible', timeout: 5000 });
        await page.waitForTimeout(500);
        
        // Fill in the option input field with a number
        const optionInput = await page.locator('input[placeholder="New option"]').first();
        await optionInput.fill('1');
        await page.waitForTimeout(300);
        
        await takeScreenshot(page, 'admin-question-vote-add2.png', { fullPage: true, skipLoadWait: true });
        console.log('✓ Captured VOTE question step 2');
        
        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
      } catch (error) {
        console.log('⚠ Could not capture VOTE question type:', error.message);
      }
    } else {
      console.log('⚠ Edit button not visible');
    }
  } catch (error) {
    console.log('⚠ Could not capture question screenshots:', error.message);
  }
  
  // 5. View answers
  try {
    await page.goto(`${BASE_URL}/questionnaire`);
    // Find the first "View Answers" button
    const viewAnswersButton = await page.locator('table tbody tr button').first();
    if (await viewAnswersButton.isVisible()) {
      await viewAnswersButton.click();
      await page.waitForLoadState('networkidle');
      await takeScreenshot(page, 'admin-answers-view.png', { fullPage: true });
    } else {
      console.log('⚠ No answers available to view');
    }
  } catch (error) {
    console.log('⚠ Could not capture answers view page:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting screenshot capture...\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);
  
  const browser = await chromium.launch({
    headless: true, // Set to false to see the browser
  });
  
  const context = await browser.newContext({
    viewport: VIEWPORT,
    locale: 'it-IT', // Italian locale
  });
  
  const page = await context.newPage();
  
  try {
    // Capture screenshots
    await captureLoginPage(page);
    await captureUserScreenshots(page);
    await captureAdminScreenshots(page);
    
    console.log('\n✅ Screenshot capture process completed!');
    console.log(`📁 Screenshots saved in: ${OUTPUT_DIR}`);
    console.log('\n💡 Tip: Check the output above for any warnings about missing screenshots.');
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
  } finally {
    await browser.close();
  }
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
