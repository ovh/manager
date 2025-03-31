import React from 'react';
import { it, vi, describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import PaymentModal from './PaymentModal';
import { PAYMENT_ALERTS } from './PaymentModal.constants';
import ModalsContext from '@/context/modals/modals.context';

const context = vi.hoisted(() => ({
  data: null,
}));

vi.mock('@/context', () => ({
  useApplication: () => ({
    shell: {
      getPlugin: (_: 'navigation' | 'ux') =>
        _ === 'navigation'
          ? {
              getURL: vi.fn(),
            }
          : {
              notifyModalActionDone: vi.fn(),
            },
    },
  }),
}));

const renderPaymentModal = () => {
  return render(
    <ModalsContext.Provider value={context}>
      <PaymentModal />
    </ModalsContext.Provider>,
  );
};

describe('PaymentModel.component', () => {
  it.each([PAYMENT_ALERTS.EXPIRED_CARD, PAYMENT_ALERTS.SOON_EXPIRED_CARD])(
    `should display the correct wording for %s`,
    (alert) => {
      context.data = alert;

      const { getByText } = renderPaymentModal();
      expect(getByText(`payment_modal_description_${alert}`)).not.toBeNull();
    },
  );
});
