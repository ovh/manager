import { describe, expect, vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import AddVoucherModal from '@/components/vouchers/AddVoucherModal';
import { useAddVoucher } from '@/hooks/useVouchers';
import queryClient from '@/queryClient';

vi.mock('@ovh-ux/manager-react-shell-client', async () => ({
  useEnvironment: () => ({
    user: {},
  }),
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

vi.mock('@/hooks/useVouchers', () => {
  const add = vi.fn(() => {});
  return {
    useAddVoucher: () => ({
      add,
    }),
  };
});

function renderModal() {
  render(
    <QueryClientProvider client={queryClient}>
      <AddVoucherModal
        projectId="foo"
        onClose={() => {}}
        onError={() => {}}
        onSuccess={() => {}}
      ></AddVoucherModal>
      ,
    </QueryClientProvider>,
  );
}

describe('Add voucher modal', () => {
  it('should call the add function with given voucher id', async () => {
    const useAdd = useAddVoucher({
      projectId: 'foo',
      onSuccess: () => {},
      onError: () => {},
    });
    renderModal();
    const voucherInput = screen.getByTestId('voucherId');
    const submitButton = screen.getByTestId('submitButton');
    expect(useAdd.add).not.toHaveBeenCalled();
    act(() => {
      fireEvent.change(voucherInput, {
        target: {
          value: 'hello',
        },
      });
      // it seems we have to manually trigger the ods event
      voucherInput.odsValueChange.emit({ value: 'hello' });
    });
    expect(voucherInput.value).toBe('hello');
    act(() => {
      fireEvent.click(submitButton);
    });
    expect(useAdd.add).toHaveBeenCalledWith('hello');
  });
});
