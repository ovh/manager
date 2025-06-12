import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { useResourcesV6 } from '@ovh-ux/manager-react-components';
import Listing from './Listing';
import queryClient from '@/queryClient';

vi.mock('./datagrid-columns', () => ({
  getDatagridColumns: () => [
    { id: 'name', label: 'Name' },
    { id: 'status', label: 'Status' },
  ],
}));

vi.mock('@/data/api/projects-with-services', () => ({
  getProjectsWithServices: vi.fn(),
  projectsWithServiceQueryKey: () => ['projects-with-services'],
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('listing page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading spinner while main request are loading', () => {
    vi.mocked(useResourcesV6).mockReturnValue(({
      flattenData: undefined,
      isError: false,
      totalCount: 0,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: true,
      setSorting: vi.fn(),
    } as unknown) as ReturnType<typeof useResourcesV6>);

    render(<Listing />, { wrapper });

    expect(screen.getByTestId('listing-spinner-container')).toBeInTheDocument();
    expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
  });

  it('displays error banner when there is an error', () => {
    const errorMock = {
      message: 'Test error',
      response: { status: 500, headers: {} },
      name: 'error',
    };

    vi.mocked(useResourcesV6).mockReturnValue(({
      flattenData: undefined,
      isError: true,
      error: errorMock,
      totalCount: 0,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      setSorting: vi.fn(),
    } as unknown) as ReturnType<typeof useResourcesV6>);

    render(<Listing />, { wrapper });

    expect(screen.getByTestId('error-banner')).toBeInTheDocument();
  });

  it('displays datagrid when data is loaded', () => {
    vi.mocked(useResourcesV6).mockReturnValue(({
      flattenData: [{ id: '1', name: 'Test Project' }],
      isError: false,
      totalCount: 1,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      setSorting: vi.fn(),
    } as unknown) as ReturnType<typeof useResourcesV6>);

    render(<Listing />, { wrapper });

    expect(screen.getByTestId('base-layout')).toBeInTheDocument();
    expect(screen.getByTestId('datagrid')).toBeInTheDocument();
  });
});
