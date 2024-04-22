import {
  ICustomWorld,
  toPlaywrightMockHandler,
  Handler,
} from '../../../../../../playwright-helpers';
import {
  GetAuthenticationMocks,
  getAuthenticationMocks,
} from '../../../../../../playwright-helpers/mocks/auth';
import { GetCatalogMocksParams, getCatalogMocks } from '../../mocks/catalog';

export type ConfigParams = GetAuthenticationMocks & GetCatalogMocksParams;

export const getConfig = (params: ConfigParams): Handler[] =>
  [getAuthenticationMocks, getCatalogMocks].flatMap((getMocks) =>
    getMocks(params),
  );

export const setupNetwork = async (world: ICustomWorld) =>
  Promise.all(
    getConfig({
      ...((world?.handlersConfig as ConfigParams) || ({} as ConfigParams)),
      isAuthMocked: true,
    })
      .reverse()
      .map(toPlaywrightMockHandler(world.context)),
  );
