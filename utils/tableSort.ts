import { Locator } from '@playwright/test';

//TODO: Given further time I'd make these two functions one more generic function with filter options.

export interface StockRow {
  code: string;
  name: string;
  marketCapValue?: number;
  change?: number;
}

//move to env file
const MARKET_CAP_MINIMUM = 2000;

export async function extractRowsForChange(
  tableRows: Locator,
  limit?: number
): Promise<StockRow[]> {
  const count = await tableRows.count();
  const rows: StockRow[] = [];

  for (let i = 0; i < (limit ?? count); i++) {
    const row = tableRows.nth(i);
    const code = await row.locator('td').nth(0).innerText();
    const name = await row.locator('td').nth(1).innerText();
    const change = parseFloat(await row.locator('td').last().innerText());
    rows.push({ code, name, change });
  }
  return rows;
}

export async function extractRowsForMarketCap(
  tableRows: Locator,
  limit?: number
): Promise<StockRow[]> {
  const count = await tableRows.count();
  const rows: StockRow[] = [];

  for (let i = 0; i < (limit ?? count); i++) {
    const row = tableRows.nth(i);
    const marketCap = await row.locator('td').nth(3).innerText();
    let marketCapValue = parseFloat(marketCap.replace(/,/g, ''));

    if (marketCapValue > MARKET_CAP_MINIMUM) {
      const code = await row.locator('td').nth(0).innerText();
      const name = await row.locator('td').nth(1).innerText();
      const marketCap = await row.locator('td').nth(3).innerText();
      rows.push({ code, name, marketCapValue });
      //console.log(`${i + 1}. ${code}. ${name} Change %:${marketCap}`);
    } else {
      continue;
    }
  }

  return rows;
}
