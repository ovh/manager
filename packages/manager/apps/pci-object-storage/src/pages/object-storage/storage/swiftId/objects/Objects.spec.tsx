import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SwiftObjectsPage from './Objects.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedContainerDetail } from '@/__tests__/helpers/mocks/swift/swift';
import { useSwiftData } from '../Swift.context';
import { mockedUser } from '@/__tests__/helpers/mocks/user';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useParams: () => ({
      projectId: 'projectId',
      swiftId: 'test-swift-id',
    }),
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../Swift.context');

vi.mock('@/hooks/useUser', () => ({
  useUser: () => mockedUser,
}));

describe('SwiftObjectsPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const createSwiftDataMock = (overrides = {}) => ({
    swift: mockedContainerDetail,
    swiftQuery: {
      isLoading: false,
      isFetching: false,
      data: mockedContainerDetail,
      refetch: vi.fn(),
    },
    ...overrides,
  });

  it('should show skeleton when loading', () => {
    vi.mocked(useSwiftData).mockReturnValue(
      createSwiftDataMock({
        swift: null,
        swiftQuery: {
          isLoading: true,
          isFetching: false,
          data: null,
          refetch: vi.fn(),
        },
      }),
    );

    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.queryByText('objectTitle')).not.toBeInTheDocument();
  });

  it('should show content when loaded', () => {
    vi.mocked(useSwiftData).mockReturnValue(createSwiftDataMock());

    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.getByText('objectTitle')).toBeInTheDocument();
    expect(screen.getByText('addNewObject')).toBeInTheDocument();
  });

  it('should navigate to add-object route when clicking add button', () => {
    vi.mocked(useSwiftData).mockReturnValue(createSwiftDataMock());

    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    fireEvent.click(screen.getByText('addNewObject'));

    expect(mockNavigate).toHaveBeenCalledWith('./add-object');
  });

  it('should handle undefined objects gracefully', () => {
    const swiftWithNoObjects = { ...mockedContainerDetail, objects: undefined };
    vi.mocked(useSwiftData).mockReturnValue(
      createSwiftDataMock({
        swift: swiftWithNoObjects,
        swiftQuery: {
          isLoading: false,
          isFetching: false,
          data: swiftWithNoObjects,
          refetch: vi.fn(),
        },
      }),
    );

    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.getByText('objectTitle')).toBeInTheDocument();
  });
});
