import { it, vi, describe, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PaymentModal from './PaymentModal.component';
import { PAYMENT_ALERTS } from './paymentModal.constants';

const mocks = vi.hoisted(() => ({
  href: 'https://fake-manager.com/manager/dedicated/#/account',
  data: null as string | null,
}));

Object.defineProperty(window, 'location', {
  value: {
    href: mocks.href,
  },
  writable: true,
});

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const originalModule: typeof import('@tanstack/react-query') = await importOriginal();
  return {
    ...originalModule,
    useQuery: vi.fn(() => ({ data: mocks.data, isFetched: true })),
  };
});

vi.mock('@/context', () => ({
  useApplication: () => ({
    shell: {
      // eslint-disable-next-line consistent-return
      getPlugin: (plugin: string) => {
        // eslint-disable-next-line default-case
        switch (plugin) {
          case 'navigation':
            return {
              getURL: vi.fn(
                (appName, appPath) =>
                  `https://fake-manager.com/manager/${appName}/${appPath}`,
              ),
              navigateTo: vi.fn(),
            };
          case 'environment':
            return {
              getEnvironment: () => ({
                getRegion: vi.fn(),
                getApplicationURL: vi.fn(
                  (app) => `https://fake-manager.com/manager/${app}`,
                ),
                getUser: vi.fn(() => {}),
              }),
            };
          case 'ux':
            return {
              notifyModalActionDone: vi.fn(),
            };
        }
      },
    },
  }),
}));

const renderPaymentModal = () => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <PaymentModal />
    </QueryClientProvider>,
  );
};

describe('PaymentModel.component', () => {
  it('should not render if there is no alert', async () => {
    mocks.data = null;
    const { queryByTestId } = renderPaymentModal();

    await waitFor(() => {
      expect(queryByTestId('paymentModal')).toBeNull();
    });
  });

  it.each([PAYMENT_ALERTS.EXPIRED_CARD, PAYMENT_ALERTS.SOON_EXPIRED_CARD])(
    `should display the correct wording for %s`,
    (alert) => {
      mocks.data = alert;

      const { getByText } = renderPaymentModal();
      expect(getByText(`payment_modal_description_${alert}`)).not.toBeNull();
    },
  );
});
