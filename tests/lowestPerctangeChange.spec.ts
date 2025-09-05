import { test, expect } from '@playwright/test';
import { setConsentCookie } from '../utils/consent';
import { extractRowsForChange } from '../utils/tableSort';

test.beforeEach(async ({ context, page }) => {
  //await setConsentCookie(context);
  await page.goto('/indices/ftse-100/constituents/table');
  await expect(page).toHaveTitle(
    'Table - FTSE 100 FTSE constituents | London Stock Exchange'
  );
});

test('Check lowest percentage change', async ({ page }) => {
  //Check if cookie banner is present and dismiss
  //Todo - refactor into util function
  await page.waitForTimeout(3000);
  if (
    await page.getByRole('button', { name: 'Accept all cookies' }).isVisible()
  ) {
    await page.getByRole('button', { name: 'Accept all cookies' }).click();
  }
  await page.getByText('Change %').click();
  await page.waitForTimeout(5000);
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Lowest – highest' })
    .locator('div')
    .click();

  //Network request checked needed as PW to fast - table needs to render
  await page.waitForResponse((response) => response.url().includes('refresh'));

  //Assert table exists
  await expect(await page.locator('app-ftse-index-table')).toBeVisible();
  const tableRows = await page.locator('app-ftse-index-table tbody tr');
  const rowCount = await tableRows.count();
  expect(rowCount).toBeGreaterThan(9);

  //TODO - fix issue with full name not being displayed
  console.log('Highest percentage change');

  const rows = await extractRowsForChange(tableRows, 10);
  rows.forEach((row, index) => {
    console.log(
      `${index + 1}. Code:${row.code} CompanyName: ${row.name} Change %:${
        row.change
      } `
    );
  });
});
