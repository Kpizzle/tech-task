import { test, expect } from '@playwright/test';
import { setConsentCookie } from '../utils/consent';
import { extractRowsForChange } from '../utils/tableSort';
import { Console } from 'console';
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

test('Check highest percentage change', async ({ page }) => {
  await dismissCookieBanner(page);
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

  const rows = await extractRowsForChange(tableRows, 10);
  reporter(rows, 'Highest percentage change');
  saveDataToFile(rows, 'highestPercentageChangeResultsData');
});
