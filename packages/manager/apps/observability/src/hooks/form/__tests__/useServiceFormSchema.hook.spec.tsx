import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useServiceFormSchema } from '@/hooks/form/useServiceFormSchema.hook';
import { DISPLAY_NAME_MAX_CHARS } from '@/utils/schemas/displayName.schema';

// Mock react-i18next
const mockT = vi.fn((key: string, options?: { value?: number }) => {
  if (key === '@ovh-ux/manager-common-translations/form:required_field')
    return 'This field is required';
  if (key === '@ovh-ux/manager-common-translations/form:error_max_chars')
    return `Maximum ${options?.value} characters allowed`;
  return key;
});

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: mockT,
  })),
}));

// Test wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useServiceFormSchema', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should return form and schema objects', () => {
      const { result } = renderHook(() => useServiceFormSchema('Default Name'), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('form');
      expect(result.current).toHaveProperty('schema');
      expect(result.current.form).toBeDefined();
      expect(result.current.schema).toBeDefined();
    });

    it.each([
      { defaultValue: 'My Service', description: 'provided display name' },
      { defaultValue: '', description: 'empty string' },
      { defaultValue: 'service-123', description: 'service id' },
    ])('should initialize form with $description as default value', ({ defaultValue }) => {
      const { result } = renderHook(() => useServiceFormSchema(defaultValue), {
        wrapper: createWrapper(),
      });

      const { form } = result.current;
      const values = form.getValues();

      expect(values).toEqual({ displayName: defaultValue });
    });
  });

  describe('form configuration', () => {
    it.each([
      { method: 'handleSubmit', description: 'handleSubmit' },
      { method: 'formState', description: 'formState' },
      { method: 'setValue', description: 'setValue' },
      { method: 'trigger', description: 'trigger' },
    ])('should have $description defined', ({ method }) => {
      const { result } = renderHook(() => useServiceFormSchema('Test'), {
        wrapper: createWrapper(),
      });

      expect(result.current.form[method as keyof typeof result.current.form]).toBeDefined();
    });

    it('should configure form with onChange mode', async () => {
      const { result } = renderHook(() => useServiceFormSchema(''), {
        wrapper: createWrapper(),
      });

      const { form } = result.current;

      await act(async () => {
        form.setValue('displayName', '');
        await form.trigger('displayName');
      });

      expect(form.formState.isValid).toBe(false);
    });
  });

  describe('schema validation', () => {
    it('should create schema with displayName field', () => {
      const { result } = renderHook(() => useServiceFormSchema('Test'), {
        wrapper: createWrapper(),
      });

      const { schema } = result.current;

      expect(schema).toBeDefined();
      expect(schema.shape).toBeDefined();
      expect(schema.shape.displayName).toBeDefined();
    });

    it.each([
      {
        description: 'empty string (required validation)',
        initialValue: '',
        valueToSet: null,
        expectedValid: false,
      },
      {
        description: 'exceeds max length',
        initialValue: 'Test',
        valueToSet: 'a'.repeat(DISPLAY_NAME_MAX_CHARS + 1),
        expectedValid: false,
      },
      {
        description: 'valid name',
        initialValue: '',
        valueToSet: 'Valid Service Name',
        expectedValid: true,
      },
      {
        description: 'max length exactly',
        initialValue: '',
        valueToSet: 'a'.repeat(DISPLAY_NAME_MAX_CHARS),
        expectedValid: true,
      },
    ])(
      'should return isValid=$expectedValid for $description',
      async ({ initialValue, valueToSet, expectedValid }) => {
        const { result } = renderHook(() => useServiceFormSchema(initialValue), {
          wrapper: createWrapper(),
        });

        let isValid: boolean | undefined;
        await act(async () => {
          if (valueToSet !== null) {
            result.current.form.setValue('displayName', valueToSet);
          }
          isValid = await result.current.form.trigger('displayName');
        });

        expect(isValid).toBe(expectedValid);
      },
    );
  });

  describe('form operations', () => {
    it('should allow setting displayName value', () => {
      const { result } = renderHook(() => useServiceFormSchema('Initial'), {
        wrapper: createWrapper(),
      });

      const { form } = result.current;

      act(() => {
        form.setValue('displayName', 'Updated Name');
      });

      expect(form.getValues('displayName')).toBe('Updated Name');
    });

    it('should track form dirty state correctly', () => {
      const { result } = renderHook(() => useServiceFormSchema('Initial'), {
        wrapper: createWrapper(),
      });

      const { form } = result.current;

      expect(form.formState.isDirty).toBe(false);

      act(() => {
        form.setValue('displayName', 'Changed Name', { shouldDirty: true });
      });

      expect(form.formState.isDirty).toBe(true);
    });

    it('should reset form to default values', () => {
      const defaultName = 'Default Service';
      const { result } = renderHook(() => useServiceFormSchema(defaultName), {
        wrapper: createWrapper(),
      });

      const { form } = result.current;

      act(() => {
        form.setValue('displayName', 'Changed Name');
      });

      act(() => {
        form.reset();
      });

      expect(form.getValues('displayName')).toBe(defaultName);
    });
  });

  describe('translation integration', () => {
    it.each([
      {
        key: '@ovh-ux/manager-common-translations/form:required_field',
        options: undefined,
        description: 'required field message',
      },
      {
        key: '@ovh-ux/manager-common-translations/form:error_max_chars',
        options: { value: DISPLAY_NAME_MAX_CHARS },
        description: 'max chars error message',
      },
    ])('should call translation function for $description', ({ key, options }) => {
      renderHook(() => useServiceFormSchema('Test'), {
        wrapper: createWrapper(),
      });

      if (options) {
        expect(mockT).toHaveBeenCalledWith(key, options);
      } else {
        expect(mockT).toHaveBeenCalledWith(key);
      }
    });
  });

  describe('react-hook-form integration', () => {
    it.each([
      'register',
      'handleSubmit',
      'setValue',
      'getValues',
      'trigger',
      'reset',
      'watch',
      'control',
    ])('should provide %s method', (method) => {
      const { result } = renderHook(() => useServiceFormSchema('Test'), {
        wrapper: createWrapper(),
      });

      expect(result.current.form[method as keyof typeof result.current.form]).toBeDefined();
    });

    it.each(['isValid', 'isDirty', 'isSubmitting', 'errors'])(
      'should provide formState.%s',
      (property) => {
        const { result } = renderHook(() => useServiceFormSchema('Test'), {
          wrapper: createWrapper(),
        });

        expect(
          result.current.form.formState[property as keyof typeof result.current.form.formState],
        ).toBeDefined();
      },
    );
  });

  describe('type safety', () => {
    it('should return properly typed form values', () => {
      const { result } = renderHook(() => useServiceFormSchema('Test'), {
        wrapper: createWrapper(),
      });

      const { form } = result.current;
      const values = form.getValues();

      expect(typeof values.displayName).toBe('string');
    });
  });
});
