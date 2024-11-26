import React from 'react';
import { SetupServer } from 'msw/node';
import { render, waitFor, screen } from '@testing-library/react';
import { TestApp } from './TestApp';
import {
  getLogKindsMocks,
  GetLogKindsMocksParams,
} from '../data/mocks/logKind.handler';
import { toMswHandlers } from '../../../../../../playwright-helpers';
import { MockedAppPageLabel } from './MockedAppPage';

export const renderTest = async ({
  initialRoute,
  ...mockParams
}: {
  initialRoute?: string;
} & GetLogKindsMocksParams = {}) => {
  ((global as unknown) as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([...getLogKindsMocks(mockParams)]),
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
