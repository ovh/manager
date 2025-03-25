import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { FormField, FormFieldProps } from './FormField.component';

const renderComponent = ({
  children,
  label,
  className = '',
  fullWidth,
  isLoading,
  helperText,
  visualHint,
  error,
}: FormFieldProps) =>
  render(
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

describe('FormField Component', () => {
  it('should display an inline form field', async () => {
    const { asFragment } = renderComponent({
      label: 'form-field-label',
      children: 'form-field-children',
      helperText: 'form-field-helper-text',
      visualHint: 'form-field-visual-hint',
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should display a block form field', async () => {
    const { asFragment } = renderComponent({
      label: 'form-field-label',
      fullWidth: true,
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
