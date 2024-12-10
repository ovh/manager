// V Should be first V
import '@/test-utils/setupTests';
// -----
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { postOrderCartCartIdCheckout } from '@ovh-ux/manager-module-order';
import userEvent from '@testing-library/user-event';
import { OrderSubmitModalContent } from './OrderSubmitModalContent.component';

/** MOCKS */

const onErrorMock = vi.fn();

vi.mock('@ovh-ux/manager-module-order', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-module-order') = await importOriginal();
  return {
    ...original,
    postOrderCartCartIdCheckout: vi.fn(),
  };
});

/** END MOCKS */

/** RENDER */
const queryClient = new QueryClient();

const shellContext = {
  environment: {
    user: { ovhSubsidiary: 'FR' },
  },
};

const renderComponent = ({ onError }: { onError: () => void }) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <OrderSubmitModalContent
          submitButtonLabel="order-submit-modal-button-label"
          contractList={[]}
          cartId="1"
          onSuccess={vi.fn()}
          onError={onError}
        ></OrderSubmitModalContent>
        ,
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

/** END RENDER */
/** TESTS */
describe('OrderSubmitModalContent Component', () => {
  it('should display an error message if order fail', async () => {
    const user = userEvent.setup();

    vi.mocked(postOrderCartCartIdCheckout).mockRejectedValue({
      response: { data: { message: 'api-error' } },
    });

    const { getByText } = renderComponent({ onError: onErrorMock });

    const button = getByText('order-submit-modal-button-label');
    const checkbox = getByText('modalConfirmContractsCheckboxLabel');

    expect(button).toHaveAttribute('disabled');

    await act(() => {
      user.click(checkbox);
    });

    await waitFor(() => {
      expect(button).not.toHaveAttribute('disabled');
    });

    await act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(postOrderCartCartIdCheckout).toHaveBeenCalledWith({
        cartId: '1',
        autoPayWithPreferredPaymentMethod: true,
        waiveRetractationPeriod: true,
      });
      expect(getByText('api-error')).toBeDefined();
      expect(onErrorMock).toHaveBeenCalledOnce();
    });
  });
});
