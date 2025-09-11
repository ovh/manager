import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { SetupServer } from 'msw/node';

import { toMswHandlers } from '@ovh-ux/manager-core-test-utils';

import { GetLogKindsMocksParams, getLogKindsMocks } from '../data/mocks/logKind.handler';
import { GetLogMessageParams, getLogMessageMocks } from '../data/mocks/logMessage.handler';
import {
  GetLogRetentionMocksParams,
  getLogRetentionMocks,
} from '../data/mocks/logRetention.handler';
import {
  GetLogServiceMocksParams,
  GetLogServicesMocksParams,
  getLogServiceMocks,
  getLogServicesMocks,
} from '../data/mocks/logService.handler';
import {
  GetLogStreamMocksParams,
  GetLogStreamsMocksParams,
  getLogStreamMocks,
  getLogStreamsMocks,
} from '../data/mocks/logStream.handler';
import {
  GetLogStreamUrlMocksParams,
  getLogStreamUrlMocks,
} from '../data/mocks/logStreamUrl.handler';
import {
  GetLogSubscriptionsMocksParams,
  getLogSubscriptionsMocks,
} from '../data/mocks/logSubscription.handler';
import { PostLogTailUrlParams, postLogTailUrlMocks } from '../data/mocks/logTailUrl.handler';
import { MockedAppPageLabel } from './MockedAppPage';
import { TestApp } from './TestApp';

export const renderTest = async ({
  initialRoute,
  ...mockParams
}: {
  initialRoute?: string;
} & GetLogKindsMocksParams &
  GetLogMessageParams &
  PostLogTailUrlParams &
  GetLogSubscriptionsMocksParams &
  GetLogStreamUrlMocksParams &
  GetLogStreamMocksParams &
  GetLogStreamsMocksParams &
  GetLogServiceMocksParams &
  GetLogRetentionMocksParams &
  GetLogServicesMocksParams = {}) => {
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getLogKindsMocks(mockParams),
      ...postLogTailUrlMocks(mockParams),
      ...getLogSubscriptionsMocks(mockParams),
      ...getLogStreamUrlMocks(mockParams),
      ...getLogStreamMocks(mockParams),
      ...getLogStreamsMocks(mockParams),
      ...getLogServiceMocks(mockParams),
      ...getLogServicesMocks(mockParams),
      ...getLogRetentionMocks(mockParams),
    ]),
    getLogMessageMocks(mockParams),
  );

  const result = render(<TestApp initialRoute={initialRoute} />);

  if (!initialRoute || initialRoute === '/') {
    await waitFor(
      () =>
        expect(
          screen.getByText(MockedAppPageLabel, {
            exact: false,
          }),
        ).toBeDefined(),
      { timeout: 30_000 },
    );
  }

  return result;
};
