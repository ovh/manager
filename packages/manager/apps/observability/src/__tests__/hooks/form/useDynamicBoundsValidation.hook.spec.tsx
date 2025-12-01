import React from 'react';

import { render, screen } from '@testing-library/react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { vi } from 'vitest';

import { useDynamicBoundsValidation } from '@/hooks/form/useDynamicBoundsValidation.hook';

const mockT = vi.fn((key: string, options?: { value?: number }) => {
  if (key === '@ovh-ux/manager-common-translations/form:error_min_inclusive')
    return `Value must be at least ${options?.value}`;
  if (key === '@ovh-ux/manager-common-translations/form:error_max_inclusive')
    return `Value must be at most ${options?.value}`;
  return key;
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: mockT }),
}));

interface TestFormData {
  testField: number | null;
}

interface TestComponentProps {
  value: number | null | undefined;
  bounds: { min?: number; max?: number };
}

const TestComponent = ({ value, bounds }: TestComponentProps) => {
  useDynamicBoundsValidation<TestFormData>('testField', value, bounds);
  const { formState } = useFormContext<TestFormData>();

  return (
    <div>
      <span data-testid="error-message">{formState.errors.testField?.message || ''}</span>
      <span data-testid="error-type">{formState.errors.testField?.type || ''}</span>
    </div>
  );
};

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm<TestFormData>({
    defaultValues: { testField: null },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const renderWithForm = (
  value: number | null | undefined,
  bounds: { min?: number; max?: number },
) => {
  return render(
    <FormWrapper>
      <TestComponent value={value} bounds={bounds} />
    </FormWrapper>,
  );
};

describe('useDynamicBoundsValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('should not set error', () => {
    it.each([
      { value: null, bounds: { min: 10, max: 100 }, description: 'value is null' },
      { value: undefined, bounds: { min: 10, max: 100 }, description: 'value is undefined' },
      { value: 50, bounds: { min: 10, max: 100 }, description: 'value is within bounds' },
      { value: 10, bounds: { min: 10, max: 100 }, description: 'value equals min bound' },
      { value: 100, bounds: { min: 10, max: 100 }, description: 'value equals max bound' },
      { value: 50, bounds: { min: 10 }, description: 'only min bound defined' },
      { value: 50, bounds: { max: 100 }, description: 'only max bound defined' },
      { value: 50, bounds: {}, description: 'empty bounds' },
    ])('when $description', ({ value, bounds }) => {
      renderWithForm(value, bounds);

      expect(screen.getByTestId('error-message').textContent).toBe('');
    });
  });

  describe('should set error', () => {
    it.each([
      {
        value: 5,
        bounds: { min: 10, max: 100 },
        expectedMessage: 'Value must be at least 10',
        description: 'value is below minimum',
      },
      {
        value: 150,
        bounds: { min: 10, max: 100 },
        expectedMessage: 'Value must be at most 100',
        description: 'value is above maximum',
      },
    ])('when $description', ({ value, bounds, expectedMessage }) => {
      renderWithForm(value, bounds);

      expect(screen.getByTestId('error-message').textContent).toBe(expectedMessage);
      expect(screen.getByTestId('error-type').textContent).toBe('manual');
    });
  });

  describe('translation calls', () => {
    it.each([
      {
        value: 5,
        bounds: { min: 10, max: 100 },
        expectedKey: '@ovh-ux/manager-common-translations/form:error_min_inclusive',
        expectedParams: { value: 10 },
        description: 'min error',
      },
      {
        value: 150,
        bounds: { min: 10, max: 100 },
        expectedKey: '@ovh-ux/manager-common-translations/form:error_max_inclusive',
        expectedParams: { value: 100 },
        description: 'max error',
      },
    ])(
      'should call translation with correct params for $description',
      ({ value, bounds, expectedKey, expectedParams }) => {
        renderWithForm(value, bounds);

        expect(mockT).toHaveBeenCalledWith(expectedKey, expectedParams);
      },
    );
  });
});
