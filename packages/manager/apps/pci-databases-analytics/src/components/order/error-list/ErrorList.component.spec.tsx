import { FieldErrors } from 'react-hook-form';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import ErrorList from '@/components/order/error-list/ErrorList.component';

describe('ErrorList component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  const requiredMessage = 'This field is required';
  const minLenghtdMessage = 'Minimum 5 digits for this field';
  const nestedError = 'This is a nestedError';
  const mockFieldErrors: FieldErrors = {
    // Erreurs au niveau des champs
    field1: {
      type: 'required',
      message: requiredMessage,
    },
    field2: {
      type: 'minLength',
      message: minLenghtdMessage,
    },
  };

  it('should display Error', async () => {
    render(<ErrorList error={mockFieldErrors} />);
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeInTheDocument();
      expect(screen.getByText(minLenghtdMessage)).toBeInTheDocument();
    });
  });

  it('Empty Error List should not display Error', async () => {
    const mockedEmptyFieldErrors: FieldErrors = {};
    render(<ErrorList error={mockedEmptyFieldErrors} />);
    await waitFor(() => {
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });

  it('Nested Error list should not display Error', async () => {
    const mockedNestedFieldErrors: FieldErrors = {
      field1: {
        type: nestedError,
      },
    };
    render(<ErrorList error={mockedNestedFieldErrors} />);
    await waitFor(() => {
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });
});
