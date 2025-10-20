/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as useNashaServices from '@/data/api/hooks/useNashaServices';
import { createTestWrapper } from '@/utils/Test.utils';
import { QueryClient } from '@tanstack/react-query';

import ListingPage from './Listing.page';

// Mock the hooks
vi.mock('@/data/api/hooks/useNashaServices', () => ({
  useNashaServices: vi.fn(),
}));

// Mock the components
vi.mock('@/components/NashaServiceCard/NashaServiceCard', () => ({
  default: ({ service, onViewDetails, onDelete }: any) => (
    <div data-testid={`service-card-${service.serviceName}`}>
      <span>{service.serviceName}</span>
      <button onClick={() => onViewDetails(service.serviceName)}>View Details</button>
      <button onClick={() => onDelete(service.serviceName)}>Delete</button>
    </div>
  ),
}));

vi.mock('@/components/NashaCreateModal/NashaCreateModal', () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="create-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}));

vi.mock('@/components/NashaDeleteModal/NashaDeleteModal', () => ({
  default: ({ isOpen, serviceName, onClose }: any) =>
    isOpen ? (
      <div data-testid="delete-modal">
        <span>Delete {serviceName}</span>
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}));

// Mock useDatagrid
vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    useDataGrid: () => ({
      pagination: { pageIndex: 0, pageSize: 12 },
      sorting: { id: 'serviceName', desc: false },
      onPaginationChange: vi.fn(),
      onSortChange: vi.fn(),
    }),
  };
});

describe('ListingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(useNashaServices.useNashaServices).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    } as any);

    render(<ListingPage />, {
      wrapper: createTestWrapper(new QueryClient()),
    });

    expect(screen.getByText('Loading routes ...')).toBeInTheDocument();
  });

  it('renders services list when data is available', async () => {
    const mockServices = [
      {
        serviceName: 'nasha-test-001',
        status: 'active',
        datacenter: 'GRA11',
        protocol: 'NFS',
        size: 100,
        used: 25,
      },
      {
        serviceName: 'nasha-test-002',
        status: 'active',
        datacenter: 'GRA11',
        protocol: 'CIFS',
        size: 200,
        used: 50,
      },
    ];

    vi.mocked(useNashaServices.useNashaServices).mockReturnValue({
      data: {
        data: mockServices,
        totalCount: 2,
        status: 'success',
      },
      isLoading: false,
      error: undefined,
    } as any);

    render(<ListingPage />, {
      wrapper: createTestWrapper(new QueryClient()),
    });

    await waitFor(() => {
      expect(screen.getByText('Services NAS-HA')).toBeInTheDocument();
    });

    expect(screen.getByTestId('service-card-nasha-test-001')).toBeInTheDocument();
    expect(screen.getByTestId('service-card-nasha-test-002')).toBeInTheDocument();
  });

  it('renders empty state when no services', async () => {
    vi.mocked(useNashaServices.useNashaServices).mockReturnValue({
      data: {
        data: [],
        totalCount: 0,
        status: 'success',
      },
      isLoading: false,
      error: undefined,
    } as any);

    render(<ListingPage />, {
      wrapper: createTestWrapper(new QueryClient()),
    });

    await waitFor(() => {
      expect(screen.getByText('Aucun service NAS-HA')).toBeInTheDocument();
    });

    expect(
      screen.getByText("Vous n'avez pas encore de service NAS-HA. Créez-en un pour commencer."),
    ).toBeInTheDocument();
  });

  it('renders error state when API fails', async () => {
    vi.mocked(useNashaServices.useNashaServices).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: 'API Error',
    } as any);

    render(<ListingPage />, {
      wrapper: createTestWrapper(new QueryClient()),
    });

    await waitFor(() => {
      expect(screen.getByText('Erreur lors du chargement des services')).toBeInTheDocument();
    });

    expect(screen.getByText('API Error')).toBeInTheDocument();
  });

  it('opens create modal when create button is clicked', async () => {
    vi.mocked(useNashaServices.useNashaServices).mockReturnValue({
      data: {
        data: [],
        totalCount: 0,
        status: 'success',
      },
      isLoading: false,
      error: undefined,
    } as any);

    render(<ListingPage />, {
      wrapper: createTestWrapper(new QueryClient()),
    });

    await waitFor(() => {
      expect(screen.getByText('Créer un service')).toBeInTheDocument();
    });

    const createButton = screen.getByTestId('create-nasha-service');
    fireEvent.click(createButton);

    expect(screen.getByTestId('create-modal')).toBeInTheDocument();
  });

  it('opens delete modal when delete button is clicked', async () => {
    const mockServices = [
      {
        serviceName: 'nasha-test-001',
        status: 'active',
        datacenter: 'GRA11',
        protocol: 'NFS',
        size: 100,
        used: 25,
      },
    ];

    vi.mocked(useNashaServices.useNashaServices).mockReturnValue({
      data: {
        data: mockServices,
        totalCount: 1,
        status: 'success',
      },
      isLoading: false,
      error: undefined,
    } as any);

    render(<ListingPage />, {
      wrapper: createTestWrapper(new QueryClient()),
    });

    await waitFor(() => {
      expect(screen.getByTestId('service-card-nasha-test-001')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    expect(screen.getByText('Delete nasha-test-001')).toBeInTheDocument();
  });
});
