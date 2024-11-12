import { BrowserContext } from '@playwright/test';
import {
  getServicesMocks,
  GetServicesMocksParams,
} from '@ovh-ux/manager-react-components';
import {
  ICustomWorld,
  toPlaywrightMockHandler,
  Handler,
} from '../../../../../../playwright-helpers';
import {
  GetAuthenticationMocks,
  getAuthenticationMocks,
} from '../../../../../../playwright-helpers/mocks/auth';
import {
  getIamMocks,
  getOrganizationMocks,
  GetOrganizationMocksParams,
  getVeeamBackupMocks,
  GetVeeamBackupMocksParams,
} from '../../mocks';

export type ConfigParams = GetAuthenticationMocks &
  GetVeeamBackupMocksParams &
  GetOrganizationMocksParams &
  GetServicesMocksParams;

export const getConfig = (params: ConfigParams): Handler[] =>
  [
    getAuthenticationMocks,
    getIamMocks,
    getOrganizationMocks,
    getVeeamBackupMocks,
    getServicesMocks,
  ].flatMap((getMocks) => getMocks(params));

export const setupNetwork = async (world: ICustomWorld) =>
  Promise.all(
    getConfig({
      ...((world?.handlersConfig as ConfigParams) || ({} as ConfigParams)),
      isAuthMocked: true,
    })
      .reverse()
      .map(toPlaywrightMockHandler(world.context as BrowserContext)),
  );
