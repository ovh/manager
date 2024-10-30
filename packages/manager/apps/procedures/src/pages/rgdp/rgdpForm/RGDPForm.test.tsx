import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import * as OdsComponentModule from '@ovhcloud/ods-components/react';
import { OsdsInput, OsdsSelect, OsdsTextArea } from '@ovhcloud/ods-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RGDPForm } from './RGDPForm.component';
import { GDPRFormValues } from '@/types/gdpr.type';

const getOsdsElementByFormName = <T,>(fieldName: keyof GDPRFormValues) =>
  (screen.queryByTestId(`field_id_${fieldName}`) as unknown) as T;

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const module: typeof OdsComponentModule = await importOriginal();
  return {
    ...module,
    OsdsFormField: ({ children, error }: any) => (
      <div>
        {children}
        <p>{error}</p>
      </div>
    ),
    OsdsInput: ({ ...props }: any) => (
      <module.OsdsInput {...props} data-testid={props.id} />
    ),
    OsdsButton: ({ ...props }: any) => (
      <button
        children={props.children}
        disabled={props.disabled}
        type={props.type}
      />
    ),
    OsdsSelect: ({ ...props }: any) => (
      <module.OsdsSelect {...props} data-testid={props.id} />
    ),
    OsdsTextarea: ({ ...props }: any) => (
      <module.OsdsTextarea {...props} data-testid={props.id} />
    ),
  };
});

describe('RGDPForm', () => {
  const renderForm = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <RGDPForm />
      </QueryClientProvider>,
    );
  };

  it('Should render the form fields correctly when the form is displayed', async () => {
    const { getByText } = renderForm();

    await waitFor(() => {
      expect(
        getByText('rgdp_form_field_label_firstname :'),
      ).toBeInTheDocument();
      expect(getByText('rgdp_form_field_label_name :')).toBeInTheDocument();
      expect(getByText('rgdp_form_field_label_email :')).toBeInTheDocument();
      expect(
        getByText('rgdp_form_field_label_confirm_email :'),
      ).toBeInTheDocument();
      expect(getByText('rgdp_form_field_label_category')).toBeInTheDocument();
      expect(
        getByText('rgdp_form_field_label_category_detail'),
      ).toBeInTheDocument();
      expect(
        getByText('rgdp_form_field_label_request_description :'),
      ).toBeInTheDocument();

      expect(getByText('rgdp_form_field_label_id_front :')).toBeInTheDocument();
      expect(getByText('rgdp_form_field_label_id_back :')).toBeInTheDocument();
      expect(
        getByText('rgdp_form_field_label_other_documents :'),
      ).toBeInTheDocument();
    });
  });

  it('Should disable the submit button when required fields are not filled', async () => {
    const { getByText } = renderForm();
    const submitBtn = getByText('rgdp_form_submit');
    expect(submitBtn).toBeDisabled();
  });

  it('Should show errors on multiple required fields when blurred with empty values', async () => {
    const { queryAllByText } = renderForm();

    const surnameInput = getOsdsElementByFormName<OsdsInput>('name');
    const firstNameInput = getOsdsElementByFormName<OsdsInput>('firstName');
    const requestDescriptionText = getOsdsElementByFormName<OsdsTextArea>(
      'description',
    );

    await act(async () => {
      surnameInput.value = '';
      firstNameInput.value = '';
      requestDescriptionText.value = '';

      surnameInput.odsInputBlur.emit();
      firstNameInput.odsInputBlur.emit();
      requestDescriptionText.odsBlur.emit();
    });

    await waitFor(() => {
      const errorMessages = queryAllByText(
        'rgdp_form_validation_message_required',
      );
      expect(errorMessages).toHaveLength(3);
    });
  });

  it('Should show pattern validation errors on multiple fields when invalid characters are entered', async () => {
    const { queryAllByText } = renderForm();

    const surnameInput = getOsdsElementByFormName<OsdsInput>('name');
    const firstNameInput = getOsdsElementByFormName<OsdsInput>('firstName');
    const nicInput = getOsdsElementByFormName<OsdsInput>('nichandle');

    await act(async () => {
      surnameInput.value = '<';
      firstNameInput.value = '>';
      nicInput.value = '<';

      surnameInput.odsValueChange.emit();
      firstNameInput.odsValueChange.emit();
      nicInput.odsValueChange.emit();

      surnameInput.odsInputBlur.emit();
      firstNameInput.odsInputBlur.emit();
      nicInput.odsInputBlur.emit();
    });

    await waitFor(() => {
      const errorMessages = queryAllByText(
        'rgdp_form_validation_message_invalid_format',
      );
      expect(errorMessages).toHaveLength(3);
    });
  });

  it('Should show an error when an invalid email is entered', async () => {
    const { getByText } = renderForm();

    const emailInput = getOsdsElementByFormName<OsdsInput>('email');

    await act(async () => {
      emailInput.value = 'invalidEmail';
      emailInput.odsValueChange.emit();
      emailInput.odsInputBlur.emit();
    });

    await waitFor(() => {
      expect(
        getByText('rgdp_form_validation_message_invalid_format'),
      ).toBeInTheDocument();
    });
  });

  it('Should validate email fields and show an error if they don t match', async () => {
    const { getByText } = renderForm();

    const emailInput = getOsdsElementByFormName<OsdsInput>('email');
    const confirmEmailInput = getOsdsElementByFormName<OsdsInput>(
      'confirmEmail',
    );

    await act(async () => {
      emailInput.value = 'test@example.com';
      confirmEmailInput.value = 'wrong@example.com';

      emailInput.odsValueChange.emit();
      confirmEmailInput.odsValueChange.emit();

      emailInput.odsInputBlur.emit();
      confirmEmailInput.odsInputBlur.emit();
    });

    await waitFor(() => {
      expect(
        getByText('rgdp_form_validation_message_email_match'),
      ).toBeInTheDocument();
    });
  });

  it('Should display confirm modal when the form is valid', async () => {
    const { getByText } = renderForm();

    const surnameInput = getOsdsElementByFormName<OsdsInput>('name');
    const firstNameInput = getOsdsElementByFormName<OsdsInput>('firstName');
    const requestDescriptionText = getOsdsElementByFormName<OsdsTextArea>(
      'description',
    );
    const emailInput = getOsdsElementByFormName<OsdsInput>('email');
    const confirmEmailInput = getOsdsElementByFormName<OsdsInput>(
      'confirmEmail',
    );
    const objectSelect = getOsdsElementByFormName<OsdsSelect>('category');

    const submitBtn = getByText('rgdp_form_submit');

    act(() => {
      surnameInput.value = 'name';
      firstNameInput.value = 'firstNameInput';
      requestDescriptionText.value = 'des';
      emailInput.value = 'ovh@internet.com';
      confirmEmailInput.value = 'ovh@internet.com';
      objectSelect.value = 'other_request';

      surnameInput.odsValueChange.emit();
      firstNameInput.odsValueChange.emit();
      requestDescriptionText.odsValueChange.emit();
      emailInput.odsValueChange.emit();
      confirmEmailInput.odsValueChange.emit();
      objectSelect.odsValueChange.emit();

      surnameInput.odsInputBlur.emit();
      firstNameInput.odsInputBlur.emit();
      requestDescriptionText.odsBlur.emit();
      emailInput.odsInputBlur.emit();
      confirmEmailInput.odsInputBlur.emit();
      objectSelect.odsBlur.emit();

      fireEvent.submit(submitBtn);
    });

    await waitFor(() => {
      const confirmModal = screen.getByText('rgpd_confirm_modal_yes');
      expect(submitBtn).not.toBeDisabled();
      expect(confirmModal).toBeInTheDocument();
    });
  });
});
