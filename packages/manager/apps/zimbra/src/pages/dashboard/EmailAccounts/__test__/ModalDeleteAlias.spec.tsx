import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { render } from '@/utils/test.provider';
import { platformMock, aliasMock, accountMock } from '@/api/_mock_';
import ModalDeleteAlias from '../ModalDeleteAlias';
import accountAliasDeleteTranslation from '@/public/translations/accounts/alias/delete/Messages_fr_FR.json';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
    useGenerateUrl: vi.fn(),
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  MemoryRouter: vi.fn(() => <ModalDeleteAlias />),
  useSearchParams: vi.fn(() => [
    new URLSearchParams({
      editEmailAccountId: accountMock[0].id,
      deleteAliasId: aliasMock[0].id,
    }),
  ]),
}));

vi.mock('@ovh-ux/manager-react-components', () => {
  return {
    useNotifications: vi.fn(() => ({
      addError: () => vi.fn(),
      addSuccess: () => vi.fn(),
    })),
  };
});

describe('Alias delete modal', () => {
  it('check if it is displayed', () => {
    const { getByTestId } = render(<ModalDeleteAlias />);
    const modal = getByTestId('modal');
    expect(modal).toHaveProperty(
      'headline',
      accountAliasDeleteTranslation.zimbra_account_alias_delete_modal_title,
    );
  });
});
