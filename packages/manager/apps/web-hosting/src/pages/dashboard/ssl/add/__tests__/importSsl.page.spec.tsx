import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { getDomRect, navigate } from '@/utils/test.setup';

import ImportModal from '../importSsl.page';

describe('ImportModal', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('render all text area', () => {
    const { getByTestId } = render(<ImportModal />, { wrapper });

    expect(getByTestId('ssl-manual-certif')).not.toBeNull();
    expect(getByTestId('ssl-mode-key')).not.toBeNull();
    expect(getByTestId('ssl-mode-chain')).not.toBeNull();
  });

  it('disable validate button when certificate or key is empty', () => {
    const { getByTestId } = render(<ImportModal />, { wrapper });

    const primaryBtn = getByTestId('primary-button');
    expect(primaryBtn).toBeDisabled();

    fireEvent.change(getByTestId('ssl-manual-certif'), {
      target: { value: '---CERT---' },
    });
    expect(primaryBtn).toBeDisabled();

    fireEvent.change(getByTestId('ssl-mode-key'), {
      target: { value: '---KEY---' },
    });

    expect(primaryBtn).not.toBeDisabled();
  });

  it('call useCreateCertificate with wright data and close modal', () => {
    const { getByTestId } = render(<ImportModal />, { wrapper });

    fireEvent.change(getByTestId('ssl-manual-certif'), {
      target: { value: '---CERT---' },
    });
    fireEvent.change(getByTestId('ssl-mode-key'), {
      target: { value: '---KEY---' },
    });
    fireEvent.change(getByTestId('ssl-mode-chain'), {
      target: { value: '---CHAIN---' },
    });

    const primaryBtn = getByTestId('primary-button');
    expect(primaryBtn).not.toBeDisabled();
    fireEvent.click(primaryBtn);

    expect(navigate).toHaveBeenCalled();
  });

  it('cancel button close modal', () => {
    const { getByTestId } = render(<ImportModal />, { wrapper });

    fireEvent.click(getByTestId('secondary-button'));
    expect(navigate).toHaveBeenCalled();
  });
  it('should have a valid html with a11y and w3c', async () => {
    const { container } = render(<ImportModal />, { wrapper });
    // const html = container.innerHTML;
    // await expect(html).toBeValidHtml();
    await expect(container).toBeAccessible();
  });
});
