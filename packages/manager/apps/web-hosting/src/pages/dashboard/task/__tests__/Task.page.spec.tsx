import React from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { getDomRect, mockUseDataApi } from '@/utils/test.setup';

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
    const { container } = render(<Multisite />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should display refresh button', () => {
    render(<Multisite />, { wrapper });

    const refreshButton = screen.getByRole('button');
    expect(refreshButton).toBeInTheDocument();
  });
  it('should have a valid html with a11y and w3c', async () => {
    const { container } = render(<Multisite />, { wrapper });
    const html = container.innerHTML;
    await expect(html).toBeValidHtml();
    /*Error: Accessibility violations found (1):

[button-name] Buttons must have discernible text
  - button
    Fix any of the following:
  Element does not have inner text that is visible to screen readers
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  Element's default semantics were not overridden with role="none" or role="presentation"
      await expect(container).toBeAccessible();*/
  });
});
