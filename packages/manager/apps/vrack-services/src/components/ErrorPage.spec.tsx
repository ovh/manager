import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
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

const renderComponent = ({ error }: ErrorBannerProps) => {
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
        },
      },
    });
    expect(getByText('api-error-message')).toBeDefined();
    expect(getByText('api-error-queryid', { exact: false })).toBeDefined();
  });
});
