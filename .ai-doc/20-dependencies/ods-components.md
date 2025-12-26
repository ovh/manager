---
title: OVHcloud Design System (ODS) React Components
version: 17.2.2
last_update: 2025-10-16
tags: [ods, design-system, ui, ovhcloud, react, components, documentation]
ai: true
---

# OVHcloud Design System (ODS) — React Components

> **📦 Version:** `@ovhcloud/ods-components@^19.2.1` (Target Documentation Version)
> **Currently Installed:** `@ovhcloud/ods-components@17.2.2`

The **OVHcloud Design System (ODS)** provides a unified and reusable set of **React UI components** used across OVHcloud products to ensure a consistent, accessible, and modern user experience.


Official documentation: [ODS Storybook](https://ovh.github.io/design-system/latest/?path=/docs/ovhcloud-design-system-get-started--docs)

## 🧭 Purpose

This documentation provides comprehensive guidance for AI systems to generate correct, secure, and performant React code using ODS components. It includes complete prop interfaces, usage patterns, and best practices based on actual TypeScript definitions from version 19.2.1.

**Note:** With the new ODS strategy, MUK will no longer be the single source of truth. ODS components can be used directly when appropriate, and MUK should be considered as a wrapper layer with Manager-specific enhancements rather than the exclusive entry point.

## ⚙️ Context

ODS is built on modern web standards and provides:
- **React 18.2+** compatibility
- **TypeScript** support with full type definitions
- **Accessibility** compliance (WCAG 2.1)
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
npm install @ovhcloud/ods-react@^19.2.1
npm install @ovhcloud/ods-themes@^18.6.2
```

### Basic Usage

```typescript
import { OdsButton, OdsInput, OdsText } from '@ovhcloud/ods-components/react';

function MyComponent() {
  return (
    <div>
      <OdsText>Hello World</OdsText>
      <OdsInput placeholder="Enter text" />
      <OdsButton color="primary">Click me</OdsButton>
    </div>
  );
}
```

### Component Categories

#### Form Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OdsButton** | Interactive button element | `import { OdsButton } from '@ovhcloud/ods-components/react';` | `<OdsButton color="primary">Click me</OdsButton>` |
| **OdsInput** | Text input field | `import { OdsInput } from '@ovhcloud/ods-components/react';` | `<OdsInput placeholder="Enter text" />` |
| **OdsTextarea** | Multi-line text input | `import { OdsTextarea } from '@ovhcloud/ods-components/react';` | `<OdsTextarea placeholder="Enter text" />` |
| **OdsSelect** | Dropdown selection | `import { OdsSelect } from '@ovhcloud/ods-components/react';` | `<OdsSelect>...</OdsSelect>` |
| **OdsCheckbox** | Checkbox input | `import { OdsCheckbox } from '@ovhcloud/ods-components/react';` | `<OdsCheckbox checked={true} />` |
| **OdsRadio** | Radio button input | `import { OdsRadio } from '@ovhcloud/ods-components/react';` | `<OdsRadio checked={true} />` |
| **OdsSwitch** | Toggle switch | `import { OdsSwitch } from '@ovhcloud/ods-components/react';` | `<OdsSwitch checked={true} />` |
| **OdsFormField** | Form field wrapper | `import { OdsFormField } from '@ovhcloud/ods-components/react';` | `<OdsFormField label="Label"><OdsInput /></OdsFormField>` |

#### Layout Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OdsModal** | Centered dialog window | `import { OdsModal } from '@ovhcloud/ods-components/react';` | `<OdsModal headline="Confirm">Content</OdsModal>` |
| **OdsAccordion** | Expandable/collapsible container | `import { OdsAccordion } from '@ovhcloud/ods-components/react';` | `<OdsAccordion opened={true}>Content</OdsAccordion>` |
| **Tabs** | Tab container (✅ Use from `@ovhcloud/ods-react`) | `import { Tabs } from '@ovhcloud/ods-react';` | `<Tabs value={value} onValueChange={handleChange}><TabList>...</TabList></Tabs>` |
| **TabList** | Tab list container | `import { TabList } from '@ovhcloud/ods-react';` | `<TabList><Tab>...</Tab></TabList>` |
| **Tab** | Individual tab item | `import { Tab } from '@ovhcloud/ods-react';` | `<Tab value="tab1">Label</Tab>` |
| **OdsTile** | Visual container for grouped content | `import { OdsTile } from '@ovhcloud/ods-components/react';` | `<OdsTile>Content</OdsTile>` |
| **OdsDivider** | Visual separator line | `import { OdsDivider } from '@ovhcloud/ods-components/react';` | `<OdsDivider />` |

#### Navigation Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OdsBreadcrumb** | Hierarchical navigation path | `import { OdsBreadcrumb } from '@ovhcloud/ods-components/react';` | `<OdsBreadcrumb items={[{label:'Home', href:'/'}]} />` |
| **OdsPagination** | Page navigation control | `import { OdsPagination } from '@ovhcloud/ods-components/react';` | `<OdsPagination totalItems={100} totalPages={10} />` |
| **OdsMenu** | Dropdown menu container | `import { OdsMenu } from '@ovhcloud/ods-components/react';` | `<OdsMenu>...</OdsMenu>` |

#### Feedback Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OdsMessage** | Feedback alert (info, error, success, warning) | `import { OdsMessage } from '@ovhcloud/ods-components/react';` | `<OdsMessage type="success">Saved</OdsMessage>` |
| **OdsSpinner** | Circular loading indicator | `import { OdsSpinner } from '@ovhcloud/ods-components/react';` | `<OdsSpinner />` |
| **OdsSkeleton** | Loading placeholder element | `import { OdsSkeleton } from '@ovhcloud/ods-components/react';` | `<OdsSkeleton />` |
| **OdsProgressBar** | Progress indicator | `import { OdsProgressBar } from '@ovhcloud/ods-components/react';` | `<OdsProgressBar value={50} max={100} />` |
| **OdsChip** | Small labeled element | `import { OdsChip } from '@ovhcloud/ods-components/react';` | `<OdsChip color="primary">Tag</OdsChip>` |

#### Data Display Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OdsTable** | Data table | `import { OdsTable } from '@ovhcloud/ods-components/react';` | `<OdsTable>...</OdsTable>` |
| **OdsDatagrid** | Advanced data grid | `import { OdsDatagrid } from '@ovhcloud/ods-components/react';` | `<OdsDatagrid columns={cols} rows={rows} height={400} />` |
| **OdsText** | Text display component | `import { OdsText } from '@ovhcloud/ods-components/react';` | `<OdsText>Hello World</OdsText>` |
| **OdsIcon** | Icon display | `import { OdsIcon } from '@ovhcloud/ods-components/react';` | `<OdsIcon name="home" />` |

#### Overlay Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OdsPopover** | Floating content container | `import { OdsPopover } from '@ovhcloud/ods-components/react';` | `<OdsPopover>Content</OdsPopover>` |
| **OdsTooltip** | Hover information display | `import { OdsTooltip } from '@ovhcloud/ods-components/react';` | `<OdsTooltip>Tooltip text</OdsTooltip>` |

#### Utility Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OdsLink** | Styled link component | `import { OdsLink } from '@ovhcloud/ods-components/react';` | `<OdsLink href="/path">Link</OdsLink>` |
| **OdsClipboard** | Copy to clipboard functionality | `import { OdsClipboard } from '@ovhcloud/ods-components/react';` | `<OdsClipboard value="text to copy" />` |

### Key Component Props

#### OdsButton
```typescript
interface OdsButtonProps {
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

#### OdsInput
```typescript
interface OdsInputProps {
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

#### OdsSelect
```typescript
interface OdsSelectProps {
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

#### OdsModal
```typescript
interface OdsModalProps {
  headline?: string;
  opened?: boolean;
  onOdsModalClose?: () => void;
  onOdsModalOpen?: () => void;
  children?: React.ReactNode;
}
```

#### OdsMessage
```typescript
interface OdsMessageProps {
  type?: 'info' | 'error' | 'success' | 'warning';
  removable?: boolean;
  onOdsMessageClose?: () => void;
  children?: React.ReactNode;
}
```

#### Tabs (from @ovhcloud/ods-react)
```typescript
interface TabsProps {
  value?: string;
  onValueChange?: (event: TabsValueChangeEvent) => void;
  children?: React.ReactNode;
}

interface TabListProps {
  children?: React.ReactNode;
}

interface TabProps {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

interface TabsValueChangeEvent {
  value: string;
}
```

**Important:** `Tabs`, `TabList`, `Tab`, and `TabsValueChangeEvent` are exported from `@ovhcloud/ods-react`, NOT from `@ovhcloud/ods-components/react` or MUK.

### Common Usage Patterns

#### Tabs Navigation
```typescript
import { Tabs, TabList, Tab, TabsValueChangeEvent } from '@ovhcloud/ods-react';
import { useNavigate, useLocation } from 'react-router-dom';

function DashboardTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { name: 'general', title: 'General Information', to: '.' },
    { name: 'partitions', title: 'Partitions', to: 'partitions' },
  ];
  
  const activeTab = tabs.find(tab => location.pathname.includes(tab.to))?.name || tabs[0].name;
  
  const handleTabChange = (event: TabsValueChangeEvent) => {
    const tab = tabs.find(t => t.name === event.value);
    if (tab) {
      navigate(tab.to);
    }
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabList>
        {tabs.map((tab) => (
          <Tab key={tab.name} value={tab.name}>
            {tab.title}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}
```

**Note:** `Tabs`, `TabList`, `Tab`, and `TabsValueChangeEvent` are available from `@ovhcloud/ods-react`, NOT from MUK. Always import them from ODS when needed.

#### Form with Validation
```typescript
import { OdsFormField, OdsInput, OdsButton, OdsMessage } from '@ovhcloud/ods-components/react';

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
      <OdsFormField label="Name" error={errors.name}>
        <OdsInput
          value={formData.name}
          onValueChange={(value) => setFormData({ ...formData, name: value })}
          error={errors.name}
        />
      </OdsFormField>
      
      <OdsFormField label="Email" error={errors.email}>
        <OdsInput
          type="email"
          value={formData.email}
          onValueChange={(value) => setFormData({ ...formData, email: value })}
          error={errors.email}
        />
      </OdsFormField>
      
      <OdsButton type="submit" color="primary">
        Submit
      </OdsButton>
    </form>
  );
}
```

#### Modal with Form
```typescript
import { OdsModal, OdsButton, OdsInput } from '@ovhcloud/ods-components/react';

function UserModal({ isOpen, onClose, onSave }) {
  const [userData, setUserData] = useState({ name: '', email: '' });

  const handleSave = () => {
    onSave(userData);
    onClose();
  };

  return (
    <OdsModal
      headline="Create User"
      opened={isOpen}
      onOdsModalClose={onClose}
    >
      <OdsInput
        placeholder="Name"
        value={userData.name}
        onValueChange={(value) => setUserData({ ...userData, name: value })}
      />
      <OdsInput
        placeholder="Email"
        value={userData.email}
        onValueChange={(value) => setUserData({ ...userData, email: value })}
      />
      <div>
        <OdsButton onClick={handleSave} color="primary">
          Save
        </OdsButton>
        <OdsButton onClick={onClose} variant="ghost">
          Cancel
        </OdsButton>
      </div>
    </OdsModal>
  );
}
```

#### Data Table
```typescript
import { OdsTable, OdsButton, OdsText } from '@ovhcloud/ods-components/react';

function UserTable({ users, onEdit, onDelete }) {
  return (
    <OdsTable>
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
              <OdsText>{user.name}</OdsText>
            </td>
            <td>
              <OdsText>{user.email}</OdsText>
            </td>
            <td>
              <OdsButton
                size="sm"
                variant="ghost"
                onClick={() => onEdit(user)}
              >
                Edit
              </OdsButton>
              <OdsButton
                size="sm"
                color="error"
                variant="ghost"
                onClick={() => onDelete(user.id)}
              >
                Delete
              </OdsButton>
            </td>
          </tr>
        ))}
      </tbody>
    </OdsTable>
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
- **Error handling**: Display validation errors using OdsMessage
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
