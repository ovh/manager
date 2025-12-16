import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { labels as allLabels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';
import { changeOdsInputValueByTestId } from '@/common/utils/tests/uiTestHelpers';

import { KeyValuesEditor } from './KeyValuesEditor';
import { KEY_VALUES_EDITOR_TEST_IDS } from './keyValuesEditor.constants';

const labels = allLabels.secretManager;

const mockDefaultValues = {
  valid: {
    data: '{"key1":"value1","key2":"value2"}',
  },
  invalid: {
    data: 'invalid json',
  },
  empty: {
    data: '',
  },
};

// Mocking ODS Input component
vi.mock('@ovhcloud/ods-components/react', async () => {
  const { odsInputMock } = await import('@/common/utils/tests/odsMocks');
  const original = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...original,
    OdsInput: vi.fn(odsInputMock),
  };
});

type TestWrapperDefaultValues = {
  data: string;
};

// Test wrapper component that provides form context
type TestWrapperProps = {
  defaultValues: TestWrapperDefaultValues;
  allowDeleteLastItem?: boolean;
  onSubmit?: () => void;
};

const TestWrapper = ({ defaultValues, allowDeleteLastItem = false }: TestWrapperProps) => {
  const methods = useForm<TestWrapperDefaultValues>({ defaultValues });
  // eslint-disable-next-line react-hooks/incompatible-library
  const value = methods.watch('data');

  return (
    <FormProvider {...methods}>
      <KeyValuesEditor
        name="data"
        control={methods.control}
        allowDeleteLastItem={allowDeleteLastItem}
      />
      <p data-testid="value">{value}</p>
    </FormProvider>
  );
};

const renderTest = async (
  defaultValues: TestWrapperDefaultValues,
  allowDeleteLastItem?: boolean,
) => {
  return renderWithI18n(
    <TestWrapper defaultValues={defaultValues} allowDeleteLastItem={allowDeleteLastItem} />,
  );
};

describe('KeyValuesEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    test('should render KeyValuesEditor with valid JSON data', async () => {
      // Given

      // When
      await renderTest(mockDefaultValues.valid);

      // Then
      expect(
        screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemValueInput(1)),
      ).toBeInTheDocument();

      const addButton = screen.getByRole('button', {
        name: labels.add_row,
      });
      expect(addButton).toBeInTheDocument();
    });

    test('should render error message for invalid JSON data', async () => {
      // Given

      // When
      await renderTest(mockDefaultValues.invalid);

      // Then
      await waitFor(() => {
        expect(screen.getByText(labels.error_key_value_conversion)).toBeInTheDocument();
      });
    });

    test('should render an empty row when no data provided', async () => {
      // Given
      await renderTest(mockDefaultValues.empty);

      // Then
      expect(
        screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemValueInput(0)),
      ).toBeInTheDocument();
    });
  });

  describe('Adding items', () => {
    test('should add new key-value pair when add button is clicked', async () => {
      // Given
      const user = userEvent.setup();
      await renderTest(mockDefaultValues.valid);

      // When
      const addButton = screen.getByRole('button', {
        name: labels.add_row,
      });

      await act(async () => user.click(addButton));

      // Then
      expect(
        screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(2)),
      ).toBeInTheDocument();
    });
  });

  describe('Editing items', () => {
    test('should form data when input is changed', async () => {
      // Given
      await renderTest(mockDefaultValues.valid);

      // When
      await changeOdsInputValueByTestId(
        KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0),
        'updatedKey',
      );
      await changeOdsInputValueByTestId(
        KEY_VALUES_EDITOR_TEST_IDS.pairItemValueInput(0),
        'updatedValue',
      );

      // Then
      expect(screen.getByTestId('value')).toHaveTextContent(
        '{"updatedKey":"updatedValue","key2":"value2"}',
      );
    });
  });

  describe('Deleting items', () => {
    test('should remove key-value pair when delete button is clicked', async () => {
      // Given
      const user = userEvent.setup();
      await renderTest(mockDefaultValues.valid);

      expect(
        screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(1)),
      ).toBeInTheDocument();

      // When
      const deleteButton = await screen.findByTestId(
        KEY_VALUES_EDITOR_TEST_IDS.pairItemDeleteButton(0),
      );
      await act(async () => user.click(deleteButton));

      // Then
      expect(
        screen.queryByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(1)),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('value')).toHaveTextContent('{"key2":"value2"}');
    });
  });

  describe('Duplicate key validation', () => {
    test('should show error when duplicate keys are detected', async () => {
      // Given
      const { container } = await renderTest(mockDefaultValues.valid);

      // When
      await changeOdsInputValueByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(1), 'key1');

      // Then
      await waitFor(() => {
        expect(
          container.querySelector(`ods-form-field[error="${labels.error_duplicate_keys}"]`),
        ).toBeInTheDocument();
      });
    });
  });

  describe('isDeletable state', () => {
    test('should disable delete button when only one item exists and allowDeleteLastItem is false', async () => {
      // Given
      await renderTest(mockDefaultValues.empty);

      // Then
      const deleteButton = screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemDeleteButton(0));
      expect(deleteButton).toBeDisabled();
    });

    test('should enable delete button when only one item exists and allowDeleteLastItem is true', async () => {
      // Given
      await renderTest(mockDefaultValues.empty, true);

      // Then
      const deleteButton = screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemDeleteButton(0));
      expect(deleteButton).not.toHaveAttribute('is-disabled', 'true');
    });

    test('should enable delete buttons when multiple items exist', async () => {
      // Given
      await renderTest(mockDefaultValues.valid);

      // Then
      const deleteButton0 = screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemDeleteButton(0));
      const deleteButton1 = screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemDeleteButton(1));
      expect(deleteButton0).not.toBeDisabled();
      expect(deleteButton1).not.toBeDisabled();
    });

    test('should disable delete button after deleting down to one item', async () => {
      // Given
      const user = userEvent.setup();
      await renderTest(mockDefaultValues.valid);

      // When - delete one item to leave only one remaining
      const deleteButton = screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemDeleteButton(0));
      await act(async () => user.click(deleteButton));

      // Then - the remaining delete button should be disabled
      await waitFor(() => {
        const remainingDeleteButton = screen.getByTestId(
          KEY_VALUES_EDITOR_TEST_IDS.pairItemDeleteButton(0),
        );
        expect(remainingDeleteButton).toBeDisabled();
      });
    });

    test('should enable delete button after adding a second item', async () => {
      // Given
      const user = userEvent.setup();
      await renderTest(mockDefaultValues.empty);

      // Initial state - delete button should be disabled
      const initialDeleteButton = screen.getByTestId(
        KEY_VALUES_EDITOR_TEST_IDS.pairItemDeleteButton(0),
      );
      expect(initialDeleteButton).toBeDisabled();

      // When - add a second item
      const addButton = screen.getByRole('button', {
        name: labels.add_row,
      });

      await act(async () => user.click(addButton));

      // Then - both delete buttons should be enabled
      await waitFor(() => {
        const deleteButton0 = screen.getByTestId(
          KEY_VALUES_EDITOR_TEST_IDS.pairItemDeleteButton(0),
        );
        const deleteButton1 = screen.getByTestId(
          KEY_VALUES_EDITOR_TEST_IDS.pairItemDeleteButton(1),
        );
        expect(deleteButton0).not.toBeDisabled();
        expect(deleteButton1).not.toBeDisabled();
      });
    });
  });
});
