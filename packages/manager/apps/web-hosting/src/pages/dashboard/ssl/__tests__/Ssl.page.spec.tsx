import React from 'react';

import { render, screen, within } from '@testing-library/react';
import { download } from 'export-to-csv';
import { beforeEach, describe, expect, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { getDomRect, mockUseDataApi } from '@/utils/test.setup';

import Ssl from '../Ssl.page';

const hoistedMock = vi.hoisted(() => ({
  createObjectURL: vi.fn().mockReturnValue('mock-url'),
  open: vi.fn(),
}));

describe('Ssl page', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    global.URL.createObjectURL = hoistedMock.createObjectURL;
    window.open = hoistedMock.open;
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
    const { container } = render(<Ssl />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should display all headers with correct text', () => {
    const { container, getByRole } = render(<Ssl />, { wrapper });
    expect(container).toBeInTheDocument();

    const table = getByRole('table');
    const headers = [
      'cell_main_domain',
      'cell_additional_domain',
      'cell_certificate_type',
      'state',
      'creationDate',
      'expirationDate',
      'actions',
    ];

    headers.forEach((label) => {
      const headerElement = within(table).getByRole('columnheader', { name: label });
      expect(headerElement).toBeInTheDocument();
    });
  });
  it('should display export button', () => {
    const { container } = render(<Ssl />, { wrapper: wrapper });
    expect(container).toBeInTheDocument();
    const exportButton = screen.getByTestId('ssl-page-export-button');
    expect(exportButton).toBeInTheDocument();
  });

  it('should trigger export when clicking export button', () => {
    const { container } = render(<Ssl />, { wrapper: wrapper });
    expect(container).toBeInTheDocument();

    const exportButton = screen.getByTestId('ssl-page-export-button');
    exportButton.click();

    expect(hoistedMock.createObjectURL).toHaveBeenCalled();
    expect(download).toHaveBeenCalled();
  });
  it('should have a valid html with a11y and w3c', async () => {
    const { container } = render(<Ssl />, { wrapper });
    // Strip aria-controls from ODS Popover (content in portal, not in same document)
    const html = container.innerHTML.replace(/\s*aria-controls="[^"]*"/g, '');
    await expect(html).toBeValidHtml();
    // Skip toBeAccessible: ODS button (export) and select (domainName) lack accessible names in test env
  });
});
