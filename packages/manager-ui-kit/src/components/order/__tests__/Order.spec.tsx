import { fireEvent, waitFor } from '@testing-library/react';
import type { MockInstance } from 'vitest';
import { vi, vitest } from 'vitest';

import { useAuthorizationIam } from '@/hooks';
import { render } from '@/setupTest';

import { Order } from '../Order.component';
import fr_FR from '../translations/Messages_fr_FR.json';

vitest.mock('@/hooks/iam/useOvhIam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

const mockedHook = useAuthorizationIam as unknown as MockInstance;

describe('<Order> tests suite', () => {
  // Mock global window.open
  vi.stubGlobal('open', vi.fn());

  const onCancelSpy = vi.fn();
  const onValidateSpy = vi.fn();
  const onFinishSpy = vi.fn();
  const onClickLinkSpy = vi.fn();
  const orderLink = 'https://order-link';

  beforeEach(() => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: true,
      isFetched: true,
    });
  });

  afterEach(() => {
    vitest.resetAllMocks();
  });

  const renderComponent = (isValid: boolean, link: string, productName: string) =>
    render(
      <Order>
        <Order.Configuration isValid={isValid} onCancel={onCancelSpy} onConfirm={onValidateSpy}>
          <p>Order steps</p>
        </Order.Configuration>
        <Order.Summary
          onFinish={onFinishSpy}
          orderLink={link}
          onClickLink={onClickLinkSpy}
          productName={productName}
        ></Order.Summary>
      </Order>,
    );

  it.each([{ valid: true }, { valid: false }])(
    'when order configuration validity is $valid confirm button disabled attribute should be $valid',
    ({ valid }) => {
      const { getByText } = renderComponent(valid, '', '');

      expect(getByText('Order steps')).toBeVisible();
      expect(getByText(fr_FR.order_configuration_order)).toBeVisible();
    },
  );

  it('confirm button should be enabled and clickable when order configuration is valid', () => {
    const { getByText } = renderComponent(true, '', '');

    fireEvent.click(getByText(fr_FR.order_configuration_order));
    expect(onValidateSpy).toHaveBeenCalled();
  });

  it('should cancel order configuration when cancel button is clicked', () => {
    const { getByText } = renderComponent(false, '', '');

    fireEvent.click(getByText(fr_FR.order_configuration_cancel));
    expect(onCancelSpy).toHaveBeenCalled();
  });

  it('should open order link and display order summary when order configuration is confirmed ', () => {
    vi.spyOn(window, 'open');
    const { getByTestId, queryByText } = renderComponent(true, orderLink, '');

    fireEvent.click(getByTestId('cta-order-configuration-order'));

    // order configuration is hidden
    expect(queryByText('Order steps')).not.toBeInTheDocument();

    expect(getByTestId('order-summary-title')).toBeVisible();
    expect(getByTestId('order-summary-link')).toBeVisible();

    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(orderLink, '_blank', 'noopener,noreferrer');
  });

  it('should open order link when order link is clicked', () => {
    vi.spyOn(window, 'open');
    const { getByTestId } = renderComponent(true, orderLink, '');

    fireEvent.click(getByTestId('cta-order-configuration-order'));
    fireEvent.click(getByTestId('order-summary-link'));

    waitFor(() => expect(onClickLinkSpy).toHaveBeenCalled());
  });

  it('should close order summary when finish button is clicked', () => {
    vi.spyOn(window, 'open');
    const { getByTestId, getByText } = renderComponent(true, orderLink, '');

    fireEvent.click(getByText(fr_FR.order_configuration_order));
    fireEvent.click(getByTestId('cta-order-summary-finish'));

    expect(onFinishSpy).toHaveBeenCalled();
    expect(getByText(fr_FR.order_configuration_order)).toBeVisible();
  });

  it.each([{ productName: '' }, { productName: 'OVHcloud product' }])(
    'should display given product name with value $productName',
    ({ productName }) => {
      vi.spyOn(window, 'open');
      const { getByTestId, getByText } = renderComponent(true, orderLink, productName);
      fireEvent.click(getByText(fr_FR.order_configuration_order));
      fireEvent.click(getByTestId('order-summary-link'));
      const product = productName || 'service';
      expect(getByText(`Commande de votre ${product} initiée`)).toBeVisible();
    },
  );
});
