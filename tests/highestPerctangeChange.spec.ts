import { test, expect } from '@playwright/test';
import { setConsentCookie } from '../utils/consent';
import { extractRowsForChange } from '../utils/tableSort';
import { Console } from 'console';
import { saveDataToFile } from '../utils/generateFile';

test.beforeEach(async ({ context, page }) => {
  //await setConsentCookie(context);
  await page.goto('/indices/ftse-100/constituents/table');
  await expect(page).toHaveTitle(
    'Table - FTSE 100 FTSE constituents | London Stock Exchange'
  );
  await expect(page.getByText('Change %')).toBeVisible();
  await expect(page.getByText('Code')).toBeVisible();
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
  saveDataToFile(rows, 'highestPercentageChangeResultsData');
});
