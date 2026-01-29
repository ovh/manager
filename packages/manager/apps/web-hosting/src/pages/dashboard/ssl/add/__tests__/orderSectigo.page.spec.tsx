import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { getDomRect, navigate } from '@/utils/test.setup';

import SectigoModal from '../orderSectigo.page';

describe('SectigoModal', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should render select with domain options', () => {
    const { getByTestId } = render(<SectigoModal />, { wrapper });

    const select = getByTestId('ssl-select-domain');
    expect(select).not.toBeNull();
  });

  it('should open order page with right link and close modal on validate', () => {
    const { getByTestId } = render(<SectigoModal />, { wrapper });

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    const primaryBtn = getByTestId('primary-button');
    expect(primaryBtn).not.toBeNull();
    act(() => {
      fireEvent.click(primaryBtn);
    });

    const expectedUrl =
      "https://www.ovh.com/fr/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'test-service))&fqdn=";

    expect(openSpy).toHaveBeenCalled();
    const [urlArg, targetArg] = openSpy.mock.calls[0];
    expect(urlArg).toBe(expectedUrl);
    expect(targetArg).toBe('_blank');

    expect(navigate).toHaveBeenCalled();
  });

  it('should close modal on cancel', () => {
    const { getByTestId } = render(<SectigoModal />, { wrapper });

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    const cancelBtn = getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('should have a valid html with a11y and w3c', async () => {
    const { container } = render(<SectigoModal />, { wrapper });
    const html = container.innerHTML;
    await expect(html).toBeValidHtml();
    await expect(container).toBeAccessible();
  });
});
