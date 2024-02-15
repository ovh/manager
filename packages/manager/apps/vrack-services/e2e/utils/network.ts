import { BrowserContext } from '@playwright/test';
import { ICustomWorld } from '@playwright-helpers';
import { toPlaywrightMockHandler } from '../../../../../../playwright-helpers';
import { getConfig, ConfigParams } from '../../mock/handlers';

export const setupNetwork = async (world: ICustomWorld) =>
  Promise.all(
    getConfig({
      ...((world?.handlersConfig as ConfigParams) || ({} as ConfigParams)),
      isAuthMocked: true,
    })
      .reverse()
      .map(toPlaywrightMockHandler(world.context as BrowserContext)),
  );
