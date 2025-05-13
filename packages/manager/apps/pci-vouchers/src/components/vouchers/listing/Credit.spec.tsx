import { describe, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import '@testing-library/jest-dom';

import CreditCell from '@/components/vouchers/listing/Credit';
import { TCredit } from '@/interface';

vi.mock('@ovh-ux/manager-react-components', async () => ({
  DataGridTextCell: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('AvailableCredit component display Voucher available Credit', () => {
  it('render available credit', async () => {
    const availableCredit: TCredit = {
      text: '9,99€',
      value: 9.99,
      currencyCode: '€',
    };

    render(<CreditCell credit={availableCredit}></CreditCell>);
    const priceText = await screen.findByText(availableCredit.text);
    await waitFor(() => {
      expect(priceText).toBeInTheDocument();
    });
  });
});
