---
title: OVHcloud Design System (ODS) React Components
last_update: 2025-10-16
tags: [ods, design-system, ui, ovhcloud, react, components, documentation]
ai: true
---

# OVHcloud Design System (ODS) — React Components

> **⚠️ DEPRECATED**: This library is being replaced by [MUK Components](./muk.md). Use MUK as the single source of truth for all UI components.
> **📦 Version:** `@ovhcloud/ods-components@^18.6.2` (Target Documentation Version)
> **Currently Installed:** `@ovhcloud/ods-components@17.2.2`

The **OVHcloud Design System (ODS)** provides a unified and reusable set of **React UI components** used across OVHcloud products to ensure a consistent, accessible, and modern user experience.

**🚨 MIGRATION REQUIRED**: All ODS usage should be migrated to MUK components. See [MUK Components](./muk.md) for the new unified approach.

Official documentation: [ODS Storybook](https://ovh.github.io/design-system/latest/?path=/docs/ovhcloud-design-system-get-started--docs)

## 🧭 Purpose

This documentation provides comprehensive guidance for AI systems to generate correct, secure, and performant React code using ODS components. It includes complete prop interfaces, usage patterns, and best practices based on actual TypeScript definitions from version 17.2.2 with forward-looking guidance for 18.6.2.

## ⚙️ Context

ODS is built on modern web standards and provides:
- **React 18.2+** compatibility
- **TypeScript** support with full type definitions
- **Accessibility** compliance (WCAG 2.1)
- **Stencil.js** web components with React wrappers
- **Theme system** with multiple color intents and variants
- **Performance** optimized components

## 🔗 References

- [ODS GitHub Repository](https://github.com/ovh/design-system) - Source code and issues
- [ODS Storybook Documentation](https://ovh.github.io/design-system/latest/) - Interactive component examples
- [ODS Migration Guide](https://ovh.github.io/design-system/latest/?path=/docs/migration--page) - Version migration help
- [ODS Contributing Guide](https://github.com/ovh/design-system/blob/master/CONTRIBUTING.md) - How to contribute
- [ODS Themes Documentation](./ods-themes.md) - Theme system documentation

## 📘 Guidelines / Implementation

### Installation and Setup

```bash
npm install @ovhcloud/ods-components@^18.6.2
npm install @ovhcloud/ods-themes@^18.6.2
```

### Basic Usage

```typescript
import { OsdsButton, OsdsInput, OsdsText } from '@ovhcloud/ods-components/react';

function MyComponent() {
  return (
    <div>
      <OsdsText>Hello World</OsdsText>
      <OsdsInput placeholder="Enter text" />
      <OsdsButton color="primary">Click me</OsdsButton>
    </div>
  );
}
```

### Component Categories

#### Form Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsButton** | Interactive button element | `import { OsdsButton } from '@ovhcloud/ods-components/react';` | `<OsdsButton color="primary">Click me</OsdsButton>` |
| **OsdsInput** | Text input field | `import { OsdsInput } from '@ovhcloud/ods-components/react';` | `<OsdsInput placeholder="Enter text" />` |
| **OsdsTextarea** | Multi-line text input | `import { OsdsTextarea } from '@ovhcloud/ods-components/react';` | `<OsdsTextarea placeholder="Enter text" />` |
| **OsdsSelect** | Dropdown selection | `import { OsdsSelect } from '@ovhcloud/ods-components/react';` | `<OsdsSelect>...</OsdsSelect>` |
| **OsdsCheckbox** | Checkbox input | `import { OsdsCheckbox } from '@ovhcloud/ods-components/react';` | `<OsdsCheckbox checked={true} />` |
| **OsdsRadio** | Radio button input | `import { OsdsRadio } from '@ovhcloud/ods-components/react';` | `<OsdsRadio checked={true} />` |
| **OsdsSwitch** | Toggle switch | `import { OsdsSwitch } from '@ovhcloud/ods-components/react';` | `<OsdsSwitch checked={true} />` |
| **OsdsFormField** | Form field wrapper | `import { OsdsFormField } from '@ovhcloud/ods-components/react';` | `<OsdsFormField label="Label"><OsdsInput /></OsdsFormField>` |

#### Layout Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsModal** | Centered dialog window | `import { OsdsModal } from '@ovhcloud/ods-components/react';` | `<OsdsModal headline="Confirm">Content</OsdsModal>` |
| **OsdsAccordion** | Expandable/collapsible container | `import { OsdsAccordion } from '@ovhcloud/ods-components/react';` | `<OsdsAccordion opened={true}>Content</OsdsAccordion>` |
| **OsdsTabs** | Tab container | `import { OsdsTabs } from '@ovhcloud/ods-components/react';` | `<OsdsTabs>...</OsdsTabs>` |
| **OsdsTile** | Visual container for grouped content | `import { OsdsTile } from '@ovhcloud/ods-components/react';` | `<OsdsTile>Content</OsdsTile>` |
| **OsdsDivider** | Visual separator line | `import { OsdsDivider } from '@ovhcloud/ods-components/react';` | `<OsdsDivider />` |

#### Navigation Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsBreadcrumb** | Hierarchical navigation path | `import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';` | `<OsdsBreadcrumb items={[{label:'Home', href:'/'}]} />` |
| **OsdsPagination** | Page navigation control | `import { OsdsPagination } from '@ovhcloud/ods-components/react';` | `<OsdsPagination totalItems={100} totalPages={10} />` |
| **OsdsMenu** | Dropdown menu container | `import { OsdsMenu } from '@ovhcloud/ods-components/react';` | `<OsdsMenu>...</OsdsMenu>` |

#### Feedback Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsMessage** | Feedback alert (info, error, success, warning) | `import { OsdsMessage } from '@ovhcloud/ods-components/react';` | `<OsdsMessage type="success">Saved</OsdsMessage>` |
| **OsdsSpinner** | Circular loading indicator | `import { OsdsSpinner } from '@ovhcloud/ods-components/react';` | `<OsdsSpinner />` |
| **OsdsSkeleton** | Loading placeholder element | `import { OsdsSkeleton } from '@ovhcloud/ods-components/react';` | `<OsdsSkeleton />` |
| **OsdsProgressBar** | Progress indicator | `import { OsdsProgressBar } from '@ovhcloud/ods-components/react';` | `<OsdsProgressBar value={50} max={100} />` |
| **OsdsChip** | Small labeled element | `import { OsdsChip } from '@ovhcloud/ods-components/react';` | `<OsdsChip color="primary">Tag</OsdsChip>` |

#### Data Display Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsTable** | Data table | `import { OsdsTable } from '@ovhcloud/ods-components/react';` | `<OsdsTable>...</OsdsTable>` |
| **OsdsDatagrid** | Advanced data grid | `import { OsdsDatagrid } from '@ovhcloud/ods-components/react';` | `<OsdsDatagrid columns={cols} rows={rows} height={400} />` |
| **OsdsText** | Text display component | `import { OsdsText } from '@ovhcloud/ods-components/react';` | `<OsdsText>Hello World</OsdsText>` |
| **OsdsIcon** | Icon display | `import { OsdsIcon } from '@ovhcloud/ods-components/react';` | `<OsdsIcon name="home" />` |

#### Overlay Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsPopover** | Floating content container | `import { OsdsPopover } from '@ovhcloud/ods-components/react';` | `<OsdsPopover>Content</OsdsPopover>` |
| **OsdsTooltip** | Hover information display | `import { OsdsTooltip } from '@ovhcloud/ods-components/react';` | `<OsdsTooltip>Tooltip text</OsdsTooltip>` |

#### Utility Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsLink** | Styled link component | `import { OsdsLink } from '@ovhcloud/ods-components/react';` | `<OsdsLink href="/path">Link</OsdsLink>` |
| **OsdsClipboard** | Copy to clipboard functionality | `import { OsdsClipboard } from '@ovhcloud/ods-components/react';` | `<OsdsClipboard value="text to copy" />` |

### Key Component Props

#### OsdsButton
```typescript
interface OsdsButtonProps {
  color?: 'default' | 'primary' | 'accent' | 'error' | 'info' | 'success' | 'warning' | 'promotion' | 'text';
  variant?: 'flat' | 'stroked' | 'ghost';
  size?: 'sm' | 'md';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  children?: React.ReactNode;
}
```

#### OsdsInput
```typescript
interface OsdsInputProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  error?: string;
  onValueChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
```

#### OsdsSelect
```typescript
interface OsdsSelectProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onValueChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  children?: React.ReactNode;
}
```

#### OsdsModal
```typescript
interface OsdsModalProps {
  headline?: string;
  opened?: boolean;
  onOdsModalClose?: () => void;
  onOdsModalOpen?: () => void;
  children?: React.ReactNode;
}
```

#### OsdsMessage
```typescript
interface OsdsMessageProps {
  type?: 'info' | 'error' | 'success' | 'warning';
  removable?: boolean;
  onOdsMessageClose?: () => void;
  children?: React.ReactNode;
}
```

### Common Usage Patterns

#### Form with Validation
```typescript
import { OsdsFormField, OsdsInput, OsdsButton, OsdsMessage } from '@ovhcloud/ods-components/react';

function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic
    if (!formData.name) {
      setErrors({ name: 'Name is required' });
      return;
    }
    // Submit logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <OsdsFormField label="Name" error={errors.name}>
        <OsdsInput
          value={formData.name}
          onValueChange={(value) => setFormData({ ...formData, name: value })}
          error={errors.name}
        />
      </OsdsFormField>
      
      <OsdsFormField label="Email" error={errors.email}>
        <OsdsInput
          type="email"
          value={formData.email}
          onValueChange={(value) => setFormData({ ...formData, email: value })}
          error={errors.email}
        />
      </OsdsFormField>
      
      <OsdsButton type="submit" color="primary">
        Submit
      </OsdsButton>
    </form>
  );
}
```

#### Modal with Form
```typescript
import { OsdsModal, OsdsButton, OsdsInput } from '@ovhcloud/ods-components/react';

function UserModal({ isOpen, onClose, onSave }) {
  const [userData, setUserData] = useState({ name: '', email: '' });

  const handleSave = () => {
    onSave(userData);
    onClose();
  };

  return (
    <OsdsModal
      headline="Create User"
      opened={isOpen}
      onOdsModalClose={onClose}
    >
      <OsdsInput
        placeholder="Name"
        value={userData.name}
        onValueChange={(value) => setUserData({ ...userData, name: value })}
      />
      <OsdsInput
        placeholder="Email"
        value={userData.email}
        onValueChange={(value) => setUserData({ ...userData, email: value })}
      />
      <div>
        <OsdsButton onClick={handleSave} color="primary">
          Save
        </OsdsButton>
        <OsdsButton onClick={onClose} variant="ghost">
          Cancel
        </OsdsButton>
      </div>
    </OsdsModal>
  );
}
```

#### Data Table
```typescript
import { OsdsTable, OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';

function UserTable({ users, onEdit, onDelete }) {
  return (
    <OsdsTable>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>
              <OsdsText>{user.name}</OsdsText>
            </td>
            <td>
              <OsdsText>{user.email}</OsdsText>
            </td>
            <td>
              <OsdsButton
                size="sm"
                variant="ghost"
                onClick={() => onEdit(user)}
              >
                Edit
              </OsdsButton>
              <OsdsButton
                size="sm"
                color="error"
                variant="ghost"
                onClick={() => onDelete(user.id)}
              >
                Delete
              </OsdsButton>
            </td>
          </tr>
        ))}
      </tbody>
    </OsdsTable>
  );
}
```

### Best Practices

#### 1. Component Usage
- **Use ODS components**: Prefer ODS components over custom implementations
- **Consistent styling**: Use ODS components for consistent visual design
- **Accessibility**: ODS components include built-in accessibility features
- **TypeScript**: Use TypeScript for better type safety

#### 2. Form Handling
- **Form validation**: Implement proper form validation
- **Error handling**: Display validation errors using OsdsMessage
- **User feedback**: Provide clear feedback for user actions
- **Accessibility**: Ensure forms are accessible to all users

#### 3. State Management
- **Local state**: Use React state for component-specific data
- **Form state**: Use controlled components for form inputs
- **Error state**: Manage error states properly
- **Loading state**: Show loading states for async operations

#### 4. Performance
- **Lazy loading**: Use lazy loading for large components
- **Memoization**: Use React.memo for expensive components
- **Bundle size**: Import only needed components
- **Optimization**: Optimize component rendering

### Migration from AngularJS

#### Key Differences
1. **Component-based**: React components instead of AngularJS directives
2. **Props vs attributes**: React props instead of AngularJS attributes
3. **Event handling**: React event handlers instead of AngularJS event binding
4. **State management**: React state instead of AngularJS scope

#### Migration Steps
1. **Install ODS**: Install `@ovhcloud/ods-components`
2. **Replace components**: Replace AngularJS components with ODS components
3. **Update props**: Convert AngularJS attributes to React props
4. **Update events**: Convert AngularJS events to React event handlers
5. **Test integration**: Test ODS component integration

### Troubleshooting

#### Common Issues
1. **Import errors**: Check if ODS is properly installed
2. **Type errors**: Ensure TypeScript types are properly imported
3. **Styling issues**: Check if ODS themes are properly configured
4. **Event handling**: Verify event handler implementations

#### Debug Mode
Enable debug mode for ODS components:

```typescript
// Enable debug mode
process.env.ODS_DEBUG = 'true';

// Debug component props
console.log('ODS Component Props:', props);

// Debug component state
console.log('ODS Component State:', state);
```

### References

- [ODS Storybook Documentation](https://ovh.github.io/design-system/latest/)
- [ODS GitHub Repository](https://github.com/ovh/design-system)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Stencil.js Documentation](https://stenciljs.com/docs)
