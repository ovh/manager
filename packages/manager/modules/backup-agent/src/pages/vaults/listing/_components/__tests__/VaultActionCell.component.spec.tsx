import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { mockVaults } from '@/mocks/vaults/vaults';
import { VaultResource } from '@/types/Vault.type';

import { VaultActionCell } from '../VaultActionCell.component';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('VaultActionCell test suite', () => {
  const vault = mockVaults[0]!;
  const withVspc: VaultResource = {
    ...vault,
    currentState: { ...vault.currentState, vspcTenants: ['vspc1'] },
  };
  const withoutVspc: VaultResource = {
    ...vault,
    currentState: { ...vault.currentState, vspcTenants: [] },
  };

  const testCases: Array<{ desc: string; vault: VaultResource }> = [
    {
      desc: 'renders an enabled button if vault has no VSPC',
      vault: withoutVspc,
    },
    {
      desc: 'renders a enabled button if vault has VSPC',
      vault: withVspc,
    },
  ];

  it.each(testCases)('$desc', ({ vault }) => {
    render(<VaultActionCell {...vault} />);

    const button = screen.getByTestId('delete-vault-button');
    expect(button).toHaveAttribute('icon', ODS_ICON_NAME.trash);
    expect(button).toHaveAttribute('variant', ODS_BUTTON_VARIANT.ghost);
  });
});
