import { it, vi, describe, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { PAYMENT_ALERTS } from './constants';
import PaymentModal, { IPaymentMethod } from './PaymentModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as ManagerApi from '@ovh-ux/manager-core-api';
import * as useModalsModule from '@/context/modals';
import { ModalTypes } from '@/context/modals/modals.context';

vi.mock('@/context', () => ({
  useShell: () => ({
    getPlugin: (_: 'navigation') => ({
      getURL: vi.fn(),
    }),
  }),
}));

// Expired card in 50 days
const mockValidResponse: ManagerApi.IcebergFetchResultV6<IPaymentMethod> = {
  data: [
    {
      label: 'Carte de crédit',
      status: 'VALID',
      default: true,
      oneclick: false,
      lastUpdate: '2023-03-30T10:00:00.000Z',
      description: 'Carte de crédit',
      integration: 'CREDIT_CARD',
      paymentType: 'CREDIT_CARD',
      creationDate: '2023-03-30T10:00:00.000Z',
      paymentMeanId: 1,
      expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 50).toISOString(),
      paymentSubType: 'CREDIT_CARD',
      paymentMethodId: 1,
    }
  ],
  totalCount: 1,
  status: 200,
};
// Expired card 1min ago
const mockExpiredResponse: ManagerApi.IcebergFetchResultV6<IPaymentMethod> = {
  ...mockValidResponse,
  data: [
    {
      ...mockValidResponse.data[0],
      expirationDate: new Date(Date.now() - 1000 * 60).toISOString(),
    }
  ]
}
// Expired card in 20 days
const mockSoonExpiredResponse: ManagerApi.IcebergFetchResultV6<IPaymentMethod> = {
  ...mockValidResponse,
  data: [
    {
      ...mockValidResponse.data[0],
      expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
    }
  ]
};

const renderPaymentModal = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <PaymentModal />
    </QueryClientProvider>
  )
}

const mockedUseModalsModule = vi.spyOn(useModalsModule, 'useModals').mockReturnValue({
  current: ModalTypes.payment,
});

describe('PaymentModel.component', () => {

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render no modal if the payment modal is not the current one', async () => {
    mockedUseModalsModule.mockReturnValueOnce({
      current: ModalTypes.kyc,
    });
    const spy = vi.spyOn(ManagerApi, 'fetchIcebergV6').mockResolvedValue(mockValidResponse);
    const { queryByTestId } = renderPaymentModal();
    await waitFor(() => {
        expect(spy).not.toHaveBeenCalled();
        expect(queryByTestId('paymentModal')).toBeNull();
    }, { timeout: 2000 });
  });

  it('should render no modal if card is valid', async () => {
    const spy = vi.spyOn(ManagerApi, 'fetchIcebergV6').mockResolvedValue(mockValidResponse);
    const { queryByTestId } = renderPaymentModal();
    await waitFor(() => {
        expect(spy).toHaveBeenCalled();
        expect(queryByTestId('paymentModal')).toBeNull();
    }, { timeout: 2000 });
  });

  it('should render modal if card is expired', async () => {
    const spy = vi.spyOn(ManagerApi, 'fetchIcebergV6').mockResolvedValue(mockExpiredResponse);
    const { queryByTestId } = renderPaymentModal();
    await waitFor(() => {
        expect(spy).toHaveBeenCalled();
        expect(queryByTestId('paymentModal')).toBeInTheDocument();
    }, { timeout: 2000 });
    expect(queryByTestId('paymentModal')).toHaveTextContent(`payment_modal_description_${PAYMENT_ALERTS.EXPIRED_CARD}`);
  });

  it('should render modal if card is soon expired', async () => {
    const spy = vi.spyOn(ManagerApi, 'fetchIcebergV6').mockResolvedValue(mockSoonExpiredResponse);
    const { queryByTestId } = renderPaymentModal();
    await waitFor(() => {
        expect(spy).toHaveBeenCalled();
        expect(queryByTestId('paymentModal')).toBeInTheDocument();
    }, { timeout: 2000 });
    expect(queryByTestId('paymentModal')).toHaveTextContent(`payment_modal_description_${PAYMENT_ALERTS.SOON_EXPIRED_CARD}`);
  });
})
