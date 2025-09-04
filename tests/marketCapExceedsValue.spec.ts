import { test, expect } from '@playwright/test';
import { setConsentCookie } from '../utils/consent';

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
  for (let i = 0; i < rowCount; i++) {
    const row = tableRows.nth(i);
    const marketCap = await row.locator('td').nth(3).innerText();

    let marketCapValue = parseFloat(marketCap.replace(/,/g, ''));

    if (marketCapValue > MARKET_CAP_MINIMUM) {
      const code = await row.locator('td').nth(0).innerText();
      const name = await row.locator('td').nth(1).innerText();
      const capValue = await row.locator('td').nth(3).innerText();
      console.log(`${i + 1}. ${code}. ${name} Change %:${capValue}`);
    } else {
      continue;
    }
  }
});
