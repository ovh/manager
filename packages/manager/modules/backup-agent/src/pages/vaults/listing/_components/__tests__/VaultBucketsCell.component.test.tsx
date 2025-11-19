import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults';

import { VaultBucketsCell } from '../VaultBucketsCell.component';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cell">{children}</div>
  ),
}));

describe('VaultBucketsCell', () => {
  it('renders the number of buckets from vspc length', () => {
    const vault = mockVaults[0]!;

    render(<VaultBucketsCell {...vault} />);

    expect(screen.getByTestId('cell')).toHaveTextContent('3');
  });
});
