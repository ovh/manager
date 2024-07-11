import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import { render } from '@/utils/test.provider';
import { accountMock, domainMock, platformMock } from '@/api/_mock_';
import AddAndEditEmailAccount from '../AddAndEditEmailAccount';
import emailAccountAddAndEditTranslation from '@/public/translations/accounts/addAndEdit/Messages_fr_FR.json';

const { useSearchParamsMock } = vi.hoisted(() => ({
  useSearchParamsMock: vi.fn(() => [new URLSearchParams()]),
}));

const { useQueryMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn(() => ({
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
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  MemoryRouter: vi.fn(() => <AddAndEditEmailAccount />),
  useSearchParams: useSearchParamsMock,
}));

vi.mock('@ovhcloud/manager-components', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNotifications: vi.fn(() => ({
      addError: () => vi.fn(),
      addSuccess: () => vi.fn(),
    })),
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
  cleanup();
});

describe('email account add and edit page', () => {
  it('if there is not editEmailAccountId params', () => {
    const { getByTestId } = render(<AddAndEditEmailAccount />);
    expect(getByTestId('page-title')).toHaveTextContent(
      emailAccountAddAndEditTranslation.zimbra_account_add_title,
    );
  });

  it('if there is editEmailAccountId params', () => {
    useSearchParamsMock.mockImplementation(
      vi.fn(() => [
        new URLSearchParams({
          editEmailAccountId: '19097ad4-2880-4000-8b03-9d110f0b8f80',
        }),
      ]),
    );
    useQueryMock.mockImplementation(
      vi.fn(() => ({
        data: accountMock[0],
        isLoading: false,
      })),
    );
    const { getByTestId } = render(<AddAndEditEmailAccount />);
    expect(getByTestId('page-title')).toHaveTextContent(
      emailAccountAddAndEditTranslation.zimbra_account_edit_title.replace(
        '{{ account }}',
        accountMock[0].targetSpec?.email,
      ),
    );
  });
});
