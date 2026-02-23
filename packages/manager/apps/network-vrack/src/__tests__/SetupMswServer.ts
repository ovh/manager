import { SetupServer } from 'msw/node';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';
import {
  getBandwidthLimitMocks,
  getOrderCartServiceOptionMocks,
  getServicesMocks,
} from '@ovh-ux/manager-network-common';
import type { GetServicesMocksParams, NetworkConfigParams } from '@ovh-ux/manager-network-common';

import { GetVrackTaskMocksParam, getVrackTaskMocks } from '@/__mocks__/vrack/tasks';
import { getVrackMocks } from '@/__mocks__/vrack/vrack';
import { getVrackIpMocks } from '@/__mocks__/vrack/vrackIp';
import { getVrackIpSubrangeMocks } from '@/__mocks__/vrack/vrackIpv6Subrange';

import { GetIamMocksParams, getIamMocks } from '../__mocks__/iam/iam';

export type MockParams = GetServicesMocksParams &
  NetworkConfigParams &
  GetIamMocksParams &
  GetVrackTaskMocksParam;

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
        ...getOrderCartServiceOptionMocks(),
        ...getVrackIpSubrangeMocks(),
        ...getIamMocks(mockParams),
        ...getVrackTaskMocks(mockParams),
      ].map((handler) => ({
        ...handler,
        delay: 0,
      })),
    ),
  );
};
