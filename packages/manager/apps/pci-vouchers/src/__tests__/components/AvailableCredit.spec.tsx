import { describe, expect } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import AvailableCredit from '@/components/vouchers/listing/AvailableCredit';

describe('AvailableCredit component display Voucher available Credit', () => {
  it('render available credit', async () => {
    const rowData = {
      available_credit: { text: '9,99€' },
    };

    render(<AvailableCredit rowData={rowData}></AvailableCredit>);
    const priceText = await screen.findByText(rowData.available_credit.text);
    await waitFor(() => {
      expect(priceText).toBeInTheDocument();
    });
  });
});
