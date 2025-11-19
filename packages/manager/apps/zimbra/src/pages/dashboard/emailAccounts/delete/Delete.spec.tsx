import React from 'react';

import { useSearchParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import { act, fireEvent } from '@testing-library/react';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import { deleteZimbraPlatformAccount } from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import DeleteEmailAccountModal from './Delete.modal';

vi.mocked(useSearchParams).mockReturnValue([
  new URLSearchParams({
    accountId: '1',
  }),
  vi.fn(),
]);

describe('Email Account delete modal', () => {
  it('check if it is displayed', async () => {
    const { findByText } = render(<DeleteEmailAccountModal />);
    expect(await findByText(commonTranslation.delete_email_account)).toBeVisible();
  });

  it('check transition from step 1 to step 2 and delete', async () => {
    const { getByTestId } = render(<DeleteEmailAccountModal />);
    expect(getByTestId('text-step-1')).toBeVisible();
    act(() => {
      fireEvent.click(getByTestId('primary-btn'));
    });

    expect(getByTestId('text-step-2')).toBeVisible();

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.click(getByTestId('primary-btn'));
    });

    expect(deleteZimbraPlatformAccount).toHaveBeenCalledOnce();
  });
});
