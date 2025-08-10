import React from 'react';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import SettingsPage from '@/pages/dashboard/settings/Settings.page';

// i18n: return the key itself
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// ODS React wrappers: minimal, typed shims that preserve semantics used by the page
type OdsFormFieldProps = React.PropsWithChildren<{
  className?: string;
  error?: string;
}>;
type OdsInputChangeEvent = { detail: { value: string } };
type OdsInputProps = {
  id?: string;
  name?: string;
  value?: string;
  hasError?: boolean;
  onOdsChange?: (ev: OdsInputChangeEvent) => void;
  onOdsBlur?: () => void;
};
type OdsButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  label?: React.ReactNode;
  isDisabled?: boolean;
};

vi.mock('@ovhcloud/ods-components/react', () => {
  const OdsFormField: React.FC<OdsFormFieldProps> = ({ children, error }) => (
    <div>
      {children}
      {error ? <div role="alert">{error}</div> : null}
    </div>
  );

  // eslint-disable-next-line react/no-multi-comp
  const OdsInput: React.FC<OdsInputProps> = ({
    id,
    name,
    value = '',
    hasError,
    onOdsChange,
    onOdsBlur,
  }) => (
    <input
      id={id}
      name={name}
      value={value}
      onChange={(e) => onOdsChange?.({ detail: { value: e.currentTarget.value } })}
      onBlur={() => onOdsBlur?.()}
      aria-invalid={hasError ? 'true' : 'false'}
    />
  );

  // eslint-disable-next-line react/no-multi-comp
  const OdsButton: React.FC<OdsButtonProps> = ({ type = 'button', label, isDisabled }) => (
    <button type={type} disabled={isDisabled}>
      {typeof label === 'string' || typeof label === 'number' ? label : ''}
    </button>
  );

  return { OdsFormField, OdsInput, OdsButton };
});

// ---- Tests ----
describe('SettingsPage', () => {
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(() => {
    logSpy.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows a validation error when projectName is blurred empty', async () => {
    render(<SettingsPage />);

    // label text is the i18n key + " *"
    const nameInput = screen.getByLabelText(/settings:projectName/i);
    // Blur without typing => triggers RHF "onTouched" validation
    fireEvent.blur(nameInput);

    expect(
      await screen.findByRole('alert', { name: '' }), // role="alert" produced by mock OdsFormField
    ).toHaveTextContent('settings:errors.projectNameRequired');
  });

  it('submits values when form is valid', async () => {
    render(<SettingsPage />);

    const nameInput = screen.getByLabelText(/settings:projectName/i);
    const descInput = screen.getByLabelText(/settings:description/i);
    const submitBtn = screen.getByRole('button', { name: /settings:saveButton/i });

    fireEvent.change(nameInput, { target: { value: 'My Project' } });
    fireEvent.change(descInput, { target: { value: 'About this project' } });

    // submit the form
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith('save', {
        projectName: 'My Project',
        description: 'About this project',
      });
    });
  });
});
