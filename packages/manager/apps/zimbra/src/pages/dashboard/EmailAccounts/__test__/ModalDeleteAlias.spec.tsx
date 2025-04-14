import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useParams } from 'react-router-dom';
import { render, act, waitFor, fireEvent } from '@/utils/test.provider';
import { aliasesMock, accountsMock } from '@/api/_mock_';
import ModalDeleteAlias from '../ModalDeleteAlias.component';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { deleteZimbraPlatformAlias } from '@/api/alias';

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

    await act(() => {
      fireEvent.click(getByTestId('delete-btn'));
    });

    expect(deleteZimbraPlatformAlias).toHaveBeenCalledOnce();
  });
});
