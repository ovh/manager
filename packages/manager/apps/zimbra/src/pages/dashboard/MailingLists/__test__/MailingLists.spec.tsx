import React from 'react';
import { vi, describe, expect } from 'vitest';
import { render } from '@/utils/test.provider';
import mailingListsTranslation from '@/public/translations/mailinglists/Messages_fr_FR.json';
import { mailingListsMock, platformMock } from '@/api/_mock_';
import MailingLists from '../MailingLists';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
      platformUrn: platformMock[0].iam.urn,
    })),
    useMailingLists: vi.fn(() => ({
      data: mailingListsMock,
    })),
    useGenerateUrl: vi.fn(
      () => '#/00000000-0000-0000-0000-000000000001/mailinglists/add?',
    ),
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

describe('Mailing Lists page', () => {
  it('Page should display correctly', () => {
    const { getByTestId } = render(<MailingLists />);
    const button = getByTestId('add-mailinglist-btn');
    expect(button).toHaveAttribute(
      'href',
      '#/00000000-0000-0000-0000-000000000001/mailinglists/add?',
    );
    expect(button).toHaveTextContent(
      mailingListsTranslation.zimbra_mailinglists_datagrid_cta,
    );
  });
});
