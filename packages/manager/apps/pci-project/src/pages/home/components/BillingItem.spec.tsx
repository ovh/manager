/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { setupAllMocks, mockBottomSectionItem } from '@/data/__mocks__';
import BillingItem from './BillingItem.component';

setupAllMocks();

describe('BillingItem', () => {
  it('renders skeletons when loading', async () => {
    render(<BillingItem item={mockBottomSectionItem} isLoading={true} />);
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });

  it('renders billing information', async () => {
    render(<BillingItem item={mockBottomSectionItem} isLoading={false} />);
    expect(screen.getByText(mockBottomSectionItem.label)).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });
});
