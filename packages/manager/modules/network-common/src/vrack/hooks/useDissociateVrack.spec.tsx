import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosResponseHeaders, InternalAxiosRequestConfig } from 'axios';
import { vi } from 'vitest';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useTask } from '@ovh-ux/manager-react-components';

import { VrackServicesProductStatus, VrackServicesWithIAM } from '../../types';
import { useVrackService } from '../../vrack-services';
import { dissociateVrackServices } from '../api';
import { useDissociateVrack } from './useDissociateVrack';

vi.mock('../api', async () => {
  const actual = await vi.importActual<typeof import('../api')>('../api');
  return {
    ...actual,
    dissociateVrackServices: vi.fn(),
  };
});

vi.mock('../../vrack-services/hooks/useVrackServices', async () => {
  const actual = await vi.importActual<
    typeof import('../../vrack-services/hooks/useVrackServices')
  >('../../vrack-services/hooks/useVrackServices');
  return {
    ...actual,
    useVrackService: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-react-components', () => ({
  useTask: vi.fn(),
}));

const queryClient = new QueryClient();

type TestComponentProps = {
  vrackServicesId: string;
  onSuccess?: () => void;
  onError?: () => void;
};

const TestComponent: React.FC<TestComponentProps> = ({ vrackServicesId, onSuccess, onError }) => {
  const { dissociateVs, isPending, isError, error, isSuccess } = useDissociateVrack({
    vrackServicesId,
    onSuccess,
    onError,
  });

  const handleDissociate = () => {
    dissociateVs();
  };

  return (
    <div>
      <button onClick={handleDissociate}>Dissociate Vrack Service</button>
      {isPending && <p>Processing Dissociation...</p>}
      {isError && <p>Error: {error?.message}</p>}
      {isSuccess && <p>Dissociation Successful</p>}
    </div>
  );
};

describe('useDissociateVrack', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    queryClient.clear();

    vi.mocked(useVrackService).mockReturnValue({
      data: {
        currentState: {
          vrackId: 'vrack-id',
          displayName: '',
          productStatus: 'ACTIVE' as VrackServicesProductStatus,
          subnets: [],
          region: '',
        },
      } as unknown as VrackServicesWithIAM,
      error: null,
      isError: false,
      isPending: false,
      isLoading: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      status: 'success',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      refetch: vi.fn(),
      fetchStatus: 'fetching',
    });
  });

  it('should successfully dissociate a vrack service', async () => {
    vi.mocked(dissociateVrackServices).mockResolvedValue({
      data: {
        id: 1231,
        function: '',
        lastUpdate: null as unknown as Date,
        todoDate: null as unknown as Date,
        serviceName: 'vrack-service-id',
        status: '',
      },
      status: 0,
      statusText: '',
      headers: {} as AxiosResponseHeaders,
      config: {} as InternalAxiosRequestConfig,
    });
    vi.mocked(useTask).mockReturnValue({
      isPending: false,
      isError: false,
      isSuccess: true,
      error: null as unknown as ApiError,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent vrackServicesId="vrack-service-id" onSuccess={vi.fn()} onError={vi.fn()} />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Dissociate Vrack Service'));

    await waitFor(() => screen.getByText('Dissociation Successful'));

    expect(dissociateVrackServices).toHaveBeenCalledWith({
      vrack: 'vrack-id',
      vrackServices: 'vrack-service-id',
    });
    expect(screen.getByText('Dissociation Successful')).toBeInTheDocument();
  });

  it('should handle error during dissociation', async () => {
    const mockError = new Error('Failed to dissociate') as ApiError;
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();

    vi.mocked(dissociateVrackServices).mockRejectedValue(mockError);
    vi.mocked(useTask).mockReturnValue({
      isPending: false,
      isError: true,
      isSuccess: false,
      error: mockError,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent vrackServicesId="vrack-id" onSuccess={mockOnSuccess} onError={mockOnError} />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Dissociate Vrack Service'));

    await waitFor(() => screen.getByText(`Error: ${mockError.message}`));

    expect(mockOnError).toHaveBeenCalled();
    expect(screen.getByText(`Error: ${mockError.message}`)).toBeInTheDocument();
  });

  it('should show loading state while dissociating', async () => {
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();

    vi.mocked(dissociateVrackServices).mockResolvedValue({
      data: {
        id: 1231,
        function: '',
        lastUpdate: null as unknown as Date,
        todoDate: null as unknown as Date,
        serviceName: '',
        status: '',
      },
      status: 0,
      statusText: '',
      headers: {} as AxiosResponseHeaders,
      config: {} as InternalAxiosRequestConfig,
    });
    vi.mocked(useTask).mockReturnValue({
      isPending: true,
      isError: false,
      isSuccess: false,
      error: null as unknown as ApiError,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent vrackServicesId="vrack-id" onSuccess={mockOnSuccess} onError={mockOnError} />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Dissociate Vrack Service'));
    await waitFor(() => screen.getByText('Processing Dissociation...'));
    expect(screen.getByText('Processing Dissociation...')).toBeInTheDocument();
  });
});
