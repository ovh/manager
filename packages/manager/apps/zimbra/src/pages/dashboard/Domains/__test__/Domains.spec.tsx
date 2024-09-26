import React from 'react';
import { vi, describe, expect } from 'vitest';
import Domains from '../Domains';
import { render } from '@/utils/test.provider';
import domainTranslation from '@/public/translations/domains/Messages_fr_FR.json';
import { domainMock, platformMock, organizationListMock } from '@/api/_mock_';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
      platformUrn: platformMock[0].iam.urn,
    })),
    useDomains: vi.fn(() => ({
      data: domainMock,
    })),
    useOrganizationList: vi.fn(() => ({
      data: organizationListMock,
      isLoading: false,
    })),
    useGenerateUrl: vi.fn(
      () => '#/00000000-0000-0000-0000-000000000001/domains/add?',
    ),
    useOverridePage: vi.fn(() => false),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
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

describe('Domains page', () => {
  it('Page should display correctly', () => {
    const { getByTestId } = render(<Domains />);
    const button = getByTestId('add-domain-btn');
    expect(button).toHaveAttribute(
      'href',
      '#/00000000-0000-0000-0000-000000000001/domains/add?',
    );
    expect(button).toHaveTextContent(
      domainTranslation.zimbra_domains_add_domain_title,
    );
  });
});
