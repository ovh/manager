import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonAlias from '../ActionButtonAlias.component';
import { render } from '@/utils/test.provider';
import aliasTranslation from '@/public/translations/accounts/alias/Messages_fr_FR.json';
import { aliasMock } from '@/api/_mock_';
import { ResourceStatus } from '@/api/api.type';

describe('Alias datagrid action menu', () => {
  it('should render correctly with enabled button', () => {
    const { container } = render(
      <ActionButtonAlias
        aliasItem={{ ...aliasMock[0], status: ResourceStatus.READY }}
      />,
    );

    expect(container.querySelectorAll('osds-menu-item').length).toBe(1);

    expect(container.querySelectorAll('osds-menu-item')[0]).toHaveTextContent(
      aliasTranslation.zimbra_account_alias_datagrid_tooltip_delete,
    );

    expect(container.querySelectorAll('osds-menu-item')[0]).toBeEnabled();
  });

  it('should render correctly with disabled button', () => {
    const { container } = render(
      <ActionButtonAlias
        aliasItem={{ ...aliasMock[0], status: ResourceStatus.CREATING }}
      />,
    );

    expect(container.querySelectorAll('osds-menu-item').length).toBe(1);

    expect(container.querySelectorAll('osds-menu-item')[0]).toHaveTextContent(
      aliasTranslation.zimbra_account_alias_datagrid_tooltip_delete,
    );

    expect(container.querySelectorAll('osds-menu-item')[0]).toBeDisabled();
  });
});
