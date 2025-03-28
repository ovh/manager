import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import ToggleAcl from './ToggleAcl.component';
import { useServiceData } from '../../Service.context';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import * as database from '@/types/cloud/project/database';

import * as serviceApi from '@/data/api/database/service.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { CdbError } from '@/data/api/database';

// Mock the necessary hooks and components using the correct syntax
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    projectId: 'projectId',
    service: {
      ...mockedService,
      engine: 'opensearch',
      aclsEnabled: true,
    },
    category: 'operational',
    serviceQuery: {} as UseQueryResult<database.Service, Error>,
  })),
}));

vi.mock('@/data/api/database/service.api', () => ({
  editService: vi.fn(() => ({
    ...mockedService,
    engine: 'opensearch',
    aclsEnabled: true,
  })),
}));

vi.mock('@datatr-ux/uxlib', async () => {
  const mod = await vi.importActual('@datatr-ux/uxlib');
  const toastMock = vi.fn();
  return {
    ...mod,
    Switch: ({
      checked,
      disabled,
      onCheckedChange,
    }: {
      checked: boolean;
      disabled: boolean;
      onCheckedChange: (val: boolean) => void;
    }) => (
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
    ),
    useToast: vi.fn(() => ({
      toast: toastMock,
    })),
  };
});

describe('ToggleAcl Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with ACLs disabled', () => {
    vi.mocked(useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      category: 'analytics',
      service: ({
        ...mockedService,
        engine: 'opensearch',
        aclsEnabled: false,
      } as unknown) as database.Service,
      serviceQuery: ({ refetch: vi.fn() } as unknown) as UseQueryResult<
        database.Service,
        CdbError
      >,
    });

    render(<ToggleAcl />, { wrapper: RouterWithQueryClientWrapper });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render correctly with ACLs enabled', () => {
    vi.mocked(useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      category: 'analytics',
      service: ({
        ...mockedService,
        engine: 'opensearch',
        aclsEnabled: true,
      } as unknown) as database.Service,
      serviceQuery: ({ refetch: vi.fn() } as unknown) as UseQueryResult<
        database.Service,
        CdbError
      >,
    });

    render(<ToggleAcl />, { wrapper: RouterWithQueryClientWrapper });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call editService with the correct parameters when the switch is toggled', async () => {
    vi.mocked(useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      category: 'analytics',
      service: ({
        ...mockedService,
        engine: 'opensearch',
        aclsEnabled: true,
      } as unknown) as database.Service,
      serviceQuery: ({ refetch: vi.fn() } as unknown) as UseQueryResult<
        database.Service,
        CdbError
      >,
    });
    render(<ToggleAcl />, { wrapper: RouterWithQueryClientWrapper });
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(serviceApi.editService).toHaveBeenCalledWith({
        serviceId: mockedService.id,
        projectId: 'projectId',
        engine: 'opensearch',
        data: {
          aclsEnabled: false,
        },
      });
    });
  });

  it('should show a toast and reset the switch state on error', async () => {
    vi.mocked(useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      category: 'analytics',
      service: ({
        ...mockedService,
        engine: 'opensearch',
        aclsEnabled: true,
      } as unknown) as database.Service,
      serviceQuery: ({ refetch: vi.fn() } as unknown) as UseQueryResult<
        database.Service,
        CdbError
      >,
    });
    const mockError = { response: { data: { message: 'Error Message' } } };
    vi.mocked(serviceApi.editService).mockImplementationOnce(() => {
      throw mockError;
    });

    render(<ToggleAcl />, { wrapper: RouterWithQueryClientWrapper });
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
      expect(serviceApi.editService).toHaveBeenCalledWith({
        data: {
          aclsEnabled: false,
        },
        engine: 'opensearch',
        projectId: 'projectId',
        serviceId: 'serviceId',
      });
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'toggleAclErrorTitle',
        variant: 'destructive',
        description: 'Error Message',
      });
    });
  });

  it('should show a success toast and refetch service data on success', async () => {
    const mockRefetch = vi.fn();
    vi.mocked(useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      category: 'analytics',
      service: ({
        ...mockedService,
        engine: 'opensearch',
        aclsEnabled: true,
      } as unknown) as database.Service,
      serviceQuery: ({ refetch: mockRefetch } as unknown) as UseQueryResult<
        database.Service,
        CdbError
      >,
    });

    render(<ToggleAcl />, { wrapper: RouterWithQueryClientWrapper });
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox).not.toBeChecked();
      expect(serviceApi.editService).toHaveBeenCalledWith({
        data: {
          aclsEnabled: false,
        },
        engine: 'opensearch',
        projectId: 'projectId',
        serviceId: 'serviceId',
      });
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'toggleAclSuccessTitle',
        description: 'toggleAclEnabledSuccessDescription',
      });
    });
  });
});
