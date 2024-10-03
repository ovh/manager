import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import BuyCreditModal from '@/components/vouchers/BuyCreditModal';

const buyMock = vi.fn(() => Promise.resolve({ data: {} }));
vi.mock('@/hooks/useVouchers', () => ({
  useBuyCredit: () => ({
    buy: buyMock,
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
    <BuyCreditModal
      projectId="foo"
      onClose={() => {}}
      onError={() => {}}
      onSuccess={() => {}}
    ></BuyCreditModal>,
    { wrapper },
  );
}

describe('Buy credit modal', () => {
  it('should call the buy function with given amount', async () => {
    const { getByTestId } = renderModal();
    const amountInput = getByTestId('amountInput');
    const submitButton = getByTestId('submitButton');
    // expect(result.current.buy).not.toHaveBeenCalled();
    act(() => {
      fireEvent.change(amountInput, {
        target: {
          value: 25,
        },
      });
      // it seems we have to manually trigger the ods event
      ((amountInput as unknown) as OsdsInput).odsValueChange.emit({
        value: '25',
      } as OdsInputValueChangeEventDetail);
    });
    expect(((amountInput as unknown) as OsdsInput).value).toBe(25);
    act(() => {
      fireEvent.click(submitButton);
    });
    waitFor(() => {
      expect(buyMock).toHaveBeenCalledWith(25);
    });
  });

  it('should disable submit button if no amount is specified', async () => {
    const { getByTestId } = renderModal();
    const amountInput = getByTestId('amountInput');
    const submitButton = getByTestId('submitButton');
    expect(submitButton).not.toHaveAttribute('disabled');
    act(() => {
      fireEvent.change(amountInput, {
        target: {
          value: 0,
        },
      });
      // it seems we have to manually trigger the ods event
      ((amountInput as unknown) as OsdsInput).odsValueChange.emit(({
        value: 0,
      } as unknown) as OdsInputValueChangeEventDetail);
    });
    expect(((amountInput as unknown) as OsdsInput).value).toBe(0);
    expect(submitButton).toHaveAttribute('disabled');
  });

  it('should only allows numerical values for amount', async () => {
    const { getByTestId } = renderModal();
    const amountInput = getByTestId('amountInput');
    const submitButton = getByTestId('submitButton');
    expect(submitButton).not.toHaveAttribute('disabled');
    act(() => {
      fireEvent.change(amountInput, {
        target: {
          value: 'hello',
        },
      });
      // it seems we have to manually trigger the ods event
      // it seems we have to manually trigger the ods event
      ((amountInput as unknown) as OsdsInput).odsValueChange.emit({
        value: 'hello',
      } as OdsInputValueChangeEventDetail);
    });
    expect(((amountInput as unknown) as OsdsInput).value).toBe(NaN);
    expect(submitButton).toHaveAttribute('disabled');
  });

  it('should only allows up to 8 digits for amount', async () => {
    const { getByTestId } = renderModal();
    const amountInput = getByTestId('amountInput');
    const submitButton = getByTestId('submitButton');
    expect(submitButton).not.toHaveAttribute('disabled');
    act(() => {
      fireEvent.change(amountInput, {
        target: {
          value: 123456789,
        },
      });
      // it seems we have to manually trigger the ods event
      ((amountInput as unknown) as OsdsInput).odsValueChange.emit(({
        value: 123456789,
      } as unknown) as OdsInputValueChangeEventDetail);
    });
    expect(((amountInput as unknown) as OsdsInput).value).toBe(123456789);
    expect(submitButton).toHaveAttribute('disabled');
  });
});
