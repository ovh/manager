import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  OdsSelectValueChangeEventDetail,
  OsdsSelect,
} from '@ovhcloud/ods-components';
import FormCreateRequest from './Form.page';
import * as useProcedures from '@/data/api/proceduresApi';

const renderFormComponent = () => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <FormCreateRequest />
    </QueryClientProvider>,
  );
};

const user = {
  legalForm: 'other',
  subsidiary: 'FR',
};

vi.mock('@/context/User/useUser', () => ({
  default: () => ({
    user,
  }),
}));

describe('Form.page', () => {
  it('should render select LegalForms correctly when the sub is FR and legalForms is other', async () => {
    renderFormComponent();

    expect(
      screen.getByTestId('account-disable-2fa-create-form-select'),
    ).not.toBeNull();
  });

  it('should render FormDocumentFieldList when legalForm is selected', async () => {
    renderFormComponent();

    const legalFormSelect = (screen.queryByTestId(
      'account-disable-2fa-create-form-select',
    ) as unknown) as OsdsSelect;

    await act(() =>
      legalFormSelect.odsValueChange.emit({
        value: 'administration',
      } as OdsSelectValueChangeEventDetail),
    );

    const selectInput = screen.getByTestId(
      'account-disable-2fa-create-form-select',
    );
    await act(() => fireEvent.click(selectInput));

    const selectOption = screen.getByText(
      'account-disable-2fa-create-form-legalform-administration',
    );
    await act(() => fireEvent.click(selectOption));

    expect(screen.getByTestId('form-document-field-list')).not.toBeNull();
  });

  it('should not allow form submission if there is no file uploaded', async () => {
    user.legalForm = 'corporation';

    const { getByText } = renderFormComponent();

    const submitBtn = getByText('account-disable-2fa-create-form-submit');

    expect(submitBtn).toBeDisabled();
  });

  it('should allow form submission if there is at least one file uploaded', async () => {
    const { getByText, getByTestId } = renderFormComponent();

    const fileInput = getByTestId('18');
    await act(() =>
      fireEvent.change(fileInput, {
        target: {
          files: [new File(['test'], 'chucknorris.png', { type: 'image/png' })],
        },
      }),
    );

    const submitBtn = getByText('account-disable-2fa-create-form-submit');
    expect(submitBtn).not.toBeDisabled();
  });

  it('should show ConfirmModal on form submit', async () => {
    const { getByText, getByTestId } = renderFormComponent();

    const fileInput = getByTestId('18');
    await act(() =>
      fireEvent.change(fileInput, {
        target: {
          files: [new File(['test'], 'chucknorris.png', { type: 'image/png' })],
        },
      }),
    );

    const submitBtn = getByText('account-disable-2fa-create-form-submit');
    await act(() => fireEvent.click(submitBtn));

    expect(
      getByText(
        'account-disable-2fa-create-form-confirm-modal-send-document-description-insure',
      ),
    ).not.toBeNull();
  });

  it('should hide ConfirmModal when declining submission', async () => {
    const { getByText, getByTestId, queryByText } = renderFormComponent();

    const fileInput = getByTestId('18');
    await act(() =>
      fireEvent.change(fileInput, {
        target: {
          files: [new File(['test'], 'chucknorris.png', { type: 'image/png' })],
        },
      }),
    );

    await act(() =>
      fireEvent.click(getByText('account-disable-2fa-create-form-submit')),
    );

    await act(async () =>
      fireEvent.click(getByText('account-disable-2fa-confirm-modal-no')),
    );

    expect(
      queryByText(
        'account-disable-2fa-create-form-confirm-modal-send-document-description-insure',
      ),
    ).not.toBeInTheDocument();
  });

  it('should show SuccessModal on successful document upload', async () => {
    const { getByText, getByTestId } = renderFormComponent();
    vi.spyOn(useProcedures, 'getProceduresAPI').mockReturnValue({
      getDocumentsLinks: () => Promise.resolve([]),
      getStatus: undefined,
      uploadDocuments: () => Promise.resolve(),
    });

    const fileInput = getByTestId('18');
    await act(() =>
      fireEvent.change(fileInput, {
        target: {
          files: [new File(['test'], 'chucknorris.png', { type: 'image/png' })],
        },
      }),
    );

    const submitBtn = getByText('account-disable-2fa-create-form-submit');
    await act(() => fireEvent.click(submitBtn));

    const confirmBtn = getByText('account-disable-2fa-confirm-modal-yes');
    await act(() => fireEvent.click(confirmBtn));

    expect(
      getByText(
        'account-disable-2fa-create-form-success-modal-send-document-title',
      ),
    ).not.toBeNull();
  });

  it('should enable file inputs until links retrieval is successful', async () => {
    const { getByText, getByTestId } = renderFormComponent();
    vi.spyOn(useProcedures, 'getProceduresAPI').mockReturnValue({
      getDocumentsLinks: () => Promise.reject(new Error('404 chucknorris')),
      getStatus: undefined,
      uploadDocuments: () => Promise.reject(new Error('404 chucknorris')),
    });

    const fileInput = getByTestId('18');
    // File input should not be disabled if getUploadDocumentsLinks has not yet been called and
    // at least a document has been selected
    expect(fileInput).not.toHaveAttribute('disabled');
    await act(() =>
      fireEvent.change(fileInput, {
        target: {
          files: [new File(['test'], 'chucknorris.png', { type: 'image/png' })],
        },
      }),
    );

    const submitBtn = getByText('account-disable-2fa-create-form-submit');
    await act(() => fireEvent.click(submitBtn));

    const confirmBtn = getByText('account-disable-2fa-confirm-modal-yes');
    await act(() => fireEvent.click(confirmBtn));

    await waitFor(() =>
      expect(
        getByText(
          'account-disable-2fa-create-form-error-message-send-document',
        ),
      ).not.toBeNull(),
    );
    // File input should not be disabled if getUploadDocumentsLinks is not successful
    expect(fileInput).not.toHaveAttribute('disabled');
  });

  it(
    'should show error message when document upload is not successful',
    async () => {
      const { getByText, getByTestId } = renderFormComponent();
      vi.spyOn(useProcedures, 'getProceduresAPI').mockReturnValue({
        getDocumentsLinks: () => Promise.resolve([]),
        getStatus: () => Promise.resolve(undefined),
        uploadDocuments: () => Promise.reject(new Error('404 chucknorris')),
      });

      const fileInput = getByTestId('18');
      await act(() =>
        fireEvent.change(fileInput, {
          target: {
            files: [
              new File(['test'], 'chucknorris.png', { type: 'image/png' }),
            ],
          },
        }),
      );

      const submitBtn = getByText('account-disable-2fa-create-form-submit');
      await act(() => fireEvent.click(submitBtn));

      const confirmBtn = getByText('account-disable-2fa-confirm-modal-yes');
      await act(() => fireEvent.click(confirmBtn));

      await waitFor(
        () =>
          expect(
            getByText(
              'account-disable-2fa-create-form-error-message-send-document',
            ),
          ).not.toBeNull(),
        { timeout: 30000 },
      );
      // File input should be disabled after getUploadDocumentsLinks is successful
      expect(fileInput).toHaveAttribute('disabled');
    },
    { timeout: 60000 },
  );
});
