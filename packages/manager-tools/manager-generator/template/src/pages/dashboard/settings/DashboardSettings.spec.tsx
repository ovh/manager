import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import DashboardSettingsPage from './DashboardSettings.page';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue ?? key,
  }),
}));

type OdsInputChangeEvent = { detail: { value: string } };

type OdsInputProps = {
  id: string;
  name: string;
  value?: string;
  hasError?: boolean;
  onOdsChange?: (ev: OdsInputChangeEvent) => void;
  onOdsBlur?: () => void;
};

type OdsButtonProps = {
  type?: 'button' | 'submit';
  label: string;
  isDisabled?: boolean;
};

type OdsFormFieldProps = {
  children: React.ReactNode;
  error?: string;
  className?: string;
};

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsFormField: ({ children, error }: OdsFormFieldProps) => (
    <div data-testid="ods-field">
      {children}
      {error ? <div role="alert">{error}</div> : null}
    </div>
  ),

  // eslint-disable-next-line react/no-multi-comp
  OdsInput: ({ id, name, value, hasError, onOdsChange, onOdsBlur }: OdsInputProps) => (
    <input
      id={id}
      name={name}
      value={value ?? ''}
      aria-invalid={hasError ? 'true' : 'false'}
      onChange={(e) => onOdsChange?.({ detail: { value: (e.target as HTMLInputElement).value } })}
      onBlur={() => onOdsBlur?.()}
    />
  ),

  // eslint-disable-next-line react/no-multi-comp
  OdsButton: ({ type = 'button', label, isDisabled }: OdsButtonProps) => (
    <button type={type} disabled={!!isDisabled}>
      {label}
    </button>
  ),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DashboardSettingsPage', () => {
  it('shows required error for projectName when submitting empty form', async () => {
    render(<DashboardSettingsPage />);

    fireEvent.click(screen.getByRole('button', { name: 'settings:saveButton' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('settings:errors.projectNameRequired');
  });

  it('submits values when fields are valid', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<DashboardSettingsPage />);

    const projectInput = screen.getByLabelText('settings:projectName *');
    const descInput = screen.getByLabelText('settings:description');

    fireEvent.change(projectInput, { target: { value: 'My Project' } });
    fireEvent.change(descInput, { target: { value: 'Some description' } });

    fireEvent.click(screen.getByRole('button', { name: 'settings:saveButton' }));

    await waitFor(() =>
      expect(logSpy).toHaveBeenCalledWith('save', {
        projectName: 'My Project',
        description: 'Some description',
      }),
    );
  });

  it('disables the Save button while submitting (briefly)', async () => {
    render(<DashboardSettingsPage />);

    const saveBtn = screen.getByRole('button', { name: 'settings:saveButton' });

    fireEvent.change(screen.getByLabelText('settings:projectName *'), {
      target: { value: 'X' },
    });

    fireEvent.click(saveBtn);

    await waitFor(() => expect(saveBtn).toBeDisabled());
    await waitFor(() => expect(saveBtn).not.toBeDisabled());
  });
});
