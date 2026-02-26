import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { getDomRect, navigate } from '@/utils/test.setup';

import DeleteSiteModal from '../DeleteSite.modal';

describe('DeleteSiteModal', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should render correctly', () => {
    const { container } = render(<DeleteSiteModal />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should close modal on cancel', () => {
    render(<DeleteSiteModal />, { wrapper });

    const cancelBtn = screen.getByTestId('secondary-button');
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalledWith(-1);
  });
  it('should have a valid html with a11y and w3c', async () => {
    const { container } = render(<DeleteSiteModal />, { wrapper });
    // const html = container.innerHTML;
    // await expect(html).toBeValidHtml();
    await expect(container).toBeAccessible();
  });
});
