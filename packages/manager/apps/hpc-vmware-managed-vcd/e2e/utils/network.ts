import { BrowserContext } from '@playwright/test';
import {
  ICustomWorld,
  toPlaywrightMockHandler,
  Handler,
} from '../../../../../../playwright-helpers';
import { GetAuthenticationMocks } from '../../../../../../playwright-helpers/mocks/auth';

export type ConfigParams = GetAuthenticationMocks;

export const getConfig = (params: ConfigParams): Handler[] => [];

export const setupNetwork = async (world: ICustomWorld) =>
  Promise.all(
    getConfig({
      ...((world?.handlersConfig as ConfigParams) || ({} as ConfigParams)),
      isAuthMocked: true,
    })
      .reverse()
      .map(toPlaywrightMockHandler(world.context as BrowserContext)),
  );
