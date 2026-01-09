import React from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { mockUseDataApi } from '@/utils/test.setup';

import Multisite from '../Task.page';

vi.mock('@/hooks/task/useDatagridColumn', () => ({
  default: vi.fn().mockReturnValue([
    {
      id: 'id',
      accessorKey: 'id',
      header: 'ID',
    },
  ]),
}));

describe('Task page', () => {
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
    });
  });

  it('should render correctly', () => {
    const { container } = render(<Multisite />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should display refresh button', () => {
    render(<Multisite />, { wrapper });

    const refreshButton = screen.getByRole('button');
    expect(refreshButton).toBeInTheDocument();
  });
});
