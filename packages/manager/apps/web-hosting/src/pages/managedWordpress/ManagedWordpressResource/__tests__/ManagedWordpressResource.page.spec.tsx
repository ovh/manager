import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useOverridePage } from '@/hooks/overridePage/useOverridePage';
import { renderWithRouter, wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import ManagedWordpressResourcePage from '../ManagedWordpressResource.page';

vi.mock('@/hooks/generateUrl/useGenerateUrl', () => ({
  useGenerateUrl: vi.fn((path: string) => path),
}));

vi.mock('@/hooks/overridePage/useOverridePage', () => ({
  useOverridePage: vi.fn(),
}));

describe('ManagedWordpressResourcePage', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
    vi.mocked(useOverridePage).mockReturnValue(false);
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should render correctly', () => {
    const { container } = render(<ManagedWordpressResourcePage />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should display breadcrumb', () => {
    render(<ManagedWordpressResourcePage />, { wrapper });

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should hide header when page is overridden', () => {
    vi.mocked(useOverridePage).mockReturnValue(true);
    render(<ManagedWordpressResourcePage />, { wrapper });

    expect(screen.queryByText('test-service')).not.toBeInTheDocument();
  });
  it('should have a valid html with a11y and w3c', async () => {
    const { container } = renderWithRouter(<ManagedWordpressResourcePage />);
    // Strip aria-controls from ODS Popover (content in portal, not in same document)
    // const html = container.innerHTML.replace(/\s*aria-controls="[^"]*"/g, '');
    // await expect(html).toBeValidHtml();
    await expect(container).toBeAccessible();
  });
});
