import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults.mock';

import { BucketNameCell } from '../BucketNameCell.component';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cell">{children}</div>
  ),
}));

describe('BucketNameCell', () => {
  it('renders link with targetSpec.name as label and default href', () => {
    const bucket = mockVaults[0]!.currentState.buckets[0]!;

    render(<BucketNameCell name={bucket.name} />);

    const cell = screen.getByTestId('cell');
    expect(cell).toHaveTextContent(bucket.name);
  });
});
