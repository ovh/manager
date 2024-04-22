import { expect } from '@playwright/test';
import { ICustomWorld } from '@playwright-helpers';
import { ConfigParams as Config, setupNetwork } from './network';
import { getUrl } from './constants';
import { title } from '../../src/public/translations/catalog/Messages_fr_FR.json';

export async function setupE2eCatalogApp(ctx: ICustomWorld<Config>) {
  await setupNetwork(ctx);
  await ctx.page.goto(getUrl('root'), {
    waitUntil: 'load',
  });
  await expect(ctx.page.locator('osds-text', { hasText: title })).toBeVisible();
}

export * from './selector';
export * from './network';
export * from './constants';
