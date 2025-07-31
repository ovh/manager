/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

import { Others } from './Others.component';

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

describe('Others', () => {
  it('renders action buttons', async () => {
    const mockOtherActionItem = {
      icon: 'book' as const,
      label: 'Other action',
      link: '/other',
    };

    render(<Others items={[mockOtherActionItem]} />);
    // Check for the link
    expect(screen.getByRole('link')).toBeInTheDocument();
    // Check for the button with the correct label attribute
    expect(
      screen.getByRole('button', { name: mockOtherActionItem.label }),
    ).toBeInTheDocument();
  });
});
