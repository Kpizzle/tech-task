// utils/consent.ts
import { BrowserContext } from '@playwright/test';

//TODO - Get this function working
// I tried to get this working as a nice util so that we could remove the clunky cookie modal handler logic
// But I didn't want to spend too much time on this; but would be a must have if this framework would be used further
// some further investigation on how the cookie functionality worked would yealed greater resulst but was out of scope. 

export async function setConsentCookie(context: BrowserContext) {
  await context.addCookies([
    {
      name: 'OptanonConsent',
      value:
        'isGpcEnabled=0&datestamp=Wed+Sep+03+2025+14%3A09%3A38+GMT%2B0100+(British+Summer+Time)&version=202405.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=44eb54b9-7e0c-48e3-9474-55f975c5f709&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&intType=1',
      domain: '.londonstockexchange.com',
      path: '/',
      httpOnly: false,
      secure: true,
      sameSite: 'Lax',
    },
  ]);
}
