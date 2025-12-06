import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import type { SetupServer } from 'msw/node';

import { toMswHandlers } from '@ovh-ux/manager-core-test-utils';

import { GetLogKindsMocksParams, getLogKindsMocks } from '@/__mocks__/logKind.handler';
import { GetLogMessageParams, getLogMessageMocks } from '@/__mocks__/logMessage.handler';
import { GetLogRetentionMocksParams, getLogRetentionMocks } from '@/__mocks__/logRetention.handler';
import {
  GetLogServiceMocksParams,
  GetLogServicesMocksParams,
  getLogServiceMocks,
  getLogServicesMocks,
} from '@/__mocks__/logService.handler';
import {
  GetLogStreamMocksParams,
  GetLogStreamsMocksParams,
  getLogStreamMocks,
  getLogStreamsMocks,
} from '@/__mocks__/logStream.handler';
import { GetLogStreamUrlMocksParams, getLogStreamUrlMocks } from '@/__mocks__/logStreamUrl.handler';
import {
  GetLogSubscriptionsMocksParams,
  getLogSubscriptionsMocks,
} from '@/__mocks__/logSubscription.handler';
import { PostLogTailUrlParams, postLogTailUrlMocks } from '@/__mocks__/logTailUrl.handler';
import { MockedAppPageLabel } from '@/test-utils/MockedAppPage';
import { TestApp } from '@/test-utils/TestApp';

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
      ...getLogMessageMocks(mockParams),
    ]),
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
