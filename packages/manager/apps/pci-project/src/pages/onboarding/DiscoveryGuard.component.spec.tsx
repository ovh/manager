import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import DiscoveryGuard from './DiscoveryGuard.component';
import { createWrapper, shellContext } from '@/wrapperRenders';
import {
  TEligibilityPaymentMethod,
  TEligibility,
} from '@/data/types/payment/eligibility.type';
import { PlanCode } from '@/data/types/cart.type';
import { useEligibility } from '@/data/hooks/payment/useEligibility';
import useActiveProjects from '@/data/hooks/useActiveProjects';
import { TProjectWithService } from '@/data/types/project.type';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@ovhcloud/ods-components/react', async () => {
  const mod = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...mod,
    OdsSpinner: () => <div data-testid="spinner" />,
  };
});
vi.mock('@ovh-ux/manager-pci-common', async (importOriginal) => {
  const actual: typeof import('@ovh-ux/manager-pci-common') = await importOriginal();
  // Needed to clear the mocked version of 'isDiscoveryProject'
  return {
    ...actual,
  };
});

vi.mock('@/data/hooks/payment/useEligibility', () => ({
  useEligibility: vi.fn(),
}));
vi.mock('@/data/hooks/useActiveProjects', () => ({
  default: vi.fn(),
}));

const mockNavigateTo = vi.fn();
const mockShellContext = {
  ...shellContext,
  shell: {
    ...shellContext.shell,
    navigation: {
      ...shellContext.shell.navigation,
      navigateTo: mockNavigateTo,
    },
  },
};

const wrapper = createWrapper(mockShellContext);

const mockEligibility = (
  opts: Partial<{
    paymentMethodsAuthorized: string[];
    isLoading: boolean;
    isError: boolean;
  }> = {},
) => {
  const {
    paymentMethodsAuthorized = [],
    isLoading = false,
    isError = false,
  } = opts;
  return ({
    data: { paymentMethodsAuthorized },
    isLoading,
    isError,
  } as unknown) as UseQueryResult<TEligibility>;
};

const mockProject = (
  opts: Partial<{
    planCode: PlanCode;
    isDefault: boolean;
    isUnpaid: boolean;
    project_id: string;
  }> = {},
) => {
  return ({
    planCode: opts.planCode || PlanCode.PROJECT_2018,
    isDefault: opts.isDefault || false,
    isUnpaid: opts.isUnpaid || false,
    project_id: opts.project_id || 'pid',
    service: {},
    aggregatedStatus: 'ok',
    status: 'ok',
  } as unknown) as TProjectWithService;
};

describe('DiscoveryGuard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockNavigateTo.mockClear();
    vi.mocked(useEligibility).mockReset();
    vi.mocked(useActiveProjects).mockReset();
  });

  it('shows spinner when loading eligibility', () => {
    vi.mocked(useEligibility).mockReturnValue(
      mockEligibility({ isLoading: true }),
    );
    vi.mocked(useActiveProjects).mockReturnValue({
      activeProjects: [],
      isReady: false,
    });
    const { getByTestId } = render(<DiscoveryGuard>children</DiscoveryGuard>, {
      wrapper,
    });
    expect(getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders children when not loading or redirecting', async () => {
    vi.mocked(useEligibility).mockReturnValue(mockEligibility());
    vi.mocked(useActiveProjects).mockReturnValue({
      activeProjects: [],
      isReady: true,
    });
    const {
      getByText,
      queryByTestId,
    } = render(<DiscoveryGuard>children</DiscoveryGuard>, { wrapper });
    await waitFor(() => {
      expect(queryByTestId('spinner')).not.toBeInTheDocument();
      expect(getByText('children')).toBeInTheDocument();
    });
  });

  it('displays onboarding page when eligibility throw an error', async () => {
    vi.mocked(useEligibility).mockReturnValue(
      mockEligibility({
        isError: true,
      }),
    );
    vi.mocked(useActiveProjects).mockReturnValue({
      activeProjects: [],
      isReady: true,
    });
    const {
      getByText,
      queryByTestId,
    } = render(<DiscoveryGuard>children</DiscoveryGuard>, { wrapper });
    await waitFor(() => {
      expect(queryByTestId('spinner')).not.toBeInTheDocument();
      expect(getByText('children')).toBeInTheDocument();
    });
  });

  it('redirects to project creation if CREDIT is available', async () => {
    vi.mocked(useEligibility).mockReturnValue(
      mockEligibility({
        paymentMethodsAuthorized: [TEligibilityPaymentMethod.CREDIT],
      }),
    );
    vi.mocked(useActiveProjects).mockReturnValue({
      activeProjects: [],
      isReady: true,
    });
    render(<DiscoveryGuard>children</DiscoveryGuard>, { wrapper });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('../new');
    });
  });

  it('redirects to projects list if there are unpaid projects', async () => {
    vi.mocked(useEligibility).mockReturnValue(mockEligibility());
    vi.mocked(useActiveProjects).mockReturnValue({
      activeProjects: [mockProject({ isUnpaid: true })],
      isReady: true,
    });
    render(<DiscoveryGuard>children</DiscoveryGuard>, { wrapper });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('../');
    });
  });

  it('redirects to discovery or default project if present', async () => {
    vi.mocked(useEligibility).mockReturnValue(mockEligibility());
    vi.mocked(useActiveProjects).mockReturnValue({
      activeProjects: [
        mockProject({ planCode: PlanCode.PROJECT_DISCOVERY, project_id: 'd1' }),
        mockProject({ isDefault: true, project_id: 'd2' }),
      ],
      isReady: true,
    });
    render(<DiscoveryGuard>children</DiscoveryGuard>, { wrapper });
    await waitFor(() => {
      expect(mockNavigateTo).toHaveBeenCalledWith(
        'public-cloud',
        expect.anything(),
        expect.objectContaining({ projectId: 'd1' }),
      );
    });
  });

  it('redirects to projects list if some non-discovery projects exist', async () => {
    vi.mocked(useEligibility).mockReturnValue(mockEligibility());
    vi.mocked(useActiveProjects).mockReturnValue({
      activeProjects: [mockProject({ planCode: PlanCode.PROJECT_2018 })],
      isReady: true,
    });
    render(<DiscoveryGuard>children</DiscoveryGuard>, { wrapper });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('../');
    });
  });
});
