/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { setupAllMocks, mockQuickAccessItem } from '@/data/__mocks__';

import { QuickAccessCard } from './QuickAccessCard.component';

setupAllMocks();

vi.mock('react-router-dom', () => ({
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
    [key: string]: any;
  }) => React.createElement('a', { href: to, ...props }, children),
}));

describe('QuickAccessCard', () => {
  it('renders card with provided item data', async () => {
    render(<QuickAccessCard item={mockQuickAccessItem} index={0} />);

    // Test the main card link using the translation key
    const cardLink = screen.getByLabelText(
      'pci_project_quick_access_card_aria_label',
    );
    expect(cardLink).toHaveAttribute('href', mockQuickAccessItem.link);

    // Test the description text
    const descriptionText = screen.getByText(mockQuickAccessItem.description);
    expect(descriptionText).toBeInTheDocument();

    expect(screen.getByTestId('ods-card')).toBeInTheDocument();
  });
});
