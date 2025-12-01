import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useTenantsFormSchema } from '@/hooks/form/useTenantsFormSchema.hook';

// Mock react-i18next
const mockT = vi.fn((key: string, options?: { value?: number }) => {
  if (key === '@ovh-ux/manager-common-translations/form:required_field')
    return 'This field is required';
  if (key === '@ovh-ux/manager-common-translations/form:error_min_chars')
    return `Minimum ${options?.value} characters required`;
  if (key === '@ovh-ux/manager-common-translations/form:error_max_chars')
    return `Maximum ${options?.value} characters allowed`;
  if (key === '@ovh-ux/manager-common-translations/form:error_min_inclusive')
    return `Value must be at least ${options?.value}`;
  if (key === '@ovh-ux/manager-common-translations/form:error_max_inclusive')
    return `Value must be at most ${options?.value}`;
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

describe('useTenantsFormSchema', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return form and schema objects', () => {
    const { result } = renderHook(() => useTenantsFormSchema(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('form');
    expect(result.current).toHaveProperty('schema');
    expect(result.current.form).toBeDefined();
    expect(result.current.schema).toBeDefined();
  });

  it('should initialize form with correct default values', () => {
    const { result } = renderHook(() => useTenantsFormSchema(), {
      wrapper: createWrapper(),
    });

    const { form } = result.current;
    const defaultValues = form.getValues();

    expect(defaultValues).toEqual({
      title: '',
      description: '',
      infrastructureId: '',
      retentionDuration: '',
      retentionUnit: '',
      maxSeries: null,
    });
  });

  it('should configure form with zodResolver', () => {
    const { result } = renderHook(() => useTenantsFormSchema(), {
      wrapper: createWrapper(),
    });

    const { form } = result.current;

    // Check that the form has the expected properties
    expect(form.handleSubmit).toBeDefined();
    expect(form.formState).toBeDefined();
    expect(form.setValue).toBeDefined();
    expect(form.trigger).toBeDefined();
  });

  it('should call translation function with correct keys', () => {
    renderHook(() => useTenantsFormSchema(), {
      wrapper: createWrapper(),
    });

    expect(mockT).toHaveBeenCalledWith('@ovh-ux/manager-common-translations/form:required_field');
  });

  describe('form operations', () => {
    it('should allow setting form values', () => {
      const { result } = renderHook(() => useTenantsFormSchema(), {
        wrapper: createWrapper(),
      });

      const { form } = result.current;

      act(() => {
        form.setValue('title', 'Test Title');
        form.setValue('description', 'Test description');
        form.setValue('infrastructureId', 'infra-123');
        form.setValue('retentionDuration', '30');
        form.setValue('retentionUnit', 'd');
        form.setValue('maxSeries', 500);
      });

      const formData = form.getValues();
      expect(formData).toEqual({
        title: 'Test Title',
        description: 'Test description',
        infrastructureId: 'infra-123',
        retentionDuration: '30',
        retentionUnit: 'd',
        maxSeries: 500,
      });
    });

    it('should track form dirty state correctly', () => {
      const { result } = renderHook(() => useTenantsFormSchema(), {
        wrapper: createWrapper(),
      });

      const { form } = result.current;

      // Initially not dirty
      expect(form.formState.isDirty).toBe(false);

      // After changing a value, should be dirty
      act(() => {
        form.setValue('title', 'New Title', { shouldDirty: true });
      });
      expect(form.formState.isDirty).toBe(true);
    });

    it('should reset form to default values', () => {
      const { result } = renderHook(() => useTenantsFormSchema(), {
        wrapper: createWrapper(),
      });

      const { form } = result.current;

      // Change some values
      act(() => {
        form.setValue('title', 'Changed Title');
        form.setValue('maxSeries', 999);
      });

      // Reset form
      act(() => {
        form.reset();
      });

      const values = form.getValues();
      expect(values).toEqual({
        title: '',
        description: '',
        infrastructureId: '',
        retentionDuration: '',
        retentionUnit: '',
        maxSeries: null,
      });
    });
  });

  describe('schema validation', () => {
    it('should create schema with correct structure', () => {
      const { result } = renderHook(() => useTenantsFormSchema(), {
        wrapper: createWrapper(),
      });

      const { schema } = result.current;

      // Test that the schema exists and has the expected structure
      expect(schema).toBeDefined();
      expect(schema.shape).toBeDefined();
      expect(schema.shape.title).toBeDefined();
      expect(schema.shape.description).toBeDefined();
      expect(schema.shape.infrastructureId).toBeDefined();
      expect(schema.shape.retentionDuration).toBeDefined();
      expect(schema.shape.retentionUnit).toBeDefined();
      expect(schema.shape.maxSeries).toBeDefined();
    });
  });

  describe('form submission handling', () => {
    it('should provide handleSubmit function', () => {
      const { result } = renderHook(() => useTenantsFormSchema(), {
        wrapper: createWrapper(),
      });

      const { form } = result.current;

      expect(form.handleSubmit).toBeDefined();
      expect(typeof form.handleSubmit).toBe('function');
    });

    it('should provide form state information', () => {
      const { result } = renderHook(() => useTenantsFormSchema(), {
        wrapper: createWrapper(),
      });

      const { form } = result.current;

      expect(form.formState).toBeDefined();
      expect(form.formState.isValid).toBeDefined();
      expect(form.formState.isDirty).toBeDefined();
      expect(form.formState.isSubmitting).toBeDefined();
    });
  });

  describe('integration with react-hook-form', () => {
    it('should provide all necessary form methods', () => {
      const { result } = renderHook(() => useTenantsFormSchema(), {
        wrapper: createWrapper(),
      });

      const { form } = result.current;

      // Check that all essential react-hook-form methods are available
      expect(form.register).toBeDefined();
      expect(form.handleSubmit).toBeDefined();
      expect(form.setValue).toBeDefined();
      expect(form.getValues).toBeDefined();
      expect(form.trigger).toBeDefined();
      expect(form.reset).toBeDefined();
      expect(form.watch).toBeDefined();
      expect(form.control).toBeDefined();
    });

    it('should maintain form state consistency', () => {
      const { result } = renderHook(() => useTenantsFormSchema(), {
        wrapper: createWrapper(),
      });

      const { form } = result.current;

      // Set multiple values and verify they persist
      act(() => {
        form.setValue('title', 'Consistent Title');
        form.setValue('maxSeries', 100000);
      });

      expect(form.getValues('title')).toBe('Consistent Title');
      expect(form.getValues('maxSeries')).toBe(100000);
    });
  });

  describe('type safety', () => {
    it('should return properly typed form and schema', () => {
      const { result } = renderHook(() => useTenantsFormSchema(), {
        wrapper: createWrapper(),
      });

      const { form, schema } = result.current;

      // Verify the return types are as expected
      expect(form).toBeDefined();
      expect(schema).toBeDefined();

      // Test that form values match expected type structure
      const values = form.getValues();
      expect(typeof values.title).toBe('string');
      expect(typeof values.description).toBe('string');
      expect(typeof values.infrastructureId).toBe('string');
      expect(typeof values.retentionDuration).toBe('string');
      expect(typeof values.retentionUnit).toBe('string');
      expect(values.maxSeries).toBeNull();
    });
  });
});
