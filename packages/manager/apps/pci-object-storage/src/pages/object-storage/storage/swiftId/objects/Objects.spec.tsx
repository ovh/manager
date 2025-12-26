import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SwiftObjectsPage from './Objects.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedSwift } from '@/__tests__/helpers/mocks/swift';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useNavigate: () => mockNavigate,
  };
});

const mockSwiftQuery = vi.fn();

vi.mock('../Swift.context', () => ({
  useSwiftData: () => mockSwiftQuery(),
}));

vi.mock('@/hooks/useUser', () => ({
  useUser: () => ({ ovhSubsidiary: 'FR' }),
}));

describe('SwiftObjectsPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show skeleton when loading', () => {
    mockSwiftQuery.mockReturnValue({
      swiftQuery: { isLoading: true, data: null },
    });

    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.queryByText('objectTitle')).not.toBeInTheDocument();
  });

  it('should show content when loaded', () => {
    mockSwiftQuery.mockReturnValue({
      swiftQuery: { isLoading: false, data: mockedSwift },
    });

    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.getByText('objectTitle')).toBeInTheDocument();
    expect(screen.getByText('addNewObject')).toBeInTheDocument();
  });

  it('should navigate to add-object route when clicking add button', () => {
    mockSwiftQuery.mockReturnValue({
      swiftQuery: { isLoading: false, data: mockedSwift },
    });

    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    fireEvent.click(screen.getByText('addNewObject'));

    expect(mockNavigate).toHaveBeenCalledWith('./add-object');
  });

  it('should handle undefined objects gracefully', () => {
    mockSwiftQuery.mockReturnValue({
      swiftQuery: {
        isLoading: false,
        data: { ...mockedSwift, objects: undefined },
      },
    });

    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.getByText('objectTitle')).toBeInTheDocument();
  });
});
