import { describe, expect, vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import BuyCreditModal from '@/components/vouchers/BuyCreditModal';
import { useBuyCredit } from '@/hooks/useVouchers';
import queryClient from '@/queryClient';

vi.mock('@ovh-ux/manager-react-shell-client', async () => ({
  useEnvironment: () => ({
    user: {},
  }),
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
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
  const buy = vi.fn(() => {});
  return {
    useBuyCredit: () => ({
      buy,
    }),
  };
});

describe('Buy credit modal', () => {
  it('should call the buy function with given amount', async () => {
    const useBuy = useBuyCredit({
      projectId: 'foo',
      onSuccess: () => {},
      onError: () => {},
    });
    render(
      <QueryClientProvider client={queryClient}>
        <BuyCreditModal
          projectId="foo"
          onClose={() => {}}
          onError={() => {}}
          onSuccess={() => {}}
        ></BuyCreditModal>
        ,
      </QueryClientProvider>,
    );
    const amountInput = screen.getByTestId('amountInput');
    const submitButton = screen.getByTestId('submitButton');
    expect(useBuy.buy).not.toHaveBeenCalled();
    act(() => {
      fireEvent.change(amountInput, {
        target: {
          value: 25,
        },
      });
      // it seems we have to manually trigger the ods event
      amountInput.odsValueChange.emit({ value: 25 });
    });
    expect(amountInput.value).toBe(25);
    act(() => {
      fireEvent.click(submitButton);
    });
    expect(useBuy.buy).toHaveBeenCalledWith(25);
  });
});
