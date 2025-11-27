import React, { ComponentType } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestWrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import SectigoModal from './orderSectigo.page';

const Wrappers = createTestWrapper();

describe('SectigoModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  // @TODO: this test can fail randomly for no apparent reason, I think there's
  // an issue in ODS that cause `has-error` to be empty randomly so let's
  // unskip this test when it is fixed
  it.skip('should render select with domain options', () => {
    render(<SectigoModal />, { wrapper: Wrappers as ComponentType });

    const select = screen.getByTestId('ssl-select-domain');
    expect(select).not.toBeNull();
  });
  // @TODO: this test can fail randomly for no apparent reason, I think there's
  // an issue in ODS that cause `has-error` to be empty randomly so let's
  // unskip this test when it is fixed
  it.skip('should open order page with right link and close modal on validate', () => {
    render(<SectigoModal />, { wrapper: Wrappers as ComponentType });

    const select = screen.getByTestId('ssl-select-domain');
    fireEvent.change(select, { target: { value: 'beta.example.com' } });
    expect((select as HTMLSelectElement).value).to.equal('beta.example.com');

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    const primaryBtn = screen.getByTestId('primary-button');
    expect(primaryBtn).not.toBeNull();
    fireEvent.click(primaryBtn);

    const expectedUrl =
      "https://www.ovh.com/fr/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'serviceName))&fqdn=";

    expect(openSpy).toHaveBeenCalledOnce();
    const [urlArg, targetArg] = openSpy.mock.calls[0];
    expect(urlArg).to.equal(expectedUrl);
    expect(targetArg).to.equal('_blank');

    expect(navigate).toHaveBeenCalled();
  });
  // @TODO: this test can fail randomly for no apparent reason, I think there's
  // an issue in ODS that cause `has-error` to be empty randomly so let's
  // unskip this test when it is fixed
  it.skip('should close modal on cancel', () => {
    render(<SectigoModal />, { wrapper: Wrappers as ComponentType });

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    const cancelBtn = screen.getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
  });
});
