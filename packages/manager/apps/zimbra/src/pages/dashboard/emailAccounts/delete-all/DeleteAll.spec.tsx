import React from 'react';

import { useLocation } from 'react-router-dom';

import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { deleteZimbraPlatformAccount } from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { act, fireEvent, render, waitFor } from '@/utils/test.provider';
import { OdsHTMLElement } from '@/utils/test.utils';

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
    expect(getByTestId('primary-btn')).toHaveAttribute('is-disabled', 'true');
  });

  it('check transition from step 1 to step 2 and delete', async () => {
    const { getByTestId } = render(<DeleteAllEmailAccountModal />);
    expect(getByTestId('text-step-1')).toBeVisible();
    act(() => {
      fireEvent.click(getByTestId('primary-btn'));
    });

    expect(getByTestId('text-step-2')).toBeVisible();

    const confirmInput = getByTestId('input-delete-confirm') as OdsHTMLElement;
    expect(confirmInput).toBeVisible();

    act(() => {
      fireEvent.change(confirmInput, {
        target: { value: actionsCommonTranslation.delete },
      });
      confirmInput.odsChange.emit({
        name: 'confirmation-delete',
        value: 'delete',
      });
    });
    waitFor(() => {
      expect(getByTestId('primary-btn')).toHaveAttribute('is-disabled', 'false');
    });
    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.click(getByTestId('primary-btn'));
    });
    expect(deleteZimbraPlatformAccount).toHaveBeenCalledOnce();
  });
});
