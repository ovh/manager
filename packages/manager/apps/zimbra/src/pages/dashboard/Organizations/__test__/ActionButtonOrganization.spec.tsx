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

    expect(container.querySelectorAll('osds-menu-item').length).toBe(2);

    expect(container.querySelectorAll('osds-menu-item')[0]).toHaveTextContent(
      organizationsTranslation.zimbra_organization_edit,
    );

    expect(container.querySelectorAll('osds-menu-item')[1]).toHaveTextContent(
      organizationsTranslation.zimbra_organization_delete,
    );
  });
});
