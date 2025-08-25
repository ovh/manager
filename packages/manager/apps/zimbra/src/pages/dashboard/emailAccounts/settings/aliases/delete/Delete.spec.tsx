import React from 'react';

import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import { accountsMock, aliasesMock, deleteZimbraPlatformAlias } from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { act, fireEvent, render, waitFor } from '@/utils/test.provider';

import ModalDeleteAlias from './Delete.modal';

vi.mocked(useParams).mockReturnValue({
  accountId: accountsMock[0].id,
  aliasId: aliasesMock[0].id,
});

describe('Alias delete modal', () => {
  it('should render correctly', async () => {
    const { findByText } = render(<ModalDeleteAlias />);
    expect(await findByText(commonTranslation.delete_alias)).toBeVisible();
  });

  it('should delete alias', async () => {
    const { getByTestId, queryByTestId } = render(<ModalDeleteAlias />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('delete-btn')).not.toBeDisabled();

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.click(getByTestId('delete-btn'));
    });

    expect(deleteZimbraPlatformAlias).toHaveBeenCalledOnce();
  });
});
