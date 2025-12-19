import '@/setupTests';
import React from 'react';
import { describe, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import {
  useAuthorizationIam,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import DashboardPage from '@/pages/dashboard/Dashboard';
import { useGetIAMResourceAllDom } from '@/hooks/iam/iam';
import { allDomIamResource } from '@/__mocks__/allDom';
import { allDomFeatureAvailibility } from '@/constants';
import { wrapper } from '@/utils/test.provider';

vi.mock('@/hooks/iam/iam', () => ({
  useGetIAMResourceAllDom: vi.fn(),
}));

describe('dashboard test', () => {
  it('should display the tabs', async () => {
    (useGetIAMResourceAllDom as jest.Mock).mockReturnValue({
      data: allDomIamResource,
    });

    (useAuthorizationIam as jest.Mock).mockReturnValue({
      isAuthorized: true,
    });

    (useFeatureAvailability as jest.Mock).mockReturnValue({
      data: { [allDomFeatureAvailibility]: true },
    });

    globalThis.HTMLElement.prototype.scrollIntoView = vi.fn();
    render(<DashboardPage />, { wrapper });

    const tab = screen.getByText('domain_operations_dashboard_title');
    expect(tab).toBeInTheDocument();
    expect(tab).not.toHaveAttribute('active');
  });
});
