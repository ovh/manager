import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTask } from '@ovh-ux/manager-react-components';
import { useAssociateVrack } from './useAssociateVrack';
import { Status, associateVrackServices } from '../index';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useTask: vi.fn(),
}));

vi.mock('../index', () => ({
  associateVrackServices: vi.fn(),
}));

const queryClient = new QueryClient();

const TestComponent = ({ vrackServicesId }: { vrackServicesId: string }) => {
  const {
    associateVs,
    isPending,
    isError,
    error,
    isSuccess,
  } = useAssociateVrack({
    vrackServicesId,
  });

  return (
    <div>
      <button onClick={() => associateVs({ vrackId: 'test-vrack-id' })}>
        Associate
      </button>
      {isPending && <p>Loading...</p>}
      {isError && <p>Error: {error?.message}</p>}
      {isSuccess && <p>Success!</p>}
    </div>
  );
};

describe('useAssociateVrack', () => {
  it('should successfully associate vrack services and complete the task', async () => {
    const mockUseTask = vi.fn().mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      isSuccess: true,
    });

    vi.mocked(associateVrackServices).mockResolvedValue({
      data: {
        id: 'task-id',
        createdAt: '',
        link: '',
        progress: [],
        status: 'DONE' as Status,
        type: '',
      },
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    });
    vi.mocked(useTask).mockImplementation(mockUseTask);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent vrackServicesId="test-vrack-services-id" />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Associate'));

    await waitFor(() => screen.getByText('Success!'));

    expect(associateVrackServices).toHaveBeenCalledWith({
      vrack: 'test-vrack-id',
      vrackServices: 'test-vrack-services-id',
    });
    expect(mockUseTask).toHaveBeenCalledWith({
      resourceUrl: '/vrack/test-vrack-id',
      apiVersion: 'v6',
      taskId: undefined,
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
      onFinish: expect.any(Function),
    });
  });

  it('should handle error during association', async () => {
    const mockError = new Error('Failed to associate vRack services');
    const mockUseTask = vi.fn().mockReturnValue({
      isPending: false,
      isError: true,
      error: mockError,
      isSuccess: false,
    });

    vi.mocked(associateVrackServices).mockRejectedValue(mockError);
    vi.mocked(useTask).mockImplementation(mockUseTask);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent vrackServicesId="test-vrack-services-id" />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Associate'));

    await waitFor(() => screen.getByText(`Error: ${mockError.message}`));

    expect(associateVrackServices).toHaveBeenCalledWith({
      vrack: 'test-vrack-id',
      vrackServices: 'test-vrack-services-id',
    });
    expect(mockUseTask).toHaveBeenCalledWith({
      resourceUrl: '/vrack/test-vrack-id',
      apiVersion: 'v6',
      taskId: undefined,
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
      onFinish: expect.any(Function),
    });
  });

  it('should show loading state while the mutation or task is in progress', async () => {
    const mockUseTask = vi.fn().mockReturnValue({
      isPending: true,
      isError: false,
      error: null,
      isSuccess: false,
    });

    vi.mocked(associateVrackServices).mockResolvedValue({
      data: {
        id: 'task-id',
        createdAt: '',
        link: '',
        progress: [],
        status: 'DONE' as Status,
        type: '',
      },
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    });
    vi.mocked(useTask).mockImplementation(mockUseTask);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent vrackServicesId="test-vrack-services-id" />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Associate'));

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    expect(associateVrackServices).toHaveBeenCalledWith({
      vrack: 'test-vrack-id',
      vrackServices: 'test-vrack-services-id',
    });
  });

  it('should not trigger mutation if vrackServicesId is not provided', async () => {
    const mockUseTask = vi.fn().mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      isSuccess: false,
    });

    vi.mocked(associateVrackServices).mockResolvedValue({
      data: {
        id: 'task-id',
        createdAt: '',
        link: '',
        progress: [],
        status: 'DONE' as Status,
        type: '',
      },
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    });
    vi.mocked(useTask).mockImplementation(mockUseTask);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent vrackServicesId="" />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Associate'));

    await waitFor(() => {
      expect(associateVrackServices).not.toHaveBeenCalled();
    });
  });
});
