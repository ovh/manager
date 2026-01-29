import { SetupServer } from 'msw/node';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';
import { getServicesMocks } from '@ovh-ux/manager-module-common-api';
import type { GetServicesMocksParams } from '@ovh-ux/manager-module-common-api';
import type { NetworkConfigParams } from '@ovh-ux/manager-network-common';

import { getBandwidthLimitMocks } from '@/__mocks__/vrack/bandwidthLimit';
import { getVrackMocks } from '@/__mocks__/vrack/vrack';
import { getVrackIpMocks } from '@/__mocks__/vrack/vrackIp';

import { GetIamMocksParams, getIamMocks } from '../__mocks__/iam/iam';

export type MockParams = GetServicesMocksParams & NetworkConfigParams & GetIamMocksParams;

export const setupMswMock = (mockParams: MockParams = {}) => {
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers(
      [
        ...getAuthenticationMocks({ isAuthMocked: true }),
        ...getServicesMocks(mockParams),
        // ...getNetworkConfig(mockParams),
        ...getVrackMocks(),
        ...getBandwidthLimitMocks(),
        ...getVrackIpMocks(),
        ...getIamMocks(mockParams),
      ].map((handler) => ({
        ...handler,
        delay: 0,
      })),
    ),
  );
};
