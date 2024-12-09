import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { AxiosHeaders } from 'axios';
import { ErrorBannerProps, ErrorPage } from './ErrorPage.component';

/** Render */
const shellContext = {
  environment: {
    user: { ovhSubsidiary: 'FR' },
  },
  shell: {
    tracking: {
      trackClick: vi.fn(),
      trackPage: vi.fn(),
      init: vi.fn(),
    },
  },
};

const renderComponent = ({ error }: Partial<ErrorBannerProps>) => {
  return render(
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
      <ErrorPage error={error} />
    </ShellContext.Provider>,
  );
};

/** END RENDER */

describe('ErrorPage Component', () => {
  it('should display an api error message with queryid', async () => {
    const { getByText } = renderComponent({
      error: {
        response: {
          data: { message: 'api-error-message' },
          headers: {
            'x-ovh-queryid': 'api-error-queryid',
          },
          status: 400,
          statusText: 'nok',
          config: {
            headers: new AxiosHeaders({
              'x-ovh-queryid': 'api-error-queryid',
            }),
          },
        },
        toJSON: vi.fn(),
        isAxiosError: true,
        name: 'test',
        message: 'api-error-message',
      },
    });
    expect(getByText('api-error-message')).toBeDefined();
    expect(getByText('api-error-queryid', { exact: false })).toBeDefined();
  });
});
