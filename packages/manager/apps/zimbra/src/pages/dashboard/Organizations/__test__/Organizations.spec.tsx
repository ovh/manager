import React from 'react';
import { vi, describe, expect } from 'vitest';
import Organizations from '../Organizations';
import { render } from '@/utils/test.provider';
import organizationsTranslation from '@/public/translations/organizations/Messages_fr_FR.json';
import { organizationListMock, platformMock } from '@/api/_mock_';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
      platformUrn: platformMock[0].iam.urn,
    })),
    useOrganizationList: vi.fn(() => ({
      data: organizationListMock,
    })),
    useGenerateUrl: vi.fn(
      () => '#/00000000-0000-0000-0000-000000000001/organizations/add?',
    ),
  };
});

vi.mock('@ovhcloud/manager-components', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    Notifications: vi.fn().mockReturnValue(<div>Notifications</div>),
    Datagrid: vi.fn().mockReturnValue(<div>Datagrid</div>),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Organizations page', () => {
  it('Page should display correctly', () => {
    const { getByTestId } = render(<Organizations />);
    const button = getByTestId('add-organization-btn');
    expect(button).toHaveAttribute(
      'href',
      '#/00000000-0000-0000-0000-000000000001/organizations/add?',
    );
    expect(button).toHaveTextContent(
      organizationsTranslation.add_organisation_cta,
    );
  });
});
