import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults';
import { BillingPriceCell } from '../BillingPriceCell.components';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('BillingPriceCell', () => {
  it('renders resourceName from currentState', () => {
    render(<BillingPriceCell priceText='30.00 €' />);

    expect(screen.getByText('30.00 €')).toBeVisible();
  });
});
