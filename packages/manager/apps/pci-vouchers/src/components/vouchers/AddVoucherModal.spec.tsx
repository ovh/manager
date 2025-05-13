import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import AddVoucherModal from '@/components/vouchers/AddVoucherModal';

const add = vi.fn(() => {});
vi.mock('@/api/hooks/useVouchers', () => ({
  useAddVoucher: () => ({
    add,
  }),
}));

const shellContext = {
  environment: {
    getUser: vi.fn().mockReturnValue({
      ovhSubsidiary: 'foo',
      currency: {
        symbol: '€',
      },
    }),
  },
  shell: {
    navigation: {
      getURL: vi.fn(),
    },
  },
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

function renderModal() {
  return render(
    <AddVoucherModal
      projectId="foo"
      onClose={() => {}}
      onError={() => {}}
      onSuccess={() => {}}
    ></AddVoucherModal>,
    { wrapper },
  );
}

describe('Add voucher modal', () => {
  it('should call the add function with given voucher id', async () => {
    const { getByTestId } = renderModal();
    const voucherInput = getByTestId('voucherId');
    const submitButton = getByTestId('pciModal-button_submit');
    expect(add).not.toHaveBeenCalled();
    act(() => {
      fireEvent.change(voucherInput, {
        target: {
          value: 'hello',
        },
      });
      // it seems we have to manually trigger the ods event
      ((voucherInput as unknown) as OsdsInput).odsValueChange.emit({
        value: 'hello',
      } as OdsInputValueChangeEventDetail);
    });
    expect(((voucherInput as unknown) as OsdsInput).value).toBe('hello');
    act(() => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(add).toHaveBeenCalledWith('hello');
    });
  });
});
