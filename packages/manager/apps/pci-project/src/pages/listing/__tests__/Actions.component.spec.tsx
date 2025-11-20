import { useHref } from 'react-router-dom';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useNotifications } from '@ovh-ux/manager-react-components';

import { removeProject } from '@/data/api/projects';
import { useSetAsDefaultProject } from '@/data/hooks/useProjects';
import { TAggregatedStatus, TProjectWithService } from '@/data/models/Project.type';
import { TService } from '@/data/models/Service.type';
import { TProjectStatus } from '@/types/pci-common.types';
import { createWrapper } from '@/wrapperRenders';

import Actions from '../Actions.component';

const { mockRemoveProject, mockGetDefaultProject, mockUseSetAsDefaultProject } = vi.hoisted(() => ({
  mockRemoveProject: vi.fn<() => Promise<unknown>>().mockResolvedValue({}),
  mockGetDefaultProject: vi.fn<() => Promise<unknown>>().mockResolvedValue({}),
  mockUseSetAsDefaultProject: vi.fn(),
}));

vi.mock('@/data/api/projects', () => ({
  removeProject: mockRemoveProject,
  getDefaultProject: mockGetDefaultProject,
}));

vi.mock('@/data/hooks/useProjects', () => ({
  useSetAsDefaultProject: mockUseSetAsDefaultProject,
}));

describe('Actions Component', () => {
  const mockService: TService = {
    route: {
      url: 'test-url',
      path: 'test-path',
      vars: [],
    },
    billing: {
      plan: {
        code: 'test-code',
        invoiceName: 'test-invoice',
      },
      renew: null,
      pricing: {
        price: {
          text: '10€',
          value: 10,
          currencyCode: 'EUR',
        },
        duration: 'P1M',
        interval: 1,
        capacities: [],
        description: 'test',
        pricingMode: 'test',
        pricingType: 'test',
        maximumRepeat: null,
        minimumRepeat: 1,
        priceInUcents: 1000,
        maximumQuantity: 1,
        minimumQuantity: 1,
      },
      lifecycle: {
        current: {
          state: 'active',
          creationDate: '2024-01-01',
          terminationDate: null,
        },
        capacities: {
          actions: [],
        },
      },
      expirationDate: '2024-12-31',
      nextBillingDate: '2024-02-01',
    },
    customer: {
      contacts: [],
    },
    resource: {
      name: 'test-resource',
      state: 'active',
      product: {
        name: 'test-product',
        description: 'test-description',
      },
      displayName: 'Test Resource',
    },
    serviceId: 1111,
    parentServiceId: null,
  };

  const mockProject: TProjectWithService = {
    project_id: 'test-project-id',
    status: 'ok' as TProjectStatus,
    isUnpaid: false,
    isDefault: false,
    service: mockService,
    access: 'full',
    creationDate: '2024-01-01',
    iam: {
      id: 'test-id',
      urn: 'test-urn',
    },
    manualQuota: false,
    planCode: 'test-plan',
    description: 'Test project',
    orderId: 12345,
    projectName: 'Test Project',
    aggregatedStatus: 'ok' as TAggregatedStatus,
    unleash: false,
  };

  const mockAddSuccess = vi.fn();
  const mockAddError = vi.fn();
  const mockClearNotifications = vi.fn();
  const mockSetAsDefaultProject = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNotifications).mockReturnValue({
      addSuccess: mockAddSuccess,
      addError: mockAddError,
      clearNotifications: mockClearNotifications,
    });
    vi.mocked(useHref).mockImplementation((path) => path as string);
    vi.mocked(useSetAsDefaultProject).mockReturnValue({
      mutate: mockSetAsDefaultProject,
      mutateAsync: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      reset: vi.fn(),
      data: undefined,
      variables: undefined,
      isIdle: true,
      status: 'idle' as const,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      context: undefined,
      submittedAt: 0,
    });
  });

  it('should render action menu with correct items for active project', () => {
    render(<Actions projectWithService={mockProject} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId('action-menu')).toBeInTheDocument();
    expect(screen.getByTestId('action-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('action-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('action-item-3')).toBeInTheDocument();
  });

  it('should show pay bill option when project has pending debt', async () => {
    const projectWithDebt = {
      ...mockProject,
      isUnpaid: true,
    };

    render(<Actions projectWithService={projectWithDebt} />, {
      wrapper: createWrapper(),
    });

    const payBillButton = screen.getByTestId('action-item-0');
    expect(payBillButton).toBeInTheDocument();

    await waitFor(() => {
      expect(payBillButton).toHaveAttribute('href', 'https://billing-url');
    });
  });

  it('should handle project deletion for creating project', async () => {
    const creatingProject = {
      ...mockProject,
      status: 'creating' as TProjectStatus,
      aggregatedStatus: 'creating' as TAggregatedStatus,
    };

    render(<Actions projectWithService={creatingProject} />, {
      wrapper: createWrapper(),
    });

    const deleteMenuItem = screen.getByTestId('action-item-2');

    const clickHandler: () => void = () => {
      fireEvent.click(deleteMenuItem);
    };
    (act as (callback: () => void) => void)(clickHandler);

    await waitFor(() => {
      expect(removeProject).toHaveBeenCalledWith({
        projectId: 'test-project-id',
      });
      expect(mockAddSuccess).toHaveBeenCalledOnce();
    });
  });

  it('should not show delete option for suspended project', () => {
    const suspendedProject = {
      ...mockProject,
      status: 'suspended' as TProjectStatus,
    };

    render(<Actions projectWithService={suspendedProject} />, {
      wrapper: createWrapper(),
    });

    expect(screen.queryByTestId('action-item-2')).not.toBeInTheDocument();
  });

  it('should not show delete option for project with pending debt', () => {
    const projectWithDebt = {
      ...mockProject,
      isUnpaid: true,
    };

    render(<Actions projectWithService={projectWithDebt} />, {
      wrapper: createWrapper(),
    });

    expect(screen.queryByTestId('action-item-2')).not.toBeInTheDocument();
  });

  it('should show set ad default project option when project is not default', () => {
    const nonDefaultProject = {
      ...mockProject,
      isDefault: false,
    };

    render(<Actions projectWithService={nonDefaultProject} />, {
      wrapper: createWrapper(),
    });

    const setAsDefaultButton = screen.getByTestId('action-item-3');
    expect(setAsDefaultButton).toBeInTheDocument();
    expect(setAsDefaultButton).toHaveTextContent(
      'pci_projects_project_edit_set_as_default_project',
    );
  });

  it('should not show set ad default project option when project is already default', () => {
    const defaultProject = {
      ...mockProject,
      isDefault: true,
    };

    render(<Actions projectWithService={defaultProject} />, {
      wrapper: createWrapper(),
    });

    expect(screen.queryByTestId('action-item-3')).not.toBeInTheDocument();
  });

  it('should call setAsDefaultProject when action clicked', () => {
    const nonDefaultProject = {
      ...mockProject,
      isDefault: false,
    };

    render(<Actions projectWithService={nonDefaultProject} />, {
      wrapper: createWrapper(),
    });

    const setAsDefaultButton = screen.getByTestId('action-item-3');

    const clickHandler: () => void = () => {
      fireEvent.click(setAsDefaultButton);
    };
    void (act as (callback: () => void | Promise<void>) => void | Promise<void>)(clickHandler);

    expect(mockSetAsDefaultProject).toHaveBeenCalledWith('test-project-id');
  });

  it('should show success notification when setting project as default succeeds', () => {
    const nonDefaultProject = {
      ...mockProject,
      isDefault: false,
    };

    // Mock the success callback
    const mockOnSuccess = vi.fn();
    const customMutate = vi.fn((projectId: string) => {
      mockSetAsDefaultProject(projectId);
      mockOnSuccess();
    });

    vi.mocked(useSetAsDefaultProject).mockReturnValue({
      mutate: customMutate,
      mutateAsync: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      reset: vi.fn(),
      data: undefined,
      variables: undefined,
      isIdle: true,
      status: 'idle' as const,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      context: undefined,
      submittedAt: 0,
    });

    render(<Actions projectWithService={nonDefaultProject} />, {
      wrapper: createWrapper(),
    });

    const setAsDefaultButton = screen.getByTestId('action-item-3');

    const clickHandler: () => void = () => {
      fireEvent.click(setAsDefaultButton);
    };
    void (act as (callback: () => void | Promise<void>) => void | Promise<void>)(clickHandler);

    expect(mockSetAsDefaultProject).toHaveBeenCalledWith('test-project-id');
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should show error notification when setting project as default fails', () => {
    const nonDefaultProject = {
      ...mockProject,
      isDefault: false,
    };

    const mockError = new Error('API Error');

    // Mock the error callback
    const mockOnError = vi.fn();
    const customMutate = vi.fn((projectId: string) => {
      mockSetAsDefaultProject(projectId);
      mockOnError(mockError);
    });

    vi.mocked(useSetAsDefaultProject).mockReturnValue({
      mutate: customMutate,
      mutateAsync: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      reset: vi.fn(),
      data: undefined,
      variables: undefined,
      isIdle: true,
      status: 'idle' as const,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      context: undefined,
      submittedAt: 0,
    });

    render(<Actions projectWithService={nonDefaultProject} />, {
      wrapper: createWrapper(),
    });

    const setAsDefaultButton = screen.getByTestId('action-item-3');

    const clickHandler: () => void = () => {
      fireEvent.click(setAsDefaultButton);
    };
    void (act as (callback: () => void | Promise<void>) => void | Promise<void>)(clickHandler);

    expect(mockSetAsDefaultProject).toHaveBeenCalledWith('test-project-id');
    expect(mockOnError).toHaveBeenCalledWith(mockError);
  });
});
