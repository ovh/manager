import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import SwiftLayout from './Swift.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedSwift } from '@/__tests__/helpers/mocks/swift';

Element.prototype.scrollIntoView = vi.fn();

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual<typeof reactRouterDom>('react-router-dom');
  return {
    ...mod,
    useParams: vi.fn(),
    Outlet: () => <div data-testid="outlet">Outlet</div>,
  };
});

vi.mock('@/contexts/UserActivityContext', () => ({
  useUserActivityContext: () => ({ isUserActive: true }),
}));

const mockUseGetSwift = vi.fn();

vi.mock('@/data/hooks/swift-storage/useGetSwift.hook', () => ({
  useGetSwift: () => mockUseGetSwift(),
}));

vi.mock('@/hooks/useUser', () => ({
  useUser: () => ({ ovhSubsidiary: 'FR' }),
}));

vi.mock('@/types/Storages', () => ({
  default: {},
  ObjectStorageTypeEnum: { swift: 'swift', s3: 's3' },
}));

describe('SwiftLayout', () => {
  beforeEach(() => {
    vi.mocked(reactRouterDom.useParams).mockReturnValue({
      projectId: 'test-project-id',
      swiftId: 'test-swift-id',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not render content when data is loading', async () => {
    mockUseGetSwift.mockReturnValue({
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
    mockUseGetSwift.mockReturnValue({
      data: mockedSwift,
      isLoading: false,
      isSuccess: true,
      isError: false,
    });

    render(<SwiftLayout />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByText('test-container')).toBeInTheDocument();
    });
  });

  it('should render outlet (child routes) when data is loaded', async () => {
    mockUseGetSwift.mockReturnValue({
      data: mockedSwift,
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
