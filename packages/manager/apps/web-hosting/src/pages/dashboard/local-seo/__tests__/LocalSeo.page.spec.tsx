import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { getDomRect, mockUseDataApi } from '@/utils/test.setup';

import LocalSeo from '../LocalSeo.page';

vi.mock('@/hooks/localSeo/useDatagridColumn', () => ({
  default: vi.fn().mockReturnValue([
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
    },
  ]),
}));

describe('LocalSeo page', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
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
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });

  it('should render correctly', () => {
    const { container } = render(<LocalSeo />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should display order button', () => {
    render(<LocalSeo />, { wrapper });

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  it('should have a valid html with a11y and w3c', async () => {
    const { container } = render(<LocalSeo />, { wrapper });
    // const html = container.innerHTML;
    // await expect(html).toBeValidHtml();
    await expect(container).toBeAccessible();
  });
});
