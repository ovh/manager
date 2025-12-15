import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import SwiftLayout from './Swift.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedContainerDetail } from '@/__tests__/helpers/mocks/swift/swift';
import { useGetSwift } from '@/data/hooks/swift-storage/useGetSwift.hook';

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useParams: () => ({
      projectId: 'projectId',
      swiftId: 'test-swift-id',
    }),
    Outlet: () => <div data-testid="outlet">Outlet</div>,
  };
});

vi.mock('@/data/hooks/swift-storage/useGetSwift.hook');

describe('SwiftLayout', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not render content when data is loading', async () => {
    vi.mocked(useGetSwift).mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
    });

    render(<SwiftLayout />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
    });
  });

  it('should render container name when data is loaded', async () => {
    vi.mocked(useGetSwift).mockReturnValue({
      data: mockedContainerDetail,
      isLoading: false,
      isSuccess: true,
      isError: false,
    });

    render(<SwiftLayout />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByText(mockedContainerDetail.name)).toBeInTheDocument();
    });
  });

  it('should render outlet (child routes) when data is loaded', async () => {
    vi.mocked(useGetSwift).mockReturnValue({
      data: mockedContainerDetail,
      isLoading: false,
      isSuccess: true,
      isError: false,
    });

    render(<SwiftLayout />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });
  });
});
