import { test, expect } from '@playwright/test';
import { setConsentCookie } from '../utils/consent';

test.beforeEach(async ({ context, page }) => {
  //await setConsentCookie(context);
  await page.goto('/indices/ftse-100/constituents/table');
  await expect(page).toHaveTitle(
    'Table - FTSE 100 FTSE constituents | London Stock Exchange'
  );
});

test('Check highest percentage change', async ({ page }) => {
  //Check if cookie banner is present and dismiss
  //Todo - refactor into util function
  await page.waitForTimeout(3000);
  if (
    await page.getByRole('button', { name: 'Accept all cookies' }).isVisible()
  ) {
    await page.getByRole('button', { name: 'Accept all cookies' }).click();
  }
  await page.getByText('Change %').click();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Highest – lowest' })
    .locator('div')
    .click();

  
  //Assert table exists 
  await expect(await page.locator('app-ftse-index-table')).toBeVisible();
  const tableRows = await page.locator('app-ftse-index-table tbody tr');
  //const rowCount = await tableRows.count();

  //TODO - fix issue with full name not being displayed
  console.log('Highest percentage change');
  for (let i = 0; i < 10; i++) {
    const row = tableRows.nth(i);
    const code = await row.locator('td').nth(0).innerText();
    const name = await row.locator('td').nth(1).innerText();
    const change = await row.locator('td').last().innerText();
    console.log(`${i + 1}. ${code}. ${name} Change %:${change}`);
  }
});
