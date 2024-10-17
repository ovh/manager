import { render, screen, act, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import * as OdsComponentModule from '@ovhcloud/ods-components/react';
import { OsdsInput, OsdsTextArea } from '@ovhcloud/ods-components';
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
    OsdsButton: ({ ...props }: any) => <button {...props} />,
    OsdsSelect: ({ ...props }: any) => (
      <module.OsdsSelect {...props} data-testid={props.id} />
    ),
    OsdsTextarea: ({ ...props }: any) => (
      <module.OsdsTextarea {...props} data-testid={props.id} />
    ),
  };
});

describe('RGDPForm', () => {
  const renderForm = () => render(<RGDPForm />);

  it('Should render the form fields correctly when the form is displayed', async () => {
    const { getByText } = renderForm();

    await waitFor(() => {
      expect(getByText('rgdp_form_field_label_firstname:')).toBeInTheDocument();
      expect(getByText('rgdp_form_field_label_surname:')).toBeInTheDocument();
      expect(getByText('rgdp_form_field_label_email:')).toBeInTheDocument();
      expect(
        getByText('rgdp_form_field_label_confirm_email:'),
      ).toBeInTheDocument();
      expect(getByText('rgdp_form_field_label_subject')).toBeInTheDocument();
      expect(
        getByText('rgdp_form_field_label_subject_detail'),
      ).toBeInTheDocument();
      expect(
        getByText('rgdp_form_field_label_request_description:'),
      ).toBeInTheDocument();
    });
  });

  it('Should disable the submit button when required fields are not filled', async () => {
    const { getByRole } = renderForm();
    const submitBtn = getByRole('button', { name: 'rgdp_form_submit' });
    expect(submitBtn).toBeDisabled();
  });

  it('Should show errors on multiple required fields when blurred with empty values', async () => {
    const { queryAllByText } = renderForm();

    const surnameInput = getOsdsElementByFormName<OsdsInput>('surname');
    const firstNameInput = getOsdsElementByFormName<OsdsInput>('firstName');
    const requestDescriptionText = getOsdsElementByFormName<OsdsTextArea>(
      'requestDescription',
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

    const surnameInput = getOsdsElementByFormName<OsdsInput>('surname');
    const firstNameInput = getOsdsElementByFormName<OsdsInput>('firstName');
    const nicInput = getOsdsElementByFormName<OsdsInput>('nicHandle');

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
});