// V Should be first V
import '../../test-utils/setupTests';
// -----
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  DashboardLayout,
  DashboardLayoutProps,
} from './DashboardLayout.component';
import { VrackServicesWithIAM, useVrackServicesList } from '@/data';
import vrackServicesList from '../../../mocks/vrack-services/get-vrack-services.json';

const queryClient = new QueryClient();

vi.mock('@/data', async (importOriginal) => {
  const original: typeof import('@/data') = await importOriginal();
  return {
    ...original,
    useVrackServicesList: vi.fn(),
  };
});

const renderComponent = ({ ...args }: DashboardLayoutProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <DashboardLayout {...args} />
    </QueryClientProvider>,
  );
};

describe('DashboardLayout Component', () => {
  it('should display a dashboard layout', async () => {
    vi.mocked(useVrackServicesList).mockReturnValue({
      data: { data: vrackServicesList },
    } as UseQueryResult<ApiResponse<VrackServicesWithIAM[]>, ApiError>);

    const { getByText } = renderComponent({
      tabs: [
        {
          name: 'tab-1-name',
          title: 'tab-1-title',
          to: 'tab-1-to',
        },
        {
          name: 'tab-2-name',
          title: 'tab-2-title',
          to: 'tab-2-to',
          pathMatchers: [new RegExp('pathname')],
        },
      ],
    });

    const title = getByText('dashboardPageTitle');
    expect(title).toBeDefined();

    const description = getByText('dashboardPageDescription');
    expect(description).toBeDefined();

    await waitFor(() => {
      const tab1 = getByText('tab-1-title');
      expect(tab1).toBeDefined();
      expect(tab1).not.toHaveAttribute('active');

      const tab2 = getByText('tab-2-title');
      expect(tab2).toBeDefined();
      expect(tab2).toHaveAttribute('active');
    });
  });
});
