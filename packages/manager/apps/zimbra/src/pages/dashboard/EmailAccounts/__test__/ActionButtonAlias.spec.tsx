import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonAlias from '../ActionButtonAlias.component';
import { render } from '@/utils/test.provider';
import aliasTranslation from '@/public/translations/accounts/alias/Messages_fr_FR.json';
import { aliasMock } from '@/api/_mock_';
import { ResourceStatus } from '@/api/api.type';

describe('Alias datagrid action menu', () => {
  it('should render correctly with enabled button', () => {
    const { container, getByTestId } = render(
      <ActionButtonAlias
        aliasItem={{ ...aliasMock[0], status: ResourceStatus.READY }}
      />,
    );

    const menu = getByTestId('navigation-action-trigger-action');

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(1);

    expect(menuItems[0]).toHaveAttribute(
      'label',
      aliasTranslation.zimbra_account_alias_datagrid_tooltip_delete,
    );

    expect(menu).toHaveAttribute('is-disabled', 'false');
  });

  it('should render correctly with disabled button', () => {
    const { container, getByTestId } = render(
      <ActionButtonAlias
        aliasItem={{ ...aliasMock[0], status: ResourceStatus.CREATING }}
      />,
    );

    const menu = getByTestId('navigation-action-trigger-action');

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(1);

    expect(menuItems[0]).toHaveAttribute(
      'label',
      aliasTranslation.zimbra_account_alias_datagrid_tooltip_delete,
    );

    expect(menu).toHaveAttribute('is-disabled', 'true');
  });
});
