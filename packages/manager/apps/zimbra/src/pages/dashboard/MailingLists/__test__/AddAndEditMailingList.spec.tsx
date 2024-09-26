import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { act } from 'react-dom/test-utils';
import { render } from '@/utils/test.provider';
import { mailingListsMock, domainMock, platformMock } from '@/api/_mock_';
import AddAndEditMailingList from '../AddAndEditMailingList.page';
import mailingListsAddAndEditTranslation from '@/public/translations/mailinglists/addAndEdit/Messages_fr_FR.json';
import { ModerationChoices, ReplyToChoices } from '@/api/mailinglist';

const { useSearchParamsMock } = vi.hoisted(() => ({
  useSearchParamsMock: vi.fn(() => [new URLSearchParams()]),
}));

const { useQueryMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
}));

const { useLocationMock } = vi.hoisted(() => ({
  useLocationMock: vi.fn(() => ({
    pathname: '/00000000-0000-0000-0000-000000000001/mailing_lists/add',
    search: '',
  })),
}));

const { useMailingListMock } = vi.hoisted(() => ({
  useMailingListMock: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
}));

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
    useGenerateUrl: vi.fn(),
    useDomains: vi.fn(() => ({
      data: domainMock,
      isLoading: false,
    })),
    useOrganization: vi.fn(() => ({
      data: null,
      isLoading: false,
    })),
    useMailingList: useMailingListMock,
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: useLocationMock,
    useResolvedPath: vi.fn(() => '/:serviceName/mailing_lists'),
    useSearchParams: useSearchParamsMock,
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNotifications: vi.fn(() => ({
      addError: () => vi.fn(),
      addSuccess: () => vi.fn(),
    })),
    Datagrid: vi.fn().mockReturnValue(<div>Datagrid</div>),
  };
});

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useQuery: useQueryMock,
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('mailing lists add and edit page', () => {
  const editMailingListId = mailingListsMock[0].id;

  it('should be in add mode if no editMailingListId param', () => {
    useMailingListMock.mockImplementation(
      vi.fn(() => ({
        data: null,
        isLoading: false,
      })),
    );
    const { getByTestId } = render(<AddAndEditMailingList />);
    expect(getByTestId('page-title')).toHaveTextContent(
      mailingListsAddAndEditTranslation.zimbra_mailinglist_add_title,
    );
  });

  it('should be add page and enable/disable button based on form validity', () => {
    useLocationMock.mockImplementation(
      vi.fn(() => ({
        pathname: `/00000000-0000-0000-0000-000000000001/mailing_lists/add`,
        search: '',
      })),
    );

    const { getByTestId } = render(<AddAndEditMailingList />);

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-account');
    const selectDomain = getByTestId('select-domain');
    const inputOwner = getByTestId('input-owner');
    const replyTo = getByTestId('radio-group-reply-to');
    const selectLanguage = getByTestId('select-language');
    const moderationOption = getByTestId('radio-group-moderation-option');

    expect(button).not.toBeEnabled();

    act(() => {
      inputAccount.odsInputBlur.emit({ name: 'account', value: '' });
      inputOwner.odsInputBlur.emit({ name: 'owner', value: '' });
    });

    expect(inputAccount).toHaveAttribute('color', 'error');
    expect(inputOwner).toHaveAttribute('color', 'error');
    expect(button).not.toBeEnabled();

    act(() => {
      inputAccount.odsValueChange.emit({ name: 'account', value: 'account' });
      selectDomain.odsValueChange.emit({ name: 'domain', value: 'domain' });
      inputOwner.odsValueChange.emit({
        name: 'owner',
        value: 'testowner',
      });
      selectLanguage.odsValueChange.emit({ name: 'language', value: 'FR' });
      replyTo.odsValueChange.emit({
        name: 'defaultReplyTo',
        value: ReplyToChoices.LIST,
      });
      moderationOption.odsValueChange.emit({
        name: 'moderationOption',
        value: ModerationChoices.ALL,
      });
    });

    expect(inputAccount).toHaveAttribute('color', 'default');
    expect(inputOwner).toHaveAttribute('color', 'default');
    expect(button).toBeEnabled();

    act(() => {
      inputOwner.odsValueChange.emit({
        name: 'owner',
        value: 't',
      });
    });

    expect(button).not.toBeEnabled();
  });

  it('should be in edit mode if editMailingListId param is present', () => {
    useMailingListMock.mockImplementation(
      vi.fn(() => ({
        data: mailingListsMock[0],
        isLoading: false,
      })),
    );

    useLocationMock.mockImplementation(
      vi.fn(() => ({
        pathname: `/00000000-0000-0000-0000-000000000001/mailing_lists/settings?editMailingListId=${editMailingListId}`,
        search: '',
      })),
    );
    useSearchParamsMock.mockImplementation(
      vi.fn(() => [
        new URLSearchParams({
          editMailingListId,
        }),
      ]),
    );
    const { getByTestId } = render(<AddAndEditMailingList />);
    expect(getByTestId('page-title')).toHaveTextContent(
      mailingListsAddAndEditTranslation.zimbra_mailinglist_edit_title,
    );
  });
});
