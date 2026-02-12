import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { renderWithRouter } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import Layout from '../layout';

describe('Layout', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should render correctly', async () => {
    const { queryByTestId, container } = renderWithRouter(<Layout />, { route: '/test-service' });

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(container).toBeVisible();
  });
  it('should have a valid html with a11y and w3c', async () => {
    const { container } = renderWithRouter(<Layout />, { route: '/test-service' });
    const html = container.innerHTML;
    await expect(html).toBeValidHtml();
    await expect(container).toBeAccessible();
  });
});
