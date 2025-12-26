---
title: Form Management with React Hook Form and Zod
last_update: 2025-01-27
tags: [forms, react-hook-form, zod, validation, best-practices]
ai: true
---

# Form Management with React Hook Form and Zod

This document describes the standard pattern for managing forms in bmc-nasha and other React applications, following the same approach used in pci-project.

## Overview

Forms in bmc-nasha use **React Hook Form** with **Zod** for validation, providing:
- Type-safe form validation
- Automatic error handling
- Translated error messages
- Clean separation between form logic and UI

## Dependencies

```json
{
  "react-hook-form": "7.66.0",
  "zod": "4.1.12",
  "@hookform/resolvers": "5.2.2"
}
```

## Pattern Structure

### 1. Form Hook (`useXxxForm`)

Create a custom hook that defines the validation schema and initializes the form:

```typescript
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

export const useEditDescriptionForm = ({
  serviceName,
  partitionName,
  partitionDescription,
  isModalOpen,
  onSuccess,
}: UseEditDescriptionFormProps) => {
  const { t } = useTranslation(['partition']);

  // Define validation rules with Zod
  const descriptionRules = z
    .string()
    .trim()
    .max(DESCRIPTION_MAX, {
      message: t('partition:edit_description.max_length', `Maximum ${DESCRIPTION_MAX} characters`),
    });

  // Create validation schema
  const schema = z.object({
    description: descriptionRules,
  });

  type ValidationSchema = z.infer<typeof schema>;

  // Initialize form with resolver
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: partitionDescription || '',
    },
  });

  // Handle form submission
  const handleSubmit = form.handleSubmit(async (formValues) => {
    if (!serviceName || !partitionName) return;

    try {
      await updatePartitionDescription(serviceName, partitionName, formValues.description);
      onSuccess();
    } catch (err) {
      form.setError('description', {
        message: (err as Error).message || t('partition:edit_description.error', 'An error occurred'),
      });
    }
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};
```

### 2. FormField Component

A reusable component that wraps `Controller` from react-hook-form:

```typescript
// src/components/form-field/FormField.component.tsx
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormReturn,
} from 'react-hook-form';
import { ReactNode } from 'react';
import { FormField as MUKFormField, FormFieldError, FormFieldHelper, FormFieldLabel } from '@ovh-ux/muk';

interface FormFieldProps<T extends FieldValues, K extends Path<T>> {
  form: UseFormReturn<T>;
  name: K;
  label?: ReactNode;
  helper?: ReactNode;
  children: (field: ControllerRenderProps<T, K>) => ReactNode;
}

export function FormField<T extends FieldValues, K extends Path<T>>({
  form,
  name,
  label,
  helper,
  children,
}: FormFieldProps<T, K>) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <MUKFormField>
          {label && <FormFieldLabel>{label}</FormFieldLabel>}
          {children(field)}
          {fieldState.error && <FormFieldError>{fieldState.error.message}</FormFieldError>}
          {helper && !fieldState.error && <FormFieldHelper>{helper}</FormFieldHelper>}
        </MUKFormField>
      )}
    />
  );
}
```

### 3. Form Helper

A utility function to handle `preventDefault`:

```typescript
// src/lib/formHelper.ts
export const withPreventDefault = (handler: () => void) => (e?: React.FormEvent) => {
  e?.preventDefault();
  e?.stopPropagation();
  handler();
};
```

### 4. Form Component

Use the hook and FormField in your component:

```typescript
import { FormField } from '@/components/form-field/FormField.component';
import { useEditDescriptionForm } from '@/hooks/partitions/useEditDescriptionForm';
import { withPreventDefault } from '@/lib/formHelper';
import { Input, Button } from '@ovh-ux/muk';

export function EditDescriptionModal({ isOpen, onOpenChange, ...props }: Props) {
  const { t } = useTranslation(['partition']);
  const { form, handleSubmit, isSubmitting } = useEditDescriptionForm({
    ...props,
    isModalOpen: isOpen,
  });

  const onSubmit = withPreventDefault(() => {
    void handleSubmit();
  });

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <form id="editDescriptionForm" onSubmit={onSubmit}>
        <FormField
          form={form}
          name="description"
          label={t('partition:edit_description.label', 'Description')}
          helper={t('partition:edit_description.helper', `Maximum ${DESCRIPTION_MAX} characters`)}
        >
          {(field) => (
            <Input
              {...field}
              type="text"
              maxLength={DESCRIPTION_MAX}
              disabled={isSubmitting}
              required
            />
          )}
        </FormField>

        <Button
          type="submit"
          form="editDescriptionForm"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {t('partition:edit_description.confirm', 'Confirm')}
        </Button>
      </form>
    </Modal>
  );
}
```

## Key Patterns

### Validation Rules

Define validation rules with Zod, using translated error messages:

```typescript
const descriptionRules = z
  .string()
  .trim()
  .min(1, { message: t('error.required') })
  .max(50, { message: t('error.max_length', { max: 50 }) })
  .regex(/^[a-zA-Z0-9\s]+$/, { message: t('error.invalid_chars') });
```

### Form State

Access form state through `form.formState`:

- `isSubmitting` - Form is being submitted
- `isDirty` - Form has been modified
- `isValid` - Form is valid
- `errors` - Validation errors

### Error Handling

Set errors manually when API calls fail:

```typescript
try {
  await updateData(formValues);
  onSuccess();
} catch (err) {
  form.setError('fieldName', {
    message: (err as Error).message || t('error.generic'),
  });
}
```

### Reset Form

Reset form when modal opens or data changes:

```typescript
useEffect(() => {
  if (isModalOpen) {
    form.reset({
      description: initialDescription || '',
    });
  }
}, [isModalOpen, initialDescription, form]);
```

## Best Practices

1. **Separate Concerns**: Keep form logic in hooks, UI in components
2. **Type Safety**: Use `z.infer<typeof schema>` for type inference
3. **Translated Errors**: Always use translation keys for error messages
4. **Form IDs**: Use form IDs when submit button is outside the form element
5. **Loading States**: Use `isSubmitting` from `form.formState` for loading states
6. **Validation**: Define all validation rules in the schema, not in the component

## Examples

### Simple Text Input

```typescript
<FormField form={form} name="userName" label={t('userNameLabel')}>
  {(field) => <Input {...field} disabled={isSubmitting} />}
</FormField>
```

### Select Field

```typescript
<FormField form={form} name="template" label={t('templateLabel')}>
  {(field) => (
    <Select {...field} disabled={isSubmitting}>
      <option value="">{t('selectPlaceholder')}</option>
      {templates.map((template) => (
        <option key={template.value} value={template.value}>
          {template.label}
        </option>
      ))}
    </Select>
  )}
</FormField>
```

### Checkbox Field

```typescript
<FormField form={form} name="atime" label={t('atimeLabel')}>
  {(field) => (
    <Checkbox {...field} checked={field.value} disabled={isSubmitting}>
      {t('atimeDescription')}
    </Checkbox>
  )}
</FormField>
```

## Migration from Old Pattern

When migrating from the old pattern (manual state management):

1. Replace `useState` with `useForm` hook
2. Move validation logic to Zod schema
3. Replace manual error handling with `form.setError`
4. Use `FormField` component instead of manual `FormField` from MUK
5. Use `form.handleSubmit` instead of manual submit handlers
6. Use `isSubmitting` instead of custom `isUpdating` state

## References

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)


