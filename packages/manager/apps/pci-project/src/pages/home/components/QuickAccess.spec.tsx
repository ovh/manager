/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { setupAllMocks, mockQuickAccessItem } from '@/data/__mocks__';

import { QuickAccess } from './QuickAccess.component';

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

describe('QuickAccess', () => {
  it('renders a list of quick access cards', async () => {
    render(<QuickAccess items={[mockQuickAccessItem]} />);
    expect(screen.getByTestId('ods-card')).toBeInTheDocument();
  });

  it('renders multiple quick access cards', async () => {
    const multipleItems = [
      mockQuickAccessItem,
      { ...mockQuickAccessItem, title: 'Second Service' },
    ];
    render(<QuickAccess items={multipleItems} />);
    const cards = screen.getAllByTestId('ods-card');
    expect(cards.length).toBe(2);
  });
});
