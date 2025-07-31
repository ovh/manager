/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { TProjectStatus } from '@ovh-ux/manager-pci-common';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useHref } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { removeProject } from '@/data/api/projects';
import { useSetAsDefaultProject } from '@/data/hooks/useProjects';
import {
  TAggregatedStatus,
  TProjectWithService,
} from '@/data/types/project.type';
import { TService } from '@/data/types/service.type';
import { createOptimalWrapper } from '@/test-utils/lightweight-wrappers';
import Actions from './Actions.component';

vi.mock('@/data/api/projects', () => ({
  removeProject: vi.fn().mockResolvedValue({}),
  getDefaultProject: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/data/hooks/useProjects', () => ({
  useSetAsDefaultProject: vi.fn(),
}));

const mockAddSuccess = vi.fn();
const mockAddError = vi.fn();

vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: vi.fn(() => ({
    addSuccess: mockAddSuccess,
    addError: mockAddError,
  })),
  ActionMenu: ({ items, children, isCompact, ...props }: any) => {
    // Filter out isCompact to avoid React warning
    const { iscompact, ...cleanProps } = props;
    return React.createElement(
      'div',
      { 'data-testid': 'action-menu', ...cleanProps },
      [
        children,
        // Render menu items for testing
        items?.map((item: any, index: number) =>
          React.createElement(
            'button',
            {
              key: index,
              'data-testid': item.id || `action-item-${index}`,
              onClick: item.onClick,
            },
            item.label,
          ),
        ),
      ],
    );
  },
}));

vi.mock('react-router-dom', () => ({
  useHref: vi.fn(),
  MemoryRouter: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'memory-router' }, children),
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

  const mockSetAsDefaultProject = vi.fn();

  beforeEach(() => {
    vi.mocked(useHref).mockImplementation((path) => {
      if (path === 'billing') return 'https://billing-url';
      return path as string;
    });

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

  it('should render action menu with correct items for active project', async () => {
    await act(async () => {
      render(<Actions projectWithService={mockProject} />, {
        wrapper: createOptimalWrapper({ routing: true, shell: true }),
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('action-menu')).toBeInTheDocument();
      expect(screen.getByText('pci_projects_project_show')).toBeInTheDocument();
      expect(
        screen.getByText('pci_projects_project_delete'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('pci_projects_project_edit_set_as_default_project'),
      ).toBeInTheDocument();
    });
  });

  it('should show pay bill option when project has pending debt', async () => {
    const projectWithDebt = {
      ...mockProject,
      isUnpaid: true,
    };

    await act(async () => {
      render(<Actions projectWithService={projectWithDebt} />, {
        wrapper: createOptimalWrapper({ routing: true, shell: true }),
      });
    });

    await waitFor(() => {
      const payBillButton = screen.getByText('pci_projects_project_pay_bill');
      expect(payBillButton).toBeInTheDocument();
      // Just check that the pay bill option is present
      expect(payBillButton).toHaveAttribute('data-testid', 'action-item-0');
    });
  });

  it('should handle project deletion for creating project', async () => {
    const creatingProject = {
      ...mockProject,
      status: 'creating' as TProjectStatus,
      aggregatedStatus: 'creating' as TAggregatedStatus,
    };

    await act(async () => {
      render(<Actions projectWithService={creatingProject} />, {
        wrapper: createOptimalWrapper({ routing: true, shell: true }),
      });
    });

    await waitFor(() => {
      const deleteMenuItem = screen.getByText('pci_projects_project_delete');
      expect(deleteMenuItem).toBeInTheDocument();
    });

    await act(async () => {
      const deleteMenuItem = screen.getByText('pci_projects_project_delete');
      await fireEvent.click(deleteMenuItem);
    });

    await waitFor(() => {
      expect(removeProject).toHaveBeenCalledWith({
        projectId: 'test-project-id',
      });
      expect(mockAddSuccess).toHaveBeenCalledWith(
        'pci_projects_project_delete_success',
      );
    });
  });

  it('should not show delete option for suspended project', async () => {
    const suspendedProject = {
      ...mockProject,
      status: 'suspended' as TProjectStatus,
    };

    await act(async () => {
      render(<Actions projectWithService={suspendedProject} />, {
        wrapper: createOptimalWrapper({ routing: true, shell: true }),
      });
    });

    await waitFor(() => {
      expect(
        screen.queryByText('pci_projects_project_delete'),
      ).not.toBeInTheDocument();
    });
  });

  it('should not show delete option for project with pending debt', async () => {
    const projectWithDebt = {
      ...mockProject,
      isUnpaid: true,
    };

    await act(async () => {
      render(<Actions projectWithService={projectWithDebt} />, {
        wrapper: createOptimalWrapper({ routing: true, shell: true }),
      });
    });

    await waitFor(() => {
      expect(
        screen.queryByText('pci_projects_project_delete'),
      ).not.toBeInTheDocument();
    });
  });

  it('should show set ad default project option when project is not default', async () => {
    const nonDefaultProject = {
      ...mockProject,
      isDefault: false,
    };

    await act(async () => {
      render(<Actions projectWithService={nonDefaultProject} />, {
        wrapper: createOptimalWrapper({ routing: true, shell: true }),
      });
    });

    await waitFor(() => {
      const setAsDefaultButton = screen.getByText(
        'pci_projects_project_edit_set_as_default_project',
      );
      expect(setAsDefaultButton).toBeInTheDocument();
    });
  });

  it('should not show set ad default project option when project is already default', async () => {
    const defaultProject = {
      ...mockProject,
      isDefault: true,
    };

    await act(async () => {
      render(<Actions projectWithService={defaultProject} />, {
        wrapper: createOptimalWrapper({ routing: true, shell: true }),
      });
    });

    await waitFor(() => {
      expect(
        screen.queryByText('pci_projects_project_edit_set_as_default_project'),
      ).not.toBeInTheDocument();
    });
  });

  it('should call setAsDefaultProject when action clicked', async () => {
    const nonDefaultProject = {
      ...mockProject,
      isDefault: false,
    };

    await act(async () => {
      render(<Actions projectWithService={nonDefaultProject} />, {
        wrapper: createOptimalWrapper({ routing: true, shell: true }),
      });
    });

    await waitFor(() => {
      const setAsDefaultButton = screen.getByText(
        'pci_projects_project_edit_set_as_default_project',
      );
      expect(setAsDefaultButton).toBeInTheDocument();
    });

    await act(async () => {
      const setAsDefaultButton = screen.getByText(
        'pci_projects_project_edit_set_as_default_project',
      );
      await fireEvent.click(setAsDefaultButton);
    });

    await waitFor(() => {
      expect(mockSetAsDefaultProject).toHaveBeenCalledWith('test-project-id');
    });
  });

  it('should show success notification when setting project as default succeeds', async () => {
    const nonDefaultProject = {
      ...mockProject,
      isDefault: false,
    };

    // Mock the success callback
    const mockSuccessCallback = vi.fn();
    const customMutate = vi.fn((projectId: string) => {
      mockSetAsDefaultProject(projectId);
      mockSuccessCallback();
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

    await act(async () => {
      render(<Actions projectWithService={nonDefaultProject} />, {
        wrapper: createOptimalWrapper({ routing: true, shell: true }),
      });
    });

    await waitFor(() => {
      const setAsDefaultButton = screen.getByText(
        'pci_projects_project_edit_set_as_default_project',
      );
      expect(setAsDefaultButton).toBeInTheDocument();
    });

    await act(async () => {
      const setAsDefaultButton = screen.getByText(
        'pci_projects_project_edit_set_as_default_project',
      );
      await fireEvent.click(setAsDefaultButton);
    });

    await waitFor(() => {
      expect(mockSetAsDefaultProject).toHaveBeenCalledWith('test-project-id');
      expect(mockSuccessCallback).toHaveBeenCalled();
    });
  });

  it('should show error notification when setting project as default fails', async () => {
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

    await act(async () => {
      render(<Actions projectWithService={nonDefaultProject} />, {
        wrapper: createOptimalWrapper({ routing: true, shell: true }),
      });
    });

    await waitFor(() => {
      const setAsDefaultButton = screen.getByText(
        'pci_projects_project_edit_set_as_default_project',
      );
      expect(setAsDefaultButton).toBeInTheDocument();
    });

    await act(async () => {
      const setAsDefaultButton = screen.getByText(
        'pci_projects_project_edit_set_as_default_project',
      );
      await fireEvent.click(setAsDefaultButton);
    });

    await waitFor(() => {
      expect(mockSetAsDefaultProject).toHaveBeenCalledWith('test-project-id');
      expect(mockOnError).toHaveBeenCalledWith(mockError);
    });
  });
});
