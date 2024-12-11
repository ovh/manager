import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { FormField } from './FormField.component';

const renderComponent = ({
  children,
  label,
  className = '',
  fullWidth,
  isLoading,
  helperText,
  visualHint,
  error,
}: React.PropsWithChildren<{
  className?: string;
  label: string;
  fullWidth?: boolean;
  isLoading?: boolean;
  helperText?: string;
  visualHint?: string;
  error?: string;
}>) => {
  return render(
    <FormField
      className={className}
      label={label}
      fullWidth={fullWidth}
      isLoading={isLoading}
      helperText={helperText}
      visualHint={visualHint}
      error={error}
    >
      {children}
    </FormField>,
  );
};

describe('FormField Component', () => {
  it('should display an inline form field', async () => {
    const { getByText } = renderComponent({
      label: 'form-field-label',
      children: 'form-field-children',
      helperText: 'form-field-helper-text',
      visualHint: 'form-field-visual-hint',
    });

    await waitFor(() => {
      const labelElement = getByText('form-field-label');
      expect(labelElement).toBeInTheDocument();
      const OsdsFormField = labelElement.closest('osds-form-field');
      expect(OsdsFormField).toHaveAttribute('inline');
      expect(getByText('form-field-children')).toBeDefined();
      expect(getByText('form-field-helper-text')).toBeDefined();
      expect(getByText('form-field-visual-hint')).toBeDefined();
    });
  });

  it('should display form field', async () => {
    const { getByText } = renderComponent({
      label: 'form-field-label',
      fullWidth: true,
    });

    await waitFor(() => {
      const labelElement = getByText('form-field-label');
      expect(labelElement).toBeInTheDocument();
      const OsdsFormField = labelElement.closest('osds-form-field');
      expect(OsdsFormField).not.toHaveAttribute('inline');
    });
  });
});
