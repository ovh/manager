import React from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ErrorMessage } from '@/components/error/ErrorMessage.component';
import * as errorUtils from '@/utils/error.utils';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({
    i18nKey,
    values,
    components,
  }: {
    i18nKey: string;
    values?: Record<string, string>;
    components?: Record<string, React.ReactNode>;
  }) => (
    <span data-testid="trans-component" data-i18n-key={i18nKey}>
      {values?.message && <span data-testid="error-message">{values.message}</span>}
      {values?.queryId && <span data-testid="query-id">{values.queryId}</span>}
      {components?.br && <br data-testid="line-break" />}
    </span>
  ),
}));

// Mock error.utils
vi.mock('@/utils/error.utils', () => ({
  getErrorValues: vi.fn(),
}));

const mockGetErrorValues = vi.mocked(errorUtils.getErrorValues);

describe('ErrorMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation
    mockGetErrorValues.mockImplementation((error: unknown) => ({
      message: (error as Error)?.message ?? '',
      ovhQueryId: '',
    }));
  });

  describe('Rendering', () => {
    it('should render the Trans component with correct i18n key', () => {
      const error = new Error('Test error message');

      render(<ErrorMessage error={error} />);

      const transComponent = screen.getByTestId('trans-component');
      expect(transComponent).toBeInTheDocument();
      expect(transComponent).toHaveAttribute('data-i18n-key', 'shared:error.message');
    });

    it.each([
      { message: 'Something went wrong', expected: 'Something went wrong' },
      { message: 'Network failure', expected: 'Network failure' },
      { message: 'Server error 500', expected: 'Server error 500' },
    ])('should display error message "$message"', ({ message, expected }) => {
      const error = new Error(message);

      render(<ErrorMessage error={error} />);

      expect(screen.getByTestId('error-message')).toHaveTextContent(expected);
    });

    it('should handle empty error message', () => {
      const error = new Error('');

      render(<ErrorMessage error={error} />);

      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });
  });

  describe('Query ID handling', () => {
    it.each([
      { ovhQueryId: 'abc123', expectedContent: 'x-ovh-query-id=abc123' },
      { ovhQueryId: 'xyz-789-query', expectedContent: 'x-ovh-query-id=xyz-789-query' },
    ])('should display query ID "$ovhQueryId"', ({ ovhQueryId, expectedContent }) => {
      const error = new Error('API error');

      mockGetErrorValues.mockReturnValueOnce({
        message: 'API error',
        ovhQueryId,
      });

      render(<ErrorMessage error={error} />);

      expect(screen.getByTestId('query-id')).toHaveTextContent(expectedContent);
    });

    it('should not display query ID when ovhQueryId is not present', () => {
      const error = new Error('Simple error');

      render(<ErrorMessage error={error} />);

      expect(screen.queryByTestId('query-id')).not.toBeInTheDocument();
    });
  });

  describe('Different error types', () => {
    it.each([
      { ErrorClass: Error, message: 'Standard error', description: 'standard Error' },
      { ErrorClass: TypeError, message: 'Type mismatch', description: 'TypeError' },
      { ErrorClass: RangeError, message: 'Out of range', description: 'RangeError' },
    ])('should handle $description', ({ ErrorClass, message }) => {
      const error = new ErrorClass(message);

      render(<ErrorMessage error={error} />);

      expect(screen.getByTestId('error-message')).toHaveTextContent(message);
    });

    it('should handle custom error with additional properties', () => {
      const error = Object.assign(new Error('Custom error'), {
        code: 'ERR_CUSTOM',
        details: { field: 'name' },
      });

      render(<ErrorMessage error={error} />);

      expect(screen.getByTestId('error-message')).toHaveTextContent('Custom error');
    });
  });

  describe('Component structure', () => {
    it('should render with br component available for line breaks', () => {
      const error = new Error('Multi-line error');

      render(<ErrorMessage error={error} />);

      expect(screen.getByTestId('line-break')).toBeInTheDocument();
    });
  });
});
