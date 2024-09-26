import React from 'react';
import { vi, describe, expect } from 'vitest';
import ActionButtonOrganization from '../ActionButtonOrganization.component';
import { render } from '@/utils/test.provider';
import organizationsTranslation from '@/public/translations/organizations/Messages_fr_FR.json';
import { organizationListMock, platformMock } from '@/api/_mock_';

vi.mock('@/hooks', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    usePlatform: vi.fn(() => ({
      platformUrn: platformMock[0].iam.urn,
    })),
  };
});

describe('Organizations datagrid action menu', () => {
  it('we have good number of item with good content', () => {
    const { container } = render(
      <ActionButtonOrganization organizationItem={organizationListMock[0]} />,
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
