import React from 'react';

import { render, screen } from '@testing-library/react';
import { FieldError } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BoundsFormFieldHelper } from '@/components/form/bounds-form-field-helper/BoundsFormFieldHelper.component';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { min?: string; max?: string }) => {
      if (key === 'form.bounds.helper' && options) {
        return `Min: ${options.min}, Max: ${options.max}`;
      }
      return key;
    },
  }),
}));

// Mock ODS React components
vi.mock('@ovhcloud/ods-react', () => ({
  FormFieldHelper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-field-helper">{children}</div>
  ),
  Text: ({ children, preset }: { children: React.ReactNode; preset?: string }) => (
    <span data-testid="text" data-preset={preset}>
      {children}
    </span>
  ),
  TEXT_PRESET: {
    caption: 'caption',
  },
}));

describe('BoundsFormFieldHelper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('bounds helper text rendering', () => {
    it.each([
      { min: '7 days', max: '400 days', expectedText: 'Min: 7 days, Max: 400 days' },
      { min: '1', max: '100', expectedText: 'Min: 1, Max: 100' },
      { min: '0', max: '1000', expectedText: 'Min: 0, Max: 1000' },
    ])(
      'should render bounds helper text "$expectedText" when min="$min" and max="$max"',
      ({ min, max, expectedText }) => {
        render(
          <BoundsFormFieldHelper min={min} max={max} error={undefined} hasRetentionError={false} />,
        );

        expect(screen.getByTestId('form-field-helper')).toBeInTheDocument();
        expect(screen.getByText(expectedText)).toBeInTheDocument();
      },
    );

    it.each([
      { min: undefined, max: '400 days', description: 'min is undefined' },
      { min: '7 days', max: undefined, description: 'max is undefined' },
      { min: undefined, max: undefined, description: 'both min and max are undefined' },
    ])('should not render bounds helper text when $description', ({ min, max }) => {
      render(
        <BoundsFormFieldHelper min={min} max={max} error={undefined} hasRetentionError={false} />,
      );

      expect(screen.getByTestId('form-field-helper')).toBeInTheDocument();
      expect(screen.queryByText(/Min:/)).not.toBeInTheDocument();
    });
  });

  describe('error message rendering', () => {
    it.each([
      { message: 'Value must be between 7 and 400', type: 'manual' as const },
      { message: 'Invalid value', type: 'validate' as const },
      { message: 'This field is required', type: 'required' as const },
    ])('should render error message "$message"', ({ message, type }) => {
      const error: FieldError = { type, message };

      render(
        <BoundsFormFieldHelper
          min={undefined}
          max={undefined}
          error={error}
          hasRetentionError={true}
        />,
      );

      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should not render error message when error has no message', () => {
      const error: FieldError = { type: 'required' };

      render(
        <BoundsFormFieldHelper
          min="7 days"
          max="400 days"
          error={error}
          hasRetentionError={true}
        />,
      );

      expect(screen.getByText('Min: 7 days, Max: 400 days')).toBeInTheDocument();
      // Only one text element should be present (the bounds helper)
      const textElements = screen.getAllByTestId('text');
      expect(textElements).toHaveLength(1);
    });
  });

  describe('combined bounds and error rendering', () => {
    it('should render both bounds and error message', () => {
      const error: FieldError = { type: 'manual', message: 'Invalid value' };

      render(<BoundsFormFieldHelper min="1" max="100" error={error} hasRetentionError={true} />);

      expect(screen.getByText('Min: 1, Max: 100')).toBeInTheDocument();
      expect(screen.getByText('Invalid value')).toBeInTheDocument();
    });
  });

  describe('text preset', () => {
    it('should use caption preset for text elements', () => {
      const error: FieldError = { type: 'manual', message: 'Error message' };

      render(<BoundsFormFieldHelper min="1" max="10" error={error} hasRetentionError={true} />);

      const textElements = screen.getAllByTestId('text');
      textElements.forEach((element) => {
        expect(element).toHaveAttribute('data-preset', 'caption');
      });
    });
  });

  describe('empty state', () => {
    it('should render empty helper when no props have values', () => {
      render(
        <BoundsFormFieldHelper
          min={undefined}
          max={undefined}
          error={undefined}
          hasRetentionError={true}
        />,
      );

      const helper = screen.getByTestId('form-field-helper');
      expect(helper).toBeInTheDocument();
      expect(helper.textContent).toBe('');
    });
  });
});
