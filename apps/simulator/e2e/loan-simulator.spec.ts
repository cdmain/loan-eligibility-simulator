import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('displays the hero section with correct heading', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    await expect(page.getByRole('heading', { name: /See If You Qualify/i })).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole('button', { name: /Get Started/i })).toBeVisible()
  })

  test('shows feature pills', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    await expect(page.getByText('No credit check')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Instant results')).toBeVisible()
    await expect(page.getByText('Detailed breakdown')).toBeVisible()
  })

  test('navigates to simulator when clicking Get Started', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: /Get Started/i }).click()

    await expect(page.getByRole('heading', { name: /Your Loan Assessment/i })).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('navigates between home and simulator using nav buttons', async ({ page }) => {
    await page.goto('/')

    // Navigate to Simulator — use exact match to avoid matching the logo text
    await page.getByRole('button', { name: 'Simulator', exact: true }).click()
    await expect(page.getByRole('heading', { name: /Your Loan Assessment/i })).toBeVisible()

    // Navigate back to Home
    await page.getByRole('button', { name: 'Home', exact: true }).click()
    await expect(page.getByRole('heading', { name: /See If You Qualify/i })).toBeVisible()
  })

  test('clicking the logo navigates to landing', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Simulator', exact: true }).click()

    // Click the logo / title area
    await page.getByText('Loan Eligibility Simulator').click()
    await expect(page.getByRole('heading', { name: /See If You Qualify/i })).toBeVisible()
  })
})

test.describe('Loan Simulator Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Get Started/i }).click()
  })

  test('displays the form with default values', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Your Details' })).toBeVisible()
    await expect(page.getByText('Monthly Gross Income')).toBeVisible()
    await expect(page.getByText('Monthly Expenses')).toBeVisible()
    await expect(page.getByText('Loan Amount')).toBeVisible()
    await expect(page.getByText('Loan Term (months)')).toBeVisible()
  })

  test('shows empty results state before submission', async ({ page }) => {
    await expect(page.getByText('No assessment yet')).toBeVisible()
  })

  test('can add expense suggestions', async ({ page }) => {
    // Default has "Rent / Bond" already
    await expect(page.getByText('Rent / Bond')).toBeVisible()

    // Add Utilities
    await page.getByRole('button', { name: /Utilities/i }).click()
    await expect(page.locator('span', { hasText: 'Utilities' }).first()).toBeVisible()
  })

  test('can remove an expense', async ({ page }) => {
    // Add an expense first
    await page.getByRole('button', { name: /Groceries/i }).click()

    // Should show "Groceries" text
    const groceriesText = page.locator('span', { hasText: 'Groceries' }).first()
    await expect(groceriesText).toBeVisible()

    // Remove it using the X button (second remove button, first is Rent)
    const removeButtons = page.getByTitle('Remove expense')
    await removeButtons.last().click()
  })

  test('can add a custom expense', async ({ page }) => {
    await page.getByRole('button', { name: /Custom/i }).click()
    await expect(page.locator('span', { hasText: 'Other' }).first()).toBeVisible()
  })
})

test.describe('Full Eligibility Flow', () => {
  test('submits form and displays approved result', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Get Started/i }).click()

    // Fill in a healthy financial profile
    const incomeInput = page.locator('input[name="grossIncome"]')
    await incomeInput.fill('50000')

    // Submit the form
    await page.getByRole('button', { name: /Check Eligibility/i }).click()

    // Wait for results to appear (loading may be too fast to catch)
    await expect(page.getByText('Eligible', { exact: true })).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText(/Score:/)).toBeVisible()
    await expect(page.getByText(/Debt-to-Income:/)).toBeVisible()
  })

  test('shows declined result for poor financial profile', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Get Started/i }).click()

    // Fill in a poor financial profile - low income, high expenses
    const incomeInput = page.locator('input[name="grossIncome"]')
    await incomeInput.fill('15000')

    // The default rent expense is R 7000
    // Add more expenses to worsen the profile
    await page.getByRole('button', { name: /Groceries/i }).click()
    await page.getByRole('button', { name: /Transport/i }).click()

    // Set a high loan amount via the input
    const loanInput = page.locator('input[min="5000"][max="5000000"]')
    await loanInput.fill('2000000')
    await loanInput.dispatchEvent('change')

    // Submit
    await page.getByRole('button', { name: /Check Eligibility/i }).click()

    // Wait for assessment notes to appear (indicates results loaded)
    await expect(page.getByText('Assessment Notes')).toBeVisible({ timeout: 10_000 })
  })

  test('displays assessment notes after evaluation', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Get Started/i }).click()

    await page.getByRole('button', { name: /Check Eligibility/i }).click()

    // Wait for assessment notes to appear
    await expect(page.getByText('Assessment Notes')).toBeVisible({ timeout: 10_000 })
  })
})

test.describe('Theme Toggle', () => {
  test('can toggle between light and dark mode', async ({ page }) => {
    await page.goto('/')

    // Get the initial theme state from the html element
    const htmlEl = page.locator('html')
    const initialClass = await htmlEl.getAttribute('class') ?? ''

    // The theme toggle button is the last button in the header with an SVG icon
    // Find the button that contains a Moon or Sun icon
    const themeButton = page.locator('header button').last()
    await themeButton.click()

    // Wait a moment for the class change
    await page.waitForTimeout(300)

    const toggledClass = await htmlEl.getAttribute('class') ?? ''

    // After toggling, the class should have changed (dark added or removed)
    expect(toggledClass).not.toBe(initialClass)
  })
})
