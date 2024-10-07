import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { render } from '@/utils/test.provider';
import { aliasMock, accountsMock } from '@/api/_mock_';
import ModalDeleteAlias from '../ModalDeleteAlias.component';
import accountAliasDeleteTranslation from '@/public/translations/accounts/alias/delete/Messages_fr_FR.json';

vi.mocked(useSearchParams).mockReturnValue([
  new URLSearchParams({
    editEmailAccountId: accountsMock[0].id,
    deleteAliasId: aliasMock[0].id,
  }),
  vi.fn(),
]);

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
