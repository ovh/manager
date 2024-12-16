import React from 'react';
import { SetupServer } from 'msw/node';
import { render, waitFor, screen } from '@testing-library/react';
import { TestApp } from './TestApp';
import { toMswHandlers } from '../../../../../../playwright-helpers';
import { MockedAppPageLabel } from './MockedAppPage';
import {
  getLogKindsMocks,
  GetLogKindsMocksParams,
} from '../data/mocks/logKind.handler';
import {
  getLogMessageMocks,
  GetLogMessageParams,
} from '../data/mocks/logMessage.handler';
import {
  PostLogTailUrlParams,
  postLogTailUrlMocks,
} from '../data/mocks/logTailUrl.handler';
import {
  GetLogSubscriptionsMocksParams,
  getLogSubscriptionsMocks,
} from '../data/mocks/logSubscription.handler';
import {
  GetLogStreamUrlMocksParams,
  getLogStreamUrlMocks,
} from '../data/mocks/logStreamUrl.handler';
import {
  GetLogStreamMocksParams,
  getLogStreamMocks,
} from '../data/mocks/logStream.handler';
import {
  GetLogServiceMocksParams,
  getLogServiceMocks,
} from '../data/mocks/logService.handler';

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
  GetLogServiceMocksParams = {}) => {
  ((global as unknown) as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getLogKindsMocks(mockParams),
      ...postLogTailUrlMocks(mockParams),
      ...getLogSubscriptionsMocks(mockParams),
      ...getLogStreamUrlMocks(mockParams),
      ...getLogStreamMocks(mockParams),
      ...getLogServiceMocks(mockParams),
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
