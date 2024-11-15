import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonOrganization from '../ActionButtonOrganization.component';
import { render } from '@/utils/test.provider';
import organizationsTranslation from '@/public/translations/organizations/Messages_fr_FR.json';
import { organizationDetailMock } from '@/api/_mock_';

describe('Organizations datagrid action menu', () => {
  it('we have good number of item with good content', () => {
    const { container } = render(
      <ActionButtonOrganization organizationItem={organizationDetailMock} />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(2);

    expect(menuItems[0]).toHaveAttribute(
      'label',
      organizationsTranslation.zimbra_organization_edit,
    );

    expect(menuItems[1]).toHaveAttribute(
      'label',
      organizationsTranslation.zimbra_organization_delete,
    );
  });
});
