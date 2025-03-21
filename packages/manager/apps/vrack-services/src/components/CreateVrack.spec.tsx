// V Should be first V
import '@/test-utils/setupTests';
// -----
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DetailedOrder } from '@ovh-ux/manager-module-order';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { CreateVrack, CreateVrackProps } from './CreateVrack.component';
// import { createVrackOnlyCart } from '@/utils/cart';

const queryClient = new QueryClient();

const shellContext = {
  environment: {
    user: { ovhSubsidiary: 'FR' },
  },
};

const renderComponent = ({ closeModal }: CreateVrackProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <CreateVrack closeModal={closeModal} />
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

/** MOCKS */
const closeModalMock = vi.fn();

vi.mock('@/utils/cart', async (importOriginal) => {
  const original: typeof import('@/utils/cart') = await importOriginal();
  return {
    ...original,
    createVrackOnlyCart: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-module-order', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-module-order') = await importOriginal();
  return {
    ...original,
    useOrderPollingStatus: () => ({
      data: [] as DetailedOrder[],
    }),
  };
});

/** END MOCKS */

describe.skip('CreateVrack Component', () => {
  it('should display the contracts after click the button create a vrack', async () => {
    // vi.mocked(createVrackOnlyCart).mockResolvedValue({
    //   contractList: [
    //     {
    //       name: 'test',
    //       url: 'test',
    //       content: 'test',
    //     },
    //     {
    //       name: 'test2',
    //       url: 'test2',
    //       content: 'test2',
    //     },
    //   ],
    //   cartId: '1',
    // });

    const { getByText } = renderComponent({ closeModal: closeModalMock });
    const button = await getByText('modalCreateNewVrackButtonLabel');
    await act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      // expect(createVrackOnlyCart).toHaveBeenCalledWith('FR');
      expect(getByText('modalConfirmContractsCheckboxLabel')).not.toBeNull();
      expect(
        getByText('modalVrackCreationSubmitOrderButtonLabel'),
      ).toBeDefined();
    });
  });

  it('should display an error message if cart creation fail', async () => {
    // vi.mocked(createVrackOnlyCart).mockRejectedValue({
    //   response: { data: { message: 'api-error' } },
    // });

    const { getByText } = renderComponent({ closeModal: closeModalMock });
    const button = await getByText('modalCreateNewVrackButtonLabel');

    await act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      // expect(createVrackOnlyCart).toHaveBeenCalledWith('FR');
      expect(getByText('api-error')).toBeDefined();
    });
  });
});
