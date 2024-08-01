import { BrowserContext } from '@playwright/test';
import {
  ICustomWorld,
  toPlaywrightMockHandler,
  Handler,
} from '../../../../../../playwright-helpers';
import {
  GetAuthenticationMocks,
  getAuthenticationMocks,
} from '../../../../../../playwright-helpers/mocks/auth';
import { getExampleMocks, GetExampleMocksParams } from '../../mocks';

export type ConfigParams = GetAuthenticationMocks & GetExampleMocksParams;

export const getConfig = (params: ConfigParams): Handler[] =>
  [getAuthenticationMocks, getExampleMocks].flatMap((getMocks) =>
    getMocks(params),
  );

export const setupNetwork = async (world: ICustomWorld) =>
  Promise.all(
    getConfig({
      ...((world?.handlersConfig as ConfigParams) || ({} as ConfigParams)),
      isAuthMocked: true,
    })
      .reverse()
      .map(toPlaywrightMockHandler(world.context as BrowserContext)),
  );
