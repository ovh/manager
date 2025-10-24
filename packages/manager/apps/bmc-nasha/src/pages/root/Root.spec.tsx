import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RootPage from './Root.page';

// Mock the API hook
vi.mock('@/data/api/hooks/useNashaServices', () => ({
  useNashaServicesCheck: vi.fn(),
}));

// Mock MUK components
vi.mock('@ovh-ux/muk', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { useNashaServicesCheck } from '@/data/api/hooks/useNashaServices';

const mockUseNashaServicesCheck = useNashaServicesCheck as any;

describe('RootPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show spinner while loading', () => {
    mockUseNashaServicesCheck.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <RootPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should navigate to listing when services exist', async () => {
    mockUseNashaServicesCheck.mockReturnValue({
      data: { hasServices: true, totalCount: 5 },
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <RootPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('listing', { replace: true });
    });
  });

  it('should navigate to onboarding when no services exist', async () => {
    mockUseNashaServicesCheck.mockReturnValue({
      data: { hasServices: false, totalCount: 0 },
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <RootPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('onboarding', { replace: true });
    });
  });

  it('should show error message when API fails', () => {
    mockUseNashaServicesCheck.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('API Error'),
    });

    render(
      <MemoryRouter>
        <RootPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Error loading Nasha services')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should not navigate while still loading', () => {
    mockUseNashaServicesCheck.mockReturnValue({
      data: { hasServices: true },
      isLoading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <RootPage />
      </MemoryRouter>
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
