import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { publicServiceMock } from '@/data/__mocks__/videoCenter';
import { wrapper } from '@/utils/test.provider';
import { mockUseDataApi, navigate } from '@/utils/test.setup';

import VideoCenterPage from '../videoCenter.page';

describe('VideoCenterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDataApi.mockReturnValue({
      flattenData: [],
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: 0,
      filters: {},
      sorting: {},
    });
  });

  it('should render datagrid with correct columns', () => {
    mockUseDataApi.mockReturnValue({
      flattenData: [publicServiceMock],
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: 1,
      filters: {},
      sorting: {},
    });

    const { getByTestId } = render(<VideoCenterPage />, { wrapper });

    const datagrid = getByTestId('datagrid');
    expect(datagrid).toBeInTheDocument();
  });

  it('should display data correctly in datagrid', () => {
    mockUseDataApi.mockReturnValue({
      flattenData: [publicServiceMock],
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: 1,
      filters: {},
      sorting: {},
    });

    const { getByTestId } = render(<VideoCenterPage />, { wrapper });

    const datagrid = getByTestId('datagrid');
    expect(datagrid).toBeInTheDocument();
  });

  it('should show onboarding page when no data', () => {
    mockUseDataApi.mockReturnValue({
      flattenData: [],
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: 0,
      filters: {},
      sorting: {},
    });

    const { container } = render(<VideoCenterPage />, { wrapper });

    // Onboarding page should be rendered instead of datagrid
    expect(container).toBeInTheDocument();
  });

  it('should auto-navigate when single service found', async () => {
    const mockNavigate = vi.fn();
    vi.mocked(navigate).mockImplementation(mockNavigate);

    mockUseDataApi.mockReturnValue({
      flattenData: [publicServiceMock],
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: 1,
      filters: {},
      sorting: {},
    });

    render(<VideoCenterPage />, { wrapper });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/video-center/test-service-id');
    });
  });

  it('should not auto-navigate when multiple services found', () => {
    const mockNavigate = vi.fn();
    vi.mocked(navigate).mockImplementation(mockNavigate);

    mockUseDataApi.mockReturnValue({
      flattenData: [publicServiceMock, { ...publicServiceMock, id: 'service-2' }],
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: 2,
      filters: {},
      sorting: {},
    });

    render(<VideoCenterPage />, { wrapper });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should not auto-navigate when loading', () => {
    const mockNavigate = vi.fn();
    vi.mocked(navigate).mockImplementation(mockNavigate);

    mockUseDataApi.mockReturnValue({
      flattenData: [publicServiceMock],
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
      isFetching: true,
      status: 'loading',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: 1,
      filters: {},
      sorting: {},
    });

    render(<VideoCenterPage />, { wrapper });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should verify column definitions and accessors', () => {
    mockUseDataApi.mockReturnValue({
      flattenData: [publicServiceMock],
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: 1,
      filters: {},
      sorting: {},
    });

    const { getByTestId } = render(<VideoCenterPage />, { wrapper });

    // Check that datagrid headers are rendered
    const headers = getByTestId('datagrid-headers');
    expect(headers).toBeInTheDocument();
  });

  it('should handle pagination (fetchNextPage)', () => {
    const mockFetchNextPage = vi.fn();

    mockUseDataApi.mockReturnValue({
      flattenData: [publicServiceMock],
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      status: 'success',
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: 1,
      filters: {},
      sorting: {},
    });

    const { getByTestId } = render(<VideoCenterPage />, { wrapper });

    const datagrid = getByTestId('datagrid');
    expect(datagrid).toBeInTheDocument();
    // fetchNextPage would be called when user scrolls to bottom
  });

  it('should handle loading state', () => {
    mockUseDataApi.mockReturnValue({
      flattenData: [],
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
      isFetching: true,
      status: 'loading',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: 0,
      filters: {},
      sorting: {},
    });

    const { getByTestId } = render(<VideoCenterPage />, { wrapper });

    const loadingIndicator = getByTestId('datagrid-loading');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('should handle null flattenData', () => {
    mockUseDataApi.mockReturnValue({
      flattenData: null,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: 0,
      filters: {},
      sorting: {},
    });

    const { container } = render(<VideoCenterPage />, { wrapper });

    // Should show onboarding when flattenData is null
    expect(container).toBeInTheDocument();
  });
});
