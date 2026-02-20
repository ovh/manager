import { render } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { managedWordpressResourceMock } from '@/data/__mocks__/managedWordpress/ressource';
import ManagedWordpressTranslations from '@/public/translations/common/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import ManagedWordpressPage from '../ManagedWordpress.page';

vi.mock(
  '@/data/hooks/managedWordpress/managedWordpressResource/useManagedWordpressResource',
  () => ({
    useManagedWordpressResource: vi.fn(() => ({
      data: managedWordpressResourceMock,
      isLoading: false,
    })),
  }),
);
describe('ManagedWordpressPage Page', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should render page with content', () => {
    const { getByText } = render(<ManagedWordpressPage />, { wrapper });

    expect(
      getByText(ManagedWordpressTranslations.web_hosting_status_header_resource),
    ).toBeInTheDocument();
  });
  it('should have a valid html with a11y and w3c', async () => {
    const { container } = render(<ManagedWordpressPage />, { wrapper });
    const html = container.innerHTML;
    await expect(html).toBeValidHtml();
    await expect(container).toBeAccessible();
  });
});
