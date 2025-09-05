import { test, expect } from '@playwright/test';
import { extractRowsForMarketCap } from '../utils/tableSort';
import { saveDataToFile } from '../utils/generateFile';
import { dismissCookieBanner } from '../utils/dismissCookieBanner';
import { reporter } from '../utils/report';

test.beforeEach(async ({ context, page }) => {
  //await setConsentCookie(context);
  await page.goto('/indices/ftse-100/constituents/table');
  await expect(page).toHaveTitle(
    'Table - FTSE 100 FTSE constituents | London Stock Exchange'
  );
  await expect(page.getByText('Market cap (m)')).toBeVisible();
  await expect(page.getByText('Code')).toBeVisible();
});

test('Check market cap exceeds 7 million', async ({ page }) => {
  await dismissCookieBanner(page);
  await page.getByText('Market cap (m)').click();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Highest – lowest' })
    .locator('div')
    .click();

  //Network request checked needed as PW to fast - table needs to render
  await page.waitForResponse((response) => response.url().includes('refresh'));

  //extract into util function
  const tableRows = await page.locator('app-ftse-index-table tbody tr');
  const rowCount = await tableRows.count();
  expect(rowCount).toBeGreaterThan(0);

  const rows = await extractRowsForMarketCap(tableRows);
  reporter(rows, 'Market cap exceeds value');
  saveDataToFile(rows, 'marketCapResultsData');
});
