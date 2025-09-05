import { test, expect } from '@playwright/test';
import { setConsentCookie } from '../utils/consent';
import { extractRowsForMarketCap } from '../utils/tableSort';

const MARKET_CAP_MINIMUM = 7000000;
//const MARKET_CAP_MINIMUM = 5000;

test.beforeEach(async ({ context, page }) => {
  //await setConsentCookie(context);
  await page.goto('/indices/ftse-100/constituents/table');
  await expect(page).toHaveTitle(
    'Table - FTSE 100 FTSE constituents | London Stock Exchange'
  );
});

test('Check market cap exceeds 7 million', async ({ page }) => {
  //Check if cookie banner is present and dismiss
  //Todo - refactor into util function
  await page.waitForTimeout(3000);
  if (
    await page.getByRole('button', { name: 'Accept all cookies' }).isVisible()
  ) {
    await page.getByRole('button', { name: 'Accept all cookies' }).click();
  }
  await page.getByText('Market cap (m)').click();
  //await page.waitForTimeout(5000);
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Highest – lowest' })
    .locator('div')
    .click();

  await page.waitForResponse((response) => response.url().includes('refresh'));

  //extract into util function
  const tableRows = await page.locator('app-ftse-index-table tbody tr');
  const rowCount = await tableRows.count();

  console.log('Market cap exceeds value');
  const rows = await extractRowsForMarketCap(tableRows);
  rows.forEach((row, index) => {
    console.log(
      `${index + 1}. Code:${row.code} CompanyName: ${row.name} Change %:${
        row.marketCap
      } `
    );
  });
});
