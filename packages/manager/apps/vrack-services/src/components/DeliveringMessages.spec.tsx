import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { DetailedOrder } from '@ovh-ux/manager-module-order';
import { DeliveringMessages } from './DeliveringMessages.component';

/** MOCKS */
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string, params?: any) => {
      const flattenParams = params
        ? Object.keys(params).reduce((previous, current) => {
            return `${previous} | ${current}:${params[current]}`;
          }, '')
        : undefined;
      return flattenParams
        ? `${translationKey}${flattenParams}`
        : translationKey;
    },
    i18n: { language: 'fr_FR' },
  }),
}));
/** END MOCKS */
/** Render */
const renderComponent = ({ orders }: { orders?: DetailedOrder[] }) => {
  return render(<DeliveringMessages messageKey="order-text" orders={orders} />);
};

/** END RENDER */

describe('DeliveringMessages Component', () => {
  it('should display list of ongoing orders', async () => {
    const { getByText } = renderComponent({
      orders: [
        {
          date: '2024-12-06T12:10:00.000Z',
          orderId: 1,
          status: 'delivering',
        } as DetailedOrder,
      ],
    });

    const date = new Date('2024-12-06T12:10:00.000Z');

    expect(
      getByText(
        `order-text | date:${date.toLocaleDateString(
          'fr-FR',
        )} | time:${date.getHours()}:${date.getMinutes()} | status:orderStatus-delivering`,
      ),
    ).toBeDefined();
  });
});
