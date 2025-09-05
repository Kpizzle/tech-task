import { test, expect } from '@playwright/test';
import { extractRowsForChange } from '../utils/tableSort';
import { saveDataToFile } from '../utils/generateFile';
import { dismissCookieBanner } from '../utils/dismissCookieBanner';
import { reporter } from '../utils/report';

test.beforeEach(async ({ page }) => {
  await page.goto('/indices/ftse-100/constituents/table');
  await expect(page).toHaveTitle(
    'Table - FTSE 100 FTSE constituents | London Stock Exchange'
  );
  await expect(page.getByText('Change %')).toBeVisible();
  await expect(page.getByText('Code')).toBeVisible();
});

test('Check lowest percentage change', async ({ page }) => {
  //Check if cookie banner is present and dismiss
  //Todo - refactor into util function
  await dismissCookieBanner(page);
  await page.getByText('Change %').click();
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


  const rows = await extractRowsForChange(tableRows, 10);
  reporter(rows, 'Lowest percentage change');
  saveDataToFile(rows, 'lowestPercentageChangeResultsData');
});
