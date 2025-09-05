import { Page } from '@playwright/test';

export async function dismissCookieBanner(page: Page): Promise<void> {
  //Needs time for the cookie banner to transition into view
  //Not ideal hack - Given more time a more robust solution should be implemented as documented
  await page.waitForTimeout(3000);
  if (
    await page.getByRole('button', { name: 'Accept all cookies' }).isVisible()
  ) {
    await page.getByRole('button', { name: 'Accept all cookies' }).click();
  }
}
