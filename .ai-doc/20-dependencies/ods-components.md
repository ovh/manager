---
title: OVHcloud Design System (ODS) React Components
last_update: 2025-01-27
tags: [ods, design-system, ui, ovhcloud, react, components, documentation]
ai: true
---

# OVHcloud Design System (ODS) — React Components

> **📦 Version:** `@ovhcloud/ods-components@^18.6.2`

The **OVHcloud Design System (ODS)** provides a unified and reusable set of **React UI components** used across OVHcloud products to ensure a consistent, accessible, and modern user experience.  
It is the **single source of truth** for UI patterns and interactions in the OVHcloud ecosystem.

Official documentation: [ODS Storybook](https://ovh.github.io/design-system/latest/?path=/docs/ovhcloud-design-system-get-started--docs)

---

## 🧭 Purpose

This documentation provides comprehensive guidance for AI systems to generate correct, secure, and performant React code using ODS components. It includes complete prop interfaces, usage patterns, and best practices.

---

## ⚙️ Context

ODS is built on modern web standards and provides:
- **React 18.2+** compatibility
- **TypeScript** support with full type definitions
- **Accessibility** compliance (WCAG 2.1)
- **Theme system** with multiple variants (v18.6.2)
- **Performance** optimized components

---

## 🔗 References

- [ODS GitHub Repository](https://github.com/ovh/design-system) - Source code and issues
- [ODS Storybook Documentation](https://ovh.github.io/design-system/latest/) - Interactive component examples
- [ODS Migration Guide](https://ovh.github.io/design-system/latest/?path=/docs/migration--page) - Version migration help
- [ODS Contributing Guide](https://github.com/ovh/design-system/blob/master/CONTRIBUTING.md) - How to contribute
- [ODS Themes Documentation](./ods-themes.md) - Theme system documentation

---

## 📘 Guidelines / Implementation

### Installation and Setup

```bash
# Install ODS Components and Themes packages
npm install --save-exact @ovhcloud/ods-components@^18.6.2 @ovhcloud/ods-themes@^18.6.2
# or
yarn add --exact @ovhcloud/ods-components@^18.6.2 @ovhcloud/ods-themes@^18.6.2
```

```typescript
// Always import theme first
import '@ovhcloud/ods-themes/default';
// Then import components from the React package
import { Button, Modal, Input } from '@ovhcloud/ods-components/react';
```

### Component Library Overview

| Component | Category | Description | Import | Basic Example |
|-----------|----------|-------------|---------|---------------|
| **Button** | Inputs | Primary interactive element for actions | `import { Button } from '@ovhcloud/ods-components/react';` | `<Button color="primary">Submit</Button>` |
| **Modal** | Layout | Centered dialog window | `import { Modal } from '@ovhcloud/ods-components/react';` | `<Modal open title="Confirm">Content</Modal>` |
| **Input** | Inputs | Basic text input field | `import { Input } from '@ovhcloud/ods-components/react';` | `<Input placeholder="Enter name" />` |
| **Select** | Inputs | Standard dropdown selection | `import { Select } from '@ovhcloud/ods-components/react';` | `<Select options={[{value:'1',label:'Option 1'}]} />` |
| **Checkbox** | Inputs | Boolean selection control | `import { Checkbox } from '@ovhcloud/ods-components/react';` | `<Checkbox label="Accept terms" />` |
| **FormField** | Inputs | Combines label, help text, and input control | `import { FormField } from '@ovhcloud/ods-components/react';` | `<FormField label="Name"><Input /></FormField>` |
| **Message** | Feedback | Feedback alert (info, error, success) | `import { Message } from '@ovhcloud/ods-components/react';` | `<Message type="success">Saved</Message>` |
| **Card** | Layout | Visual container for grouped content | `import { Card } from '@ovhcloud/ods-components/react';` | `<Card title="Information">Content</Card>` |
| **Badge** | Feedback | Displays a visual indicator | `import { Badge } from '@ovhcloud/ods-components/react';` | `<Badge color="success">Active</Badge>` |
| **Accordion** | Layout | Expandable/collapsible container | `import { Accordion } from '@ovhcloud/ods-components/react';` | `<Accordion summary="Details">Content</Accordion>` |
| **Breadcrumb** | Navigation | Displays hierarchical navigation path | `import { Breadcrumb } from '@ovhcloud/ods-components/react';` | `<Breadcrumb items={[{label:'Home'}]} />` |
| **Drawer** | Layout | Sliding side panel | `import { Drawer } from '@ovhcloud/ods-components/react';` | `<Drawer open>Content</Drawer>` |
| **Pagination** | Navigation | Page navigation control | `import { Pagination } from '@ovhcloud/ods-components/react';` | `<Pagination total={100} pageSize={10} />` |
| **Spinner** | Feedback | Circular loading indicator | `import { Spinner } from '@ovhcloud/ods-components/react';` | `<Spinner />` |
| **Skeleton** | Feedback | Loading placeholder element | `import { Skeleton } from '@ovhcloud/ods-components/react';` | `<Skeleton width="100%" height="20px" />` |

### Complete Component Props Reference

#### Button Component
```typescript
interface ButtonProps {
  color?: 'primary' | 'secondary' | 'tertiary' | 'critical' | 'success';
  variant?: 'flat' | 'stroked' | 'ghost';
  size?: 'xs' | 's' | 'm' | 'l';
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<Button color="primary" onClick={handleSubmit}>Submit</Button>
<Button color="critical" isLoading={isDeleting}>Delete</Button>
<Button variant="ghost" size="s">Cancel</Button>
```

#### Modal Component
```typescript
interface ModalProps {
  open: boolean;                    // Required
  title?: string;
  onClose?: () => void;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  color?: 'default' | 'critical' | 'information' | 'success' | 'warning';
  isDismissible?: boolean;
  children?: React.ReactNode;
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Confirm">
  <p>Are you sure you want to delete this item?</p>
</Modal>

<Modal open={isOpen} color="critical" isDismissible={false}>
  <h2>Critical Action Required</h2>
  <p>This action cannot be undone.</p>
</Modal>
```

#### Input Component
```typescript
interface InputProps {
  value?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  helpText?: string;
  label?: string;
  onChange?: (value: string) => void;  // Note: ODS provides value directly
  onBlur?: () => void;
  onFocus?: () => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<Input 
  value={email} 
  onChange={setEmail}
  type="email"
  placeholder="Enter your email"
  isRequired
/>

<Input 
  value={password}
  onChange={setPassword}
  type="password"
  hasError={!!passwordError}
  errorMessage={passwordError}
/>
```

#### Select Component
```typescript
interface SelectProps {
  options: Array<{              // Required
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  value?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  helpText?: string;
  label?: string;
  onChange?: (value: string) => void;
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<Select 
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="Choose an option"
/>

<Select 
  options={countries}
  value={country}
  onChange={setCountry}
  hasError={!!countryError}
  errorMessage={countryError}
  isRequired
/>
```

#### Checkbox Component
```typescript
interface CheckboxProps {
  checked?: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  helpText?: string;
  label?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<Checkbox 
  checked={isAccepted}
  onChange={setIsAccepted}
  label="I accept the terms and conditions"
  isRequired
/>

<Checkbox 
  checked={isIndeterminate}
  isIndeterminate={isIndeterminate}
  onChange={handleIndeterminateChange}
  label="Select all items"
/>
```

#### FormField Component
```typescript
interface FormFieldProps {
  label?: string;
  helpText?: string;
  errorMessage?: string;
  isRequired?: boolean;
  hasError?: boolean;
  children?: React.ReactNode;    // Required: Input component
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<FormField 
  label="Email Address" 
  helpText="We'll never share your email"
  hasError={!!emailError}
  errorMessage={emailError}
  isRequired
>
  <Input 
    type="email"
    value={email}
    onChange={setEmail}
    hasError={!!emailError}
  />
</FormField>
```

#### Message Component
```typescript
interface MessageProps {
  type: 'info' | 'success' | 'warning' | 'error';  // Required
  title?: string;
  children?: React.ReactNode;
  isDismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<Message type="success" title="Success!">
  Your changes have been saved successfully.
</Message>

<Message type="error" isDismissible onDismiss={handleDismiss}>
  An error occurred while processing your request.
</Message>
```

#### Card Component
```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  image?: {
    src: string;
    alt: string;
  };
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<Card 
  title="Product Information"
  subtitle="Basic details"
  image={{ src: "/product.jpg", alt: "Product image" }}
  actions={<Button>Edit</Button>}
>
  <p>Product description goes here.</p>
</Card>
```

#### Badge Component
```typescript
interface BadgeProps {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'flat' | 'stroked';
  size?: 'xs' | 's' | 'm' | 'l';
  children?: React.ReactNode;
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<Badge color="success">Active</Badge>
<Badge color="warning" variant="stroked">Pending</Badge>
<Badge color="error" size="s">Error</Badge>
```

### Essential Usage Patterns

#### 1. Form Validation Pattern
```typescript
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validateEmail = (value: string) => {
  if (!value) {
    setEmailError('Email is required');
    return false;
  }
  if (!/\S+@\S+\.\S+/.test(value)) {
    setEmailError('Invalid email format');
    return false;
  }
  setEmailError('');
  return true;
};

<FormField 
  label="Email" 
  hasError={!!emailError}
  errorMessage={emailError}
  isRequired
>
  <Input 
    type="email"
    value={email}
    onChange={(value) => {
      setEmail(value);
      validateEmail(value);
    }}
    hasError={!!emailError}
  />
</FormField>
```

#### 2. Modal with Confirmation Pattern
```typescript
const [isModalOpen, setIsModalOpen] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);

const handleDelete = async () => {
  setIsDeleting(true);
  try {
    await deleteItem(itemId);
    setIsModalOpen(false);
    // Handle success
  } catch (error) {
    // Handle error
  } finally {
    setIsDeleting(false);
  }
};

<Modal 
  open={isModalOpen} 
  onClose={() => setIsModalOpen(false)}
  title="Delete Item"
  color="critical"
>
  <p>Are you sure you want to delete this item? This action cannot be undone.</p>
  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
      Cancel
    </Button>
    <Button 
      color="critical" 
      isLoading={isDeleting}
      onClick={handleDelete}
    >
      Delete
    </Button>
  </div>
</Modal>
```

#### 3. Loading States Pattern
```typescript
const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState(null);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const result = await api.getData();
    setData(result);
  } catch (error) {
    // Handle error
  } finally {
    setIsLoading(false);
  }
};

{isLoading ? (
  <Skeleton width="100%" height="200px" />
) : (
  <Card title="Data">
    {data ? <DataDisplay data={data} /> : <p>No data available</p>}
  </Card>
)}
```

#### 4. Select with Dynamic Options Pattern
```typescript
const [countries, setCountries] = useState([]);
const [selectedCountry, setSelectedCountry] = useState('');
const [isLoadingCountries, setIsLoadingCountries] = useState(false);

useEffect(() => {
  const loadCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const data = await api.getCountries();
      setCountries(data.map(country => ({
        value: country.code,
        label: country.name
      })));
    } catch (error) {
      // Handle error
    } finally {
      setIsLoadingCountries(false);
    }
  };
  
  loadCountries();
}, []);

<Select 
  options={countries}
  value={selectedCountry}
  onChange={setSelectedCountry}
  placeholder={isLoadingCountries ? "Loading countries..." : "Select a country"}
  isDisabled={isLoadingCountries}
/>
```

### Common Pitfalls and Solutions

#### ❌ Wrong: Missing Required Props
```typescript
// Missing required 'open' prop
<Modal>Content</Modal>
```

#### ✅ Correct: All Required Props
```typescript
<Modal open={isOpen} onClose={() => setIsOpen(false)}>Content</Modal>
```

#### ❌ Wrong: Incorrect Event Handler
```typescript
// ODS Input provides value directly, not event
<Input onChange={(e) => setValue(e.target.value)} />
```

#### ✅ Correct: Proper Event Handler
```typescript
<Input onChange={setValue} />
```

#### ❌ Wrong: Missing Form Validation
```typescript
<Input value={email} />
```

#### ✅ Correct: With Validation
```typescript
<FormField hasError={!!emailError} errorMessage={emailError}>
  <Input value={email} onChange={setEmail} hasError={!!emailError} />
</FormField>
```

#### ❌ Wrong: No Loading States
```typescript
<Button onClick={handleSubmit}>Submit</Button>
```

#### ✅ Correct: With Loading State
```typescript
<Button isLoading={isSubmitting} onClick={handleSubmit}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

### Performance Best Practices

#### 1. Memoization
```typescript
// Memoize expensive computations
const memoizedOptions = useMemo(() => 
  data.map(item => ({ value: item.id, label: item.name })), 
  [data]
);

// Memoize event handlers
const handleSubmit = useCallback((e) => {
  e.preventDefault();
  onSubmit(formData);
}, [formData, onSubmit]);
```

#### 2. Conditional Rendering
```typescript
// Efficient conditional rendering
{isLoading ? (
  <Spinner />
) : error ? (
  <Message type="error">{error}</Message>
) : (
  <DataComponent data={data} />
)}
```

### Testing Guidelines

#### 1. Test IDs
```typescript
// Always include test IDs
<Button dataTestId="submit-button" onClick={handleSubmit}>
  Submit
</Button>

<Input 
  dataTestId="email-input"
  value={email}
  onChange={setEmail}
/>
```

#### 2. Accessibility
```typescript
// Include proper ARIA attributes
<Button 
  aria-label="Close modal"
  onClick={onClose}
  dataTestId="close-button"
>
  <Icon name="close" />
</Button>
```

### Integration with Manager React Components

```typescript
// Use ODS for basic UI components
import { Button, Modal, Input } from '@ovhcloud/ods-components/react';

// Use MRC for Manager-specific functionality with IAM
import { ManagerButton, ManagerText } from '@ovh-ux/manager-react-components';

// Basic ODS usage
<Button color="primary" onClick={handleClick}>Basic Action</Button>

// Manager-specific usage with authorization
<ManagerButton
  id="delete-resource"
  label="Delete"
  iamActions={['resource:delete']}
  urn={`urn:v1:eu:resource:${resourceId}`}
/>
```

### Theme Integration

```typescript
// Import theme first
import '@ovhcloud/ods-themes/default';

// Or use specific theme
import '@ovhcloud/ods-themes/blue-jeans';

// Import components
import { Button, Modal } from '@ovhcloud/ods-components/react';
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always import theme first**: `import '@ovhcloud/ods-themes/default';`
2. **Use specific imports**: `import { Button, Modal } from '@ovhcloud/ods-components/react';`
3. **Include all required props**: Check interface definitions above
4. **Handle loading states**: Use `isLoading` props and conditional rendering
5. **Implement validation**: Use `FormField` with `hasError` and `errorMessage`
6. **Add test IDs**: Include `dataTestId` for all interactive elements
7. **Use semantic colors**: `primary`, `critical`, `success`, `warning`, `error`
8. **Handle events correctly**: ODS provides values directly, not events
9. **Implement accessibility**: Include ARIA attributes where needed
10. **Optimize performance**: Use memoization for expensive operations

### Component Selection Guide

- **Basic UI**: Use ODS components (`Button`, `Input`, `Modal`)
- **Manager-specific**: Use MRC components (`ManagerButton`, `ManagerText`)
- **Forms**: Always wrap inputs with `FormField`
- **Feedback**: Use `Message` for alerts, `Spinner`/`Skeleton` for loading
- **Navigation**: Use `Breadcrumb`, `Pagination` for navigation
- **Layout**: Use `Card`, `Accordion`, `Drawer` for content organization
