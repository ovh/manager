import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { fireEvent, render, act } from '@/utils/test.provider';
import { domainMock, deleteZimbraPlatformAccount } from '@/data/api';
import DeleteEmailAccountModal from './Delete.modal';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

vi.mocked(useSearchParams).mockReturnValue([
  new URLSearchParams({
    deleteDomainId: domainMock.id,
  }),
  vi.fn(),
]);

describe('Domains delete modal', () => {
  it('check if it is displayed', async () => {
    const { findByText } = render(<DeleteEmailAccountModal />);
    expect(
      await findByText(commonTranslation.delete_email_account),
    ).toBeVisible();
  });

  it('check transition from step 1 to step 2 and delete', async () => {
    const { getByTestId } = render(<DeleteEmailAccountModal />);
    expect(getByTestId('text-step-1')).toBeVisible();
    await act(() => {
      fireEvent.click(getByTestId('primary-btn'));
    });

    expect(getByTestId('text-step-2')).toBeVisible();

    await act(() => {
      fireEvent.click(getByTestId('primary-btn'));
    });

    expect(deleteZimbraPlatformAccount).toHaveBeenCalledOnce();
  });
});
