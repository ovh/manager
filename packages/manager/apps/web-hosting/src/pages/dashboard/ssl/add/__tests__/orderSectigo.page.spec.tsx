/* eslint-disable @typescript-eslint/await-thenable */
import { act, fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import SectigoModal from '../orderSectigo.page';

describe('SectigoModal', () => {
  it('should render select with domain options', () => {
    const { getByTestId } = render(<SectigoModal />, { wrapper });

    const select = getByTestId('ssl-select-domain');
    expect(select).not.toBeNull();
  });

  it('should open order page with right link and close modal on validate', async () => {
    const { getByTestId } = render(<SectigoModal />, { wrapper });

    const select = getByTestId('ssl-select-domain');
    await act(() => {
      fireEvent.input(select, {
        target: { value: 'beta.example.com' },
      });
    });

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
});
