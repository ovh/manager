/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { setupAllMocks, mockBottomSectionItem } from '@/data/__mocks__';

import TileItemContent from './TileItemContent.component';

setupAllMocks();

vi.mock('./VoucherLink.component', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="voucher-link" />),
}));
vi.mock('./BillingItem.component', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="billing-item" />),
}));

describe('TileItemContent', () => {
  it('renders voucher link when item is voucher', async () => {
    render(
      <TileItemContent
        item={{ ...mockBottomSectionItem, isVoucherLink: true }}
        section={{ title: 'billing', type: 'billing', items: [] }}
        isLoading={false}
        projectId="1"
      />,
    );
    expect(screen.getByTestId('voucher-link')).toBeInTheDocument();
  });

  it('renders billing item when section type is billing', async () => {
    render(
      <TileItemContent
        item={mockBottomSectionItem}
        section={{ title: 'billing', type: 'billing', items: [] }}
        isLoading={false}
        projectId="1"
      />,
    );
    expect(screen.getByTestId('billing-item')).toBeInTheDocument();
  });

  it('renders loading state when isLoading is true', async () => {
    render(
      <TileItemContent
        item={mockBottomSectionItem}
        section={{ title: 'billing', type: 'billing', items: [] }}
        isLoading={true}
        projectId="1"
      />,
    );
    expect(screen.getByTestId('billing-item')).toBeInTheDocument();
  });
});
