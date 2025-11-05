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

  const testCases: Array<{ desc: string; vault: VaultResource; isDisabled: boolean }> = [
    {
      desc: 'renders an enabled button if vault has no VSPC',
      vault: withoutVspc,
      isDisabled: false,
    },
    {
      desc: 'renders a disabled button if vault has VSPC',
      vault: withVspc,
      isDisabled: true,
    },
  ];

  it.each(testCases)('$desc', ({ vault, isDisabled }) => {
    render(<VaultActionCell {...vault} />);

    const button = screen.getByTestId('delete-vault-button');
    expect(button).toHaveAttribute('is-disabled', `${isDisabled}`);
    expect(button).toHaveAttribute('icon', ODS_ICON_NAME.trash);
    expect(button).toHaveAttribute('variant', ODS_BUTTON_VARIANT.ghost);
  });
});
