import React from 'react';

import { useLocation } from 'react-router-dom';

import '@testing-library/jest-dom';
import { act, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { deleteZimbraPlatformAccount } from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import DeleteAllEmailAccountModal from './DeleteAll.modal';

vi.mocked(useLocation).mockReturnValue({
  state: {
    selectedEmailAccounts: [{ id: '1', email: 'example@ovh.com' }],
  },
  key: '',
  pathname: '',
  search: '',
  hash: '',
});

describe('Email Accounts delete modal', () => {
  it('check if it is displayed', async () => {
    const { findByText } = render(<DeleteAllEmailAccountModal />);
    expect(await findByText(commonTranslation.delete_email_accounts)).toBeVisible();
  });

  it('check transition from step 1 to step 2 and delete button is disabled', () => {
    const { getByTestId } = render(<DeleteAllEmailAccountModal />);
    expect(getByTestId('text-step-1')).toBeVisible();
    act(() => {
      fireEvent.click(getByTestId('primary-btn'));
    });

    expect(getByTestId('text-step-2')).toBeVisible();
    expect(getByTestId('primary-btn')).toBeDisabled();
  });

  it('check transition from step 1 to step 2 and delete', async () => {
    const { getByTestId } = render(<DeleteAllEmailAccountModal />);
    const user = userEvent.setup();

    expect(getByTestId('text-step-1')).toBeVisible();
    await user.click(getByTestId('primary-btn'));

    expect(getByTestId('text-step-2')).toBeVisible();

    const confirmInput = getByTestId('input-delete-confirm');
    expect(confirmInput).toBeVisible();

    await user.type(confirmInput, actionsCommonTranslation.delete);
    waitFor(() => {
      expect(getByTestId('primary-btn')).toBeEnabled();
    });

    await user.click(getByTestId('primary-btn'));
    expect(deleteZimbraPlatformAccount).toHaveBeenCalledOnce();
  });
});
