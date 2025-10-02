import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vault/vaults';
import { VaultStatusCell } from '@/pages/listing/_components';
import { ResourceStatus } from '@/types/Vault.type';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cell">{children}</div>
  ),
}));

vi.mock('@ovhcloud/ods-components', () => ({
  ODS_BADGE_COLOR: {
    information: 'information',
    critical: 'critical',
    success: 'success',
    warning: 'warning',
  },
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  // eslint-disable-next-line react/no-multi-comp
  OdsBadge: ({ color, label }: { color: string; label: string }) => (
    <span data-testid="badge" data-color={color}>
      {label}
    </span>
  ),
}));

describe('VaultStatusCell', () => {
  it('renders translated status and maps READY to success color', () => {
    const vault = { ...mockVaults[0]!, resourceStatus: 'READY' as ResourceStatus };

    render(<VaultStatusCell {...vault} />);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('ready');
    expect(badge.getAttribute('data-color')).toBe('success');
  });

  it('maps ERROR to critical color', () => {
    const vault = { ...mockVaults[0]!, resourceStatus: 'ERROR' as ResourceStatus };

    render(<VaultStatusCell {...vault} />);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('error');
    expect(badge.getAttribute('data-color')).toBe('critical');
  });
});
