---
title: React Hook Form - Form Management Library
last_update: 2025-01-27
version: 7.66.0
tags: [dependency, forms, validation, react, zod]
ai: true
---

# React Hook Form

## 🧭 Purpose

**React Hook Form** is a performant, flexible form management library that uses uncontrolled components and React hooks. It minimizes re-renders and provides seamless integration with validation schemas (Zod, Yup, etc.).

## 📦 Package Information

```json
{
  "name": "react-hook-form",
  "version": "7.66.0",
  "type": "Form management library"
}
```

## 🔗 Related Dependencies

- **@hookform/resolvers**: Schema validation adapters (Zod, Yup, etc.)
- **zod**: TypeScript-first schema validation
- **@ovh-ux/manager-react-components**: OVH custom form components
- **@ovhcloud/ods-components/react**: ODS form components

## 📚 Official Documentation

- [React Hook Form Docs](https://react-hook-form.com/)
- [API Reference](https://react-hook-form.com/api)
- [Examples](https://github.com/react-hook-form/react-hook-form/tree/master/examples)

## 🎯 Core Concepts

### Key Features

1. **Performance**: Minimizes re-renders (uncontrolled components)
2. **DX**: Simple API with TypeScript support
3. **Validation**: Seamless schema integration (Zod, Yup)
4. **Small Bundle**: ~8.5KB (minified + gzipped)
5. **No Dependencies**: Pure React implementation

### Core Hooks

```typescript
import { useForm, Controller } from 'react-hook-form';

// Primary hook for form management
const {
  control,           // For controlled components (Controller)
  register,          // For uncontrolled components (native inputs)
  handleSubmit,      // Form submission handler
  formState,         // Form state (errors, isDirty, isValid, etc.)
  reset,             // Reset form to defaults
  setValue,          // Programmatically set field value
  getValues,         // Get current form values
  watch,             // Watch field changes
} = useForm({
  mode: 'onTouched', // Validation mode
  resolver,          // Schema validator (zodResolver, yupResolver)
  defaultValues,     // Initial form values
});
```

## 📘 Real-World Examples (OVHcloud Manager)

### Example 1: Create Secret Form (OKMS)

**Source**: [packages/manager/apps/okms/src/modules/secret-manager/pages/createSecret/SecretForm.component.tsx](../../packages/manager/apps/okms/src/modules/secret-manager/pages/createSecret/SecretForm.component.tsx:1)

```typescript
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { OdsButton, OdsFormField, OdsInput } from '@ovhcloud/ods-components/react';

export const SecretForm = ({ okmsId }: SecretFormProps) => {
  const { t } = useTranslation(['secret-manager']);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Define Zod Schema
  const pathSchema = useSecretPathSchema();
  const dataSchema = useSecretDataSchema();
  const secretSchema = z.object({
    path: pathSchema,
    data: dataSchema
  });
  type SecretSchema = z.infer<typeof secretSchema>;

  // 2. Initialize useForm with Zod resolver
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = useForm({
    mode: 'onTouched',                    // Validate on blur
    resolver: zodResolver(secretSchema),  // Zod validation
    defaultValues: {
      data: SECRET_DATA_TEMPLATE,         // Prefill with template
    },
  });

  // 3. Define mutation
  const { mutate: createSecret, isPending } = useCreateSecret({
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: secretQueryKeys.list(okmsId),
      });
      navigate(SECRET_MANAGER_ROUTES_URLS.secret(okmsId, data.path));
    },
    onError: (error) => {
      addError(t('error_message', { message: error.response.data.message }));
    },
  });

  // 4. Submit handler with type safety
  const handleConfirmClick: SubmitHandler<SecretSchema> = (formData) => {
    createSecret({
      okmsId,
      data: {
        path: formData.path,
        version: { data: JSON.parse(formData.data) },
      },
    });
  };

  // 5. Render form with Controller for custom components
  return (
    <form onSubmit={handleSubmit(handleConfirmClick)}>
      <div className="flex flex-col gap-3">
        <Controller
          name="path"
          control={control}
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField error={errors?.[name]?.message}>
              <OdsInput
                id={name}
                name={name}
                value={value}
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              />
              <OdsText slot="helper" preset="caption">
                {t('path_field_helper')}
              </OdsText>
            </OdsFormField>
          )}
        />
      </div>

      <OdsButton
        type="submit"
        isDisabled={!isDirty || !isValid || !okmsId}
        isLoading={isPending}
        label={t('create')}
      />
    </form>
  );
};
```

**Key Patterns:**
- ✅ Zod schema for validation
- ✅ `Controller` for ODS custom components
- ✅ Type-safe submit handler with `SubmitHandler<T>`
- ✅ Form state management (`isDirty`, `isValid`)
- ✅ Error display with `errors?.[name]?.message`
- ✅ Mutation integration with React Query

### Example 2: Create Version Drawer (OKMS)

**Source**: [packages/manager/apps/okms/src/modules/secret-manager/pages/drawers/createVersionDrawer/CreateVersionDrawer.page.tsx](../../packages/manager/apps/okms/src/modules/secret-manager/pages/drawers/createVersionDrawer/CreateVersionDrawer.page.tsx:1)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';

const CreateVersionDrawerForm = ({ secret, okmsId, secretPath, onDismiss }) => {
  const { t } = useTranslation(['secret-manager']);

  // 1. Mutation hook
  const {
    mutateAsync: createSecretVersion,
    isPending: isCreating,
    error: createError,
  } = useCreateSecretVersion();

  // 2. Form with onChange validation for immediate feedback
  const dataSchema = useSecretDataSchema();
  const formSchema = z.object({ data: dataSchema });
  type FormSchema = z.infer<typeof formSchema>;

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm({
    mode: 'onChange',  // Validation on all changes
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: JSON.stringify(secret?.version?.data),
    },
  });

  // 3. Async submit handler
  const handleSubmitForm = async (data: FormSchema) => {
    await createSecretVersion({
      okmsId,
      path: decodeSecretPath(secretPath),
      data: JSON.parse(data.data),
      cas: secretConfig.casRequired.value
        ? secret?.metadata?.currentVersion
        : undefined,
    });
    onDismiss();
  };

  return (
    <div className="flex flex-col h-full">
      <DrawerContent>
        <form>
          {createError && (
            <OdsMessage color="danger" className="mb-4">
              {createError?.response?.data?.message || t('add_new_version_error')}
            </OdsMessage>
          )}
          <SecretDataFormField name="data" control={control} />
        </form>
      </DrawerContent>
      <DrawerFooter
        primaryButtonLabel={t('add')}
        isPrimaryButtonDisabled={!isDirty || !isValid}
        isPrimaryButtonLoading={isCreating}
        onPrimaryButtonClick={handleSubmit(handleSubmitForm)}
        secondaryButtonLabel={t('close')}
        onSecondaryButtonClick={onDismiss}
      />
    </div>
  );
};
```

**Key Patterns:**
- ✅ `mode: 'onChange'` for immediate validation feedback
- ✅ Async submit handler with `mutateAsync`
- ✅ Error handling with mutation error
- ✅ Drawer pattern with footer buttons
- ✅ Controlled form with external submit button

## 🎯 Common Patterns

### Pattern 1: Basic Form with Zod Validation

```typescript
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// 1. Define schema
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18+'),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  // 2. Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  // 3. Submit handler
  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  // 4. Render form
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('age', { valueAsNumber: true })} type="number" />
      {errors.age && <span>{errors.age.message}</span>}

      <button type="submit" disabled={!isDirty || !isValid}>
        Submit
      </button>
    </form>
  );
}
```

### Pattern 2: Controller for Custom Components (ODS)

```typescript
import { Controller, useForm } from 'react-hook-form';
import { OdsInput, OdsFormField } from '@ovhcloud/ods-components/react';

export function CustomComponentForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { serviceName: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="serviceName"
        control={control}
        rules={{ required: 'Service name is required' }}
        render={({ field: { name, value, onChange, onBlur } }) => (
          <OdsFormField error={errors?.[name]?.message}>
            <OdsInput
              id={name}
              name={name}
              value={value}
              onOdsChange={onChange}
              onOdsBlur={onBlur}
            />
          </OdsFormField>
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Pattern 3: Dynamic Fields (Array Fields)

```typescript
import { useForm, useFieldArray } from 'react-hook-form';

type FormData = {
  users: { name: string; email: string }[];
};

export function DynamicFieldsForm() {
  const { control, register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      users: [{ name: '', email: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'users',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`users.${index}.name`)} placeholder="Name" />
          <input {...register(`users.${index}.email`)} placeholder="Email" />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: '', email: '' })}>
        Add User
      </button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Pattern 4: Form with React Query Mutation

```typescript
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function MutationForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data) => apiClient.v6.post('/api/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      reset(); // Reset form after success
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutate(data))}>
      {error && <div className="error">{error.message}</div>}

      <input {...register('name', { required: 'Name is required' })} />
      {errors.name && <span>{errors.name.message}</span>}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### Pattern 5: Conditional Fields

```typescript
import { useForm, useWatch } from 'react-hook-form';

export function ConditionalFieldsForm() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      accountType: 'personal',
      companyName: '',
    },
  });

  // Watch accountType to show/hide companyName
  const accountType = useWatch({
    control,
    name: 'accountType',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('accountType')}>
        <option value="personal">Personal</option>
        <option value="business">Business</option>
      </select>

      {accountType === 'business' && (
        <input
          {...register('companyName', {
            required: 'Company name is required for business accounts'
          })}
          placeholder="Company Name"
        />
      )}

      <button type="submit">Submit</button>
    </form>
  );
}
```

## 🎯 Validation Modes

```typescript
// Validation trigger modes
const modes = {
  onSubmit: 'onSubmit',     // Validate on submit only
  onBlur: 'onBlur',         // Validate on blur
  onChange: 'onChange',     // Validate on every change
  onTouched: 'onTouched',   // Validate on blur + submit
  all: 'all',               // Validate on blur + change + submit
};

// Recommended modes by use case
const recommendations = {
  // Simple forms: validate on blur to avoid annoying users
  simple: 'onTouched',

  // Complex forms with dependencies: validate on change for immediate feedback
  complex: 'onChange',

  // Forms with expensive validation: validate on blur
  expensive: 'onBlur',

  // Forms with real-time validation (password strength, etc.)
  realtime: 'onChange',
};
```

## 🚫 Common Mistakes & Anti-Patterns

### ❌ WRONG: Not using Controller for custom components

```typescript
// ❌ WRONG: Using register with ODS components
<OdsInput {...register('name')} /> // Won't work with custom components
```

### ✅ CORRECT: Use Controller for custom components

```typescript
// ✅ CORRECT: Using Controller
<Controller
  name="name"
  control={control}
  render={({ field }) => <OdsInput {...field} />}
/>
```

### ❌ WRONG: Untyped form data

```typescript
// ❌ WRONG: No type safety
const { register, handleSubmit } = useForm();
const onSubmit = (data) => { /* data is any */ };
```

### ✅ CORRECT: Type-safe form data

```typescript
// ✅ CORRECT: Full type safety
type FormData = z.infer<typeof schema>;
const { register, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema),
});
const onSubmit: SubmitHandler<FormData> = (data) => { /* data is typed */ };
```

### ❌ WRONG: Accessing errors without optional chaining

```typescript
// ❌ WRONG: Will throw if errors is undefined
<span>{errors.name.message}</span>
```

### ✅ CORRECT: Safe error access

```typescript
// ✅ CORRECT: Safe access
<span>{errors?.name?.message}</span>
// or
{errors.name && <span>{errors.name.message}</span>}
```

### ❌ WRONG: Not resetting form after mutation

```typescript
// ❌ WRONG: Form keeps old values after success
const { mutate } = useMutation({
  onSuccess: () => {
    // Form not reset
  },
});
```

### ✅ CORRECT: Reset form after success

```typescript
// ✅ CORRECT: Reset form
const { reset } = useForm();
const { mutate } = useMutation({
  onSuccess: () => {
    reset(); // Clear form
    // or reset(defaultValues) to reset to specific values
  },
});
```

## 🎯 Integration with OVHcloud Components

### ODS Components

```typescript
import { Controller } from 'react-hook-form';
import {
  OdsInput,
  OdsSelect,
  OdsTextarea,
  OdsCheckbox,
  OdsRadio,
  OdsFormField
} from '@ovhcloud/ods-components/react';

// Input
<Controller
  name="name"
  control={control}
  render={({ field: { name, value, onChange, onBlur } }) => (
    <OdsFormField error={errors?.[name]?.message}>
      <OdsInput
        name={name}
        value={value}
        onOdsChange={onChange}
        onOdsBlur={onBlur}
      />
    </OdsFormField>
  )}
/>

// Select
<Controller
  name="region"
  control={control}
  render={({ field: { name, value, onChange } }) => (
    <OdsSelect
      name={name}
      value={value}
      onOdsChange={onChange}
    >
      <option value="eu">Europe</option>
      <option value="us">United States</option>
    </OdsSelect>
  )}
/>

// Textarea
<Controller
  name="description"
  control={control}
  render={({ field: { name, value, onChange, onBlur } }) => (
    <OdsTextarea
      name={name}
      value={value}
      onOdsChange={onChange}
      onOdsBlur={onBlur}
    />
  )}
/>

// Checkbox
<Controller
  name="agree"
  control={control}
  render={({ field: { name, value, onChange } }) => (
    <OdsCheckbox
      name={name}
      checked={value}
      onOdsChange={onChange}
    />
  )}
/>
```

### MUK Components (when available)

```typescript
import { Controller } from 'react-hook-form';
import { Input, Select, Checkbox } from '@ovh-ux/muk';

// MUK Input
<Controller
  name="name"
  control={control}
  render={({ field }) => (
    <Input
      {...field}
      error={errors?.name?.message}
      placeholder="Enter name"
    />
  )}
/>
```

## 🔍 Debugging & DevTools

### React Hook Form DevTools

```typescript
import { DevTool } from '@hookform/devtools';

export function MyForm() {
  const { control, ...methods } = useForm();

  return (
    <>
      <form>...</form>
      {/* Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <DevTool control={control} />
      )}
    </>
  );
}
```

### Common Debugging Techniques

```typescript
// 1. Watch all form values
const values = useWatch({ control });
console.log('Form values:', values);

// 2. Watch specific field
const nameValue = useWatch({ control, name: 'name' });
console.log('Name value:', nameValue);

// 3. Get form state
const { isDirty, isValid, errors } = formState;
console.log({ isDirty, isValid, errors });

// 4. Get all current values
const allValues = getValues();
console.log('All values:', allValues);
```

## 📋 Migration from AngularJS Forms

### AngularJS Form

```javascript
// AngularJS
angular.controller('UserFormController', function($scope) {
  $scope.user = { name: '', email: '' };
  $scope.errors = {};

  $scope.submit = function() {
    if ($scope.validate()) {
      UserService.createUser($scope.user);
    }
  };

  $scope.validate = function() {
    $scope.errors = {};
    if (!$scope.user.name) {
      $scope.errors.name = 'Name is required';
      return false;
    }
    return true;
  };
});
```

```html
<!-- AngularJS Template -->
<form ng-submit="submit()">
  <input ng-model="user.name" required />
  <span ng-if="errors.name">{{errors.name}}</span>

  <input ng-model="user.email" type="email" required />
  <span ng-if="errors.email">{{errors.email}}</span>

  <button type="submit">Submit</button>
</form>
```

### React Hook Form Equivalent

```typescript
// React Hook Form
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

export function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate: createUser } = useMutation({
    mutationFn: (data: FormData) => apiClient.v6.post('/api/users', data),
  });

  return (
    <form onSubmit={handleSubmit((data) => createUser(data))}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

**Key Differences:**
- ✅ No manual state management (`$scope.user` → `useForm`)
- ✅ No manual validation (`$scope.validate()` → Zod schema)
- ✅ Type safety with TypeScript + Zod
- ✅ Better performance (uncontrolled components)
- ✅ Less boilerplate code

## 📋 Best Practices

### ✅ DO

1. **Use Zod for validation** instead of manual rules
2. **Use TypeScript** for type-safe forms
3. **Use Controller** for custom/third-party components
4. **Reset form** after successful mutation
5. **Handle errors** gracefully with error messages
6. **Use appropriate validation mode** (`onTouched` for simple, `onChange` for complex)
7. **Memoize expensive schemas** with `useMemo`
8. **Split large forms** into smaller components

### ❌ DON'T

1. **Don't use register** with ODS/custom components (use Controller)
2. **Don't forget error handling** in submit handler
3. **Don't access errors** without optional chaining
4. **Don't use `any` type** for form data
5. **Don't validate on every keystroke** unless necessary (use `onTouched`)
6. **Don't mutate form values** directly (use `setValue`)

## 🎯 Performance Optimization

### Optimize Re-renders

```typescript
// ❌ BAD: Causes unnecessary re-renders
const values = watch(); // Subscribes to all fields

// ✅ GOOD: Only subscribe to specific field
const nameValue = watch('name');

// ✅ GOOD: Use getValues for one-time read (no subscription)
const handleClick = () => {
  const currentValues = getValues();
  console.log(currentValues);
};
```

### Memoize Schemas

```typescript
import { useMemo } from 'react';

// ❌ BAD: Schema recreated on every render
const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

// ✅ GOOD: Schema created once
const schema = useMemo(
  () => z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
  [],
);
```

## 📚 Additional Resources

- [React Hook Form Best Practices](https://react-hook-form.com/advanced-usage)
- [Zod Documentation](https://zod.dev/)
- [Form Validation Guide](https://react-hook-form.com/get-started#SchemaValidation)
- [Controller API](https://react-hook-form.com/api/usecontroller/controller)

---

## ⚖️ The Form's Moral

- **Performance first** with uncontrolled components
- **Type safety** with TypeScript + Zod
- **Developer experience** with simple API
- **Integration** with OVHcloud components via Controller
- **Validation** with schema-based approach

**👉 Good forms are performant, type-safe, and developer-friendly.**
