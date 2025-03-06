import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTask } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useDissociateVrack } from './useDissociateVrack';
import { dissociateVrackServices } from '../index';

vi.mock('../index', () => ({
  dissociateVrackServices: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useTask: vi.fn(),
}));

const queryClient = new QueryClient();

const TestComponent = ({ vrackServicesId, onSuccess, onError }: any) => {
  const {
    dissociateVs,
    isPending,
    isError,
    error,
    isSuccess,
  } = useDissociateVrack({
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
  it('should successfully dissociate a vrack service', async () => {
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();

    vi.mocked(dissociateVrackServices).mockResolvedValue({
      data: {
        id: 1231,
        function: '',
        lastUpdate: undefined,
        serviceName: '',
        status: '',
        todoDate: undefined,
      },
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    });
    vi.mocked(useTask).mockReturnValue({
      isPending: false,
      isError: false,
      isSuccess: true,
      error: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent
          vrackServicesId="vrack-id"
          onSuccess={mockOnSuccess}
          onError={mockOnError}
        />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Dissociate Vrack Service'));

    await waitFor(() => screen.getByText('Dissociation Successful'));

    expect(dissociateVrackServices).toHaveBeenCalledWith({
      vrack: 'vrack-id',
      vrackServices: 'vrack-id',
    });
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(screen.getByText('Dissociation Successful')).toBeInTheDocument();
  });

  it('should handle error during dissociation', async () => {
    const mockError = new Error('Failed to dissociate');
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();

    vi.mocked(dissociateVrackServices).mockRejectedValue(mockError);
    vi.mocked(useTask).mockReturnValue({
      isPending: false,
      isError: true,
      isSuccess: false,
      error: mockError as ApiError,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent
          vrackServicesId="vrack-id"
          onSuccess={mockOnSuccess}
          onError={mockOnError}
        />
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
        lastUpdate: undefined,
        serviceName: '',
        status: '',
        todoDate: undefined,
      },
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    });
    vi.mocked(useTask).mockReturnValue({
      isPending: true,
      isError: false,
      isSuccess: false,
      error: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent
          vrackServicesId="vrack-id"
          onSuccess={mockOnSuccess}
          onError={mockOnError}
        />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Dissociate Vrack Service'));

    expect(screen.getByText('Processing Dissociation...')).toBeInTheDocument();
  });
});
