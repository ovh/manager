/* eslint-disable */
import type { ReactNode } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import HelpPage from './Help.page';

// --- Mock translations ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// --- Typed ODS mocks ---
interface OdsFormFieldProps {
  children: ReactNode;
  error?: string;
}

vi.mock('@ovhcloud/ods-components/react', () => {
  return {
    OdsFormField: ({ children, error }: OdsFormFieldProps) => (
      <div>
        {children}
        {error && <div data-testid="error">{error}</div>}
      </div>
    ),
    OdsInput: ({
                 value,
                 onOdsChange,
                 onOdsBlur,
                 ...props
               }: React.InputHTMLAttributes<HTMLInputElement> & {
      value: string;
      hasError?: boolean;
      onOdsChange?: (e: { detail: { value: string } }) => void;
      onOdsBlur?: () => void;
    }) => (
      <input
        {...props}
        value={value}
        onChange={(e) => onOdsChange?.({ detail: { value: e.currentTarget.value } })}
        onBlur={onOdsBlur}
      />
    ),
    OdsTextarea: ({
                    value,
                    onOdsChange,
                    onOdsBlur,
                    ...props
                  }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
      value: string;
      hasError?: boolean;
      onOdsChange?: (e: { detail: { value: string } }) => void;
      onOdsBlur?: () => void;
    }) => (
      <textarea
        {...props}
        value={value}
        onChange={(e) => onOdsChange?.({ detail: { value: e.currentTarget.value } })}
        onBlur={onOdsBlur}
      />
    ),
    OdsButton: ({
                  label,
                  isDisabled,
                  ...props
                }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      label: string;
      isDisabled?: boolean;
    }) => (
      <button {...props} disabled={isDisabled}>
        {label}
      </button>
    ),
    OdsMessage: ({
                   children,
                   onOdsRemove,
                 }: { children: ReactNode; onOdsRemove?: () => void }) => (
      <div data-testid="success-msg">
        {children}
        <button data-testid="dismiss" onClick={onOdsRemove}>
          ×
        </button>
      </div>
    ),
    OdsText: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  };
});

describe('HelpPage', () => {
  it('renders all fields', () => {
    render(<HelpPage />);
    expect(screen.getByLabelText(/dashboard:email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dashboard:subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dashboard:message/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<HelpPage />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /dashboard:submitButton/i }));
    });
    expect(await screen.findAllByTestId('error')).toHaveLength(3);
  });

  it('shows email validation error for invalid email', async () => {
    render(<HelpPage />);
    fireEvent.input(screen.getByLabelText(/dashboard:email/i), {
      target: { value: 'invalid' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /dashboard:submitButton/i }));
    });

    const errors = await screen.findAllByTestId('error');
    expect(errors.map((e) => e.textContent)).toContain('dashboard:errors.emailInvalid');
  });

  it('submits valid form and shows success message, then dismisses it', async () => {
    render(<HelpPage />);
    fireEvent.input(screen.getByLabelText(/dashboard:email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText(/dashboard:subject/i), {
      target: { value: 'Hello' },
    });
    fireEvent.input(screen.getByLabelText(/dashboard:message/i), {
      target: { value: 'World' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /dashboard:submitButton/i }));
    });

    expect(await screen.findByTestId('success-msg')).toBeInTheDocument();

    // Dismiss via the "×" button
    fireEvent.click(screen.getByTestId('dismiss'));
    expect(screen.queryByTestId('success-msg')).not.toBeInTheDocument();
  });
});
