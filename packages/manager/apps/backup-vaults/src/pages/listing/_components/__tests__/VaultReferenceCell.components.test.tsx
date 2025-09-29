import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vault/vaults';
import { VaultReferenceCell } from '@/pages/listing/_components';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cell">{children}</div>
  ),
}));

describe('VaultReferenceCell', () => {
  it('renders resourceName from currentState', () => {
    const vault = mockVaults[0]!;

    render(<VaultReferenceCell {...vault} />);

    expect(screen.getByTestId('cell')).toHaveTextContent(vault.currentState.resourceName);
  });
});
