import React from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider } from 'react-hook-form';
import { KEY_VALUES_EDITOR_TEST_IDS } from '@secret-manager/components/form/keyValuesEditor/keyValuesEditor.constants';
import { SECRET_FORM_FIELD_TEST_IDS } from '@secret-manager/components/form/form.constants';
import { SECRET_VALUE_TOGGLE_TEST_IDS } from '@secret-manager/components/secretValueToggle/secretValueToggle.constants';
import { renderWithI18n } from '@/utils/tests/testUtils';
import { SecretDataFormField } from './SecretDataFormField.component';

type FormFieldInput = {
  data: string;
};

const mockDefaultValues = {
  validKeyValue: {
    data: '{"key1":"value1","key2":"value2"}',
  },
  invalidKeyValue: {
    data: '{"nested":{"object":"value"}}',
  },
  empty: {
    data: '',
  },
};

// Mocking ODS components
vi.mock('@ovhcloud/ods-components/react', async () => {
  const {
    odsInputMock,
    odsTextareaMock,
    odsSwitchMock,
    odsSwitchItemMock,
  } = await import('@/utils/tests/odsMocks');
  const original = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...original,
    OdsInput: vi.fn(odsInputMock),
    OdsTextarea: vi.fn(odsTextareaMock),
    OdsSwitch: vi.fn(odsSwitchMock),
    OdsSwitchItem: vi.fn(odsSwitchItemMock),
  };
});

// Test wrapper component that provides form context
type TestWrapperProps = {
  defaultValues: FormFieldInput;
};

const TestWrapper = ({ defaultValues }: TestWrapperProps) => {
  const methods = useForm<FormFieldInput>({ defaultValues });

  return (
    <FormProvider {...methods}>
      <SecretDataFormField name="data" control={methods.control} />
    </FormProvider>
  );
};

const renderTest = async (defaultValues: FormFieldInput) => {
  return renderWithI18n(<TestWrapper defaultValues={defaultValues} />);
};

describe('SecretDataFormField', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering based on input type', () => {
    test('should render key-value editor when input is a valid key-value object', async () => {
      // Given
      await renderTest(mockDefaultValues.validKeyValue);

      // Then
      expect(
        screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemValueInput(0)),
      ).toBeInTheDocument();
    });

    test('should render raw editor when input is not a valid key-value object', async () => {
      // Given
      await renderTest(mockDefaultValues.invalidKeyValue);

      // Then
      expect(
        screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.INPUT_DATA),
      ).toBeInTheDocument();
    });

    test('should render key-value editor when input is empty', async () => {
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

  describe('Toggle component', () => {
    test('should render the SecretValueToggle component', async () => {
      // Given
      await renderTest(mockDefaultValues.validKeyValue);

      // Then
      expect(
        screen.getByTestId(SECRET_VALUE_TOGGLE_TEST_IDS.toggle),
      ).toBeInTheDocument();
    });

    test('should show key-value as active when rendering key-value editor', async () => {
      // Given
      await renderTest(mockDefaultValues.validKeyValue);

      // Then
      const keyValueToggle = screen.getByTestId(
        SECRET_VALUE_TOGGLE_TEST_IDS.keyValueToggle,
      );
      expect(keyValueToggle).toHaveAttribute('data-checked', 'true');
    });

    test('should show JSON as active when rendering raw editor', async () => {
      // Given
      await renderTest(mockDefaultValues.invalidKeyValue);

      // Then
      const jsonToggle = screen.getByTestId(
        SECRET_VALUE_TOGGLE_TEST_IDS.jsonToggle,
      );
      expect(jsonToggle).toHaveAttribute('data-checked', 'true');
    });
  });

  describe('Toggle interactions', () => {
    test('should switch to raw editor when clicking JSON toggle from key-value editor', async () => {
      // Given
      const user = userEvent.setup();
      await renderTest(mockDefaultValues.validKeyValue);

      // Verify we start with key-value editor
      expect(
        screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
      ).toBeInTheDocument();

      // When
      const jsonToggle = screen.getByTestId(
        SECRET_VALUE_TOGGLE_TEST_IDS.jsonToggle,
      );
      await act(async () => {
        await user.click(jsonToggle);
      });

      // Then
      await waitFor(() => {
        expect(
          screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.INPUT_DATA),
        ).toBeInTheDocument();
      });
      expect(
        screen.queryByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
      ).not.toBeInTheDocument();
    });
  });
});
