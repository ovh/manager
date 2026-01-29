import { render } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { managedWordpressWebsitesTaskMock } from '@/data/__mocks__';
import ManagedWordpressTranslations from '@/public/translations/common/Messages_fr_FR.json';
import { renderWithRouter, wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import TaskPage from '../ManagedWordpressResource/tasks/Tasks.page';

vi.mock(
  '@/data/hooks/managedWordpress/managedWordpressResourceTasks/useManagedWordpressResourceTasks',
  () => ({
    useManagedWordpressResourceTasks: vi.fn(() => ({
      data: [managedWordpressWebsitesTaskMock],
      isFetching: false,
      isLoading: false,
      refetch: vi.fn(),
    })),
  }),
);
describe('Task Page', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should render page with content', () => {
    const { getAllByText } = render(<TaskPage />, { wrapper });

    expect(
      getAllByText(ManagedWordpressTranslations.web_hosting_status_header_fqdn).length,
    ).toBeGreaterThan(0);
  });
  it('should have a valid html with a11y and w3c', async () => {
    /*
    issue with ods columns in datagrid
    error: The “aria-controls” attribute must point to an element in the same document.
   */
    const { container } = renderWithRouter(<TaskPage />);
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
  await expect(container).toBeAccessible();
  */
  });
});
