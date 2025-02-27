import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import OrganizationOptionsTile from './OrganizationOptionsTile.component';
import { labels } from '../../../test-utils';

const shellContext = {
  environment: {
    getRegion: vi.fn(),
    getUser: vi.fn(),
  },
};

const renderComponent = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <OrganizationOptionsTile isLicenseActive={false} />
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

describe('OrganizationOptionsTile component unit test suite', () => {
  it('should define tileTitle and sections', async () => {
    // when
    renderComponent();

    // then
    const elements = [
      labels.dashboard.managed_vcd_dashboard_options,
      labels.dashboard.managed_vcd_dashboard_windows_license,
    ];

    elements.forEach(async (element) => assertTextVisibility(element));
  });
});
