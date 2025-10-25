---
title: OVHcloud Design System (ODS) React Components
last_update: 2025-10-16
tags: [ods, design-system, ui, ovhcloud, react, components, documentation]
ai: true
---

# OVHcloud Design System (ODS) — React Components

> **📦 Version:** `@ovhcloud/ods-components@^18.6.2` (Target Documentation Version)
> **Currently Installed:** `@ovhcloud/ods-components@17.2.2`

The **OVHcloud Design System (ODS)** provides a unified and reusable set of **React UI components** used across OVHcloud products to ensure a consistent, accessible, and modern user experience.
It is the **single source of truth** for UI patterns and interactions in the OVHcloud ecosystem.

Official documentation: [ODS Storybook](https://ovh.github.io/design-system/latest/?path=/docs/ovhcloud-design-system-get-started--docs)

---

## 🧭 Purpose

This documentation provides comprehensive guidance for AI systems to generate correct, secure, and performant React code using ODS components. It includes complete prop interfaces, usage patterns, and best practices based on actual TypeScript definitions from version 17.2.2 with forward-looking guidance for 18.6.2.

---

## ⚙️ Context

ODS is built on modern web standards and provides:
- **React 18.2+** compatibility
- **TypeScript** support with full type definitions
- **Accessibility** compliance (WCAG 2.1)
- **Stencil.js** web components with React wrappers
- **Theme system** with multiple color intents and variants
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
import {
  OsdsButton,
  OsdsModal,
  OsdsInput,
  OsdsText,
  OsdsIcon,
  OsdsTable,
  OsdsPagination
} from '@ovhcloud/ods-components/react';
```

### Component Library Overview

#### Input Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsButton** | Primary interactive element for actions | `import { OsdsButton } from '@ovhcloud/ods-components/react';` | `<OsdsButton color="primary">Submit</OsdsButton>` |
| **OsdsInput** | Basic text input field | `import { OsdsInput } from '@ovhcloud/ods-components/react';` | `<OsdsInput placeholder="Enter name" />` |
| **OsdsSelect** | Standard dropdown selection | `import { OsdsSelect } from '@ovhcloud/ods-components/react';` | `<OsdsSelect><OsdsSelectOption value="1">Option</OsdsSelectOption></OsdsSelect>` |
| **OsdsCheckbox** | Boolean selection control | `import { OsdsCheckbox } from '@ovhcloud/ods-components/react';` | `<OsdsCheckbox checked={value} />` |
| **OsdsCheckboxButton** | Checkbox styled as button | `import { OsdsCheckboxButton } from '@ovhcloud/ods-components/react';` | `<OsdsCheckboxButton checked={value} />` |
| **OsdsRadio** | Single selection from multiple options | `import { OsdsRadio } from '@ovhcloud/ods-components/react';` | `<OsdsRadio name="choice" value="1" />` |
| **OsdsRadioButton** | Radio styled as button | `import { OsdsRadioButton } from '@ovhcloud/ods-components/react';` | `<OsdsRadioButton checked={value} />` |
| **OsdsRadioGroup** | Group of radio buttons | `import { OsdsRadioGroup } from '@ovhcloud/ods-components/react';` | `<OsdsRadioGroup name="choice">...</OsdsRadioGroup>` |
| **OsdsSwitch** | Toggle switch control | `import { OsdsSwitch } from '@ovhcloud/ods-components/react';` | `<OsdsSwitch checked={isOn} />` |
| **OsdsToggle** | Toggle button control | `import { OsdsToggle } from '@ovhcloud/ods-components/react';` | `<OsdsToggle checked={isOn} />` |
| **OsdsRange** | Slider input for numeric values | `import { OsdsRange } from '@ovhcloud/ods-components/react';` | `<OsdsRange min={0} max={100} value={50} />` |
| **OsdsPassword** | Password input with visibility toggle | `import { OsdsPassword } from '@ovhcloud/ods-components/react';` | `<OsdsPassword placeholder="Password" />` |
| **OsdsTextarea** | Multi-line text input | `import { OsdsTextarea } from '@ovhcloud/ods-components/react';` | `<OsdsTextarea placeholder="Enter text" />` |
| **OsdsDatepicker** | Date selection input | `import { OsdsDatepicker } from '@ovhcloud/ods-components/react';` | `<OsdsDatepicker value={date} />` |
| **OsdsPhoneNumber** | Phone number input with validation | `import { OsdsPhoneNumber } from '@ovhcloud/ods-components/react';` | `<OsdsPhoneNumber value={phone} />` |
| **OsdsSearchBar** | Search input with icon | `import { OsdsSearchBar } from '@ovhcloud/ods-components/react';` | `<OsdsSearchBar placeholder="Search..." />` |
| **OsdsQuantity** | Numeric input with increment/decrement | `import { OsdsQuantity } from '@ovhcloud/ods-components/react';` | `<OsdsQuantity disabled={false} />` |

#### Layout Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsModal** | Centered dialog window | `import { OsdsModal } from '@ovhcloud/ods-components/react';` | `<OsdsModal headline="Confirm">Content</OsdsModal>` |
| **OsdsAccordion** | Expandable/collapsible container | `import { OsdsAccordion } from '@ovhcloud/ods-components/react';` | `<OsdsAccordion opened={true}>Content</OsdsAccordion>` |
| **OsdsAccordionGroup** | Group of accordions | `import { OsdsAccordionGroup } from '@ovhcloud/ods-components/react';` | `<OsdsAccordionGroup>...</OsdsAccordionGroup>` |
| **OsdsCollapsible** | Collapsible content container | `import { OsdsCollapsible } from '@ovhcloud/ods-components/react';` | `<OsdsCollapsible opened={true}>Content</OsdsCollapsible>` |
| **OsdsTabs** | Tab container | `import { OsdsTabs } from '@ovhcloud/ods-components/react';` | `<OsdsTabs>...</OsdsTabs>` |
| **OsdsTabBar** | Tab navigation bar | `import { OsdsTabBar } from '@ovhcloud/ods-components/react';` | `<OsdsTabBar>...</OsdsTabBar>` |
| **OsdsTabBarItem** | Individual tab item | `import { OsdsTabBarItem } from '@ovhcloud/ods-components/react';` | `<OsdsTabBarItem>Tab 1</OsdsTabBarItem>` |
| **OsdsTabPanel** | Tab content panel | `import { OsdsTabPanel } from '@ovhcloud/ods-components/react';` | `<OsdsTabPanel>Content</OsdsTabPanel>` |
| **OsdsTile** | Visual container for grouped content | `import { OsdsTile } from '@ovhcloud/ods-components/react';` | `<OsdsTile>Content</OsdsTile>` |
| **OsdsDivider** | Visual separator line | `import { OsdsDivider } from '@ovhcloud/ods-components/react';` | `<OsdsDivider />` |

#### Navigation Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsBreadcrumb** | Hierarchical navigation path | `import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';` | `<OsdsBreadcrumb items={[{label:'Home', href:'/'}]} />` |
| **OsdsBreadcrumbItem** | Individual breadcrumb item | `import { OsdsBreadcrumbItem } from '@ovhcloud/ods-components/react';` | `<OsdsBreadcrumbItem href="/" label="Home" />` |
| **OsdsPagination** | Page navigation control | `import { OsdsPagination } from '@ovhcloud/ods-components/react';` | `<OsdsPagination totalItems={100} totalPages={10} />` |
| **OsdsMenu** | Dropdown menu container | `import { OsdsMenu } from '@ovhcloud/ods-components/react';` | `<OsdsMenu>...</OsdsMenu>` |
| **OsdsMenuGroup** | Grouped menu items | `import { OsdsMenuGroup } from '@ovhcloud/ods-components/react';` | `<OsdsMenuGroup>...</OsdsMenuGroup>` |
| **OsdsMenuItem** | Individual menu item | `import { OsdsMenuItem } from '@ovhcloud/ods-components/react';` | `<OsdsMenuItem>Item</OsdsMenuItem>` |

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
| **OsdsCode** | Code display with syntax highlighting | `import { OsdsCode } from '@ovhcloud/ods-components/react';` | `<OsdsCode>const x = 1;</OsdsCode>` |
| **OsdsFlag** | Country flag display | `import { OsdsFlag } from '@ovhcloud/ods-components/react';` | `<OsdsFlag iso="FR" />` |
| **OsdsIcon** | Icon display | `import { OsdsIcon } from '@ovhcloud/ods-components/react';` | `<OsdsIcon name="home" />` |
| **OsdsMedium** | Media display component | `import { OsdsMedium } from '@ovhcloud/ods-components/react';` | `<OsdsMedium src="image.jpg" alt="Image" />` |

#### Form Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsFormField** | Combines label, help text, and error messages | `import { OsdsFormField } from '@ovhcloud/ods-components/react';` | `<OsdsFormField error="Error message"><OsdsInput /></OsdsFormField>` |
| **OsdsSelectGroup** | Grouped select options | `import { OsdsSelectGroup } from '@ovhcloud/ods-components/react';` | `<OsdsSelectGroup>...</OsdsSelectGroup>` |
| **OsdsSelectOption** | Individual select option | `import { OsdsSelectOption } from '@ovhcloud/ods-components/react';` | `<OsdsSelectOption value="1">Option 1</OsdsSelectOption>` |

#### Overlay Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsPopover** | Floating content container | `import { OsdsPopover } from '@ovhcloud/ods-components/react';` | `<OsdsPopover>Content</OsdsPopover>` |
| **OsdsPopoverContent** | Popover content wrapper | `import { OsdsPopoverContent } from '@ovhcloud/ods-components/react';` | `<OsdsPopoverContent>Content</OsdsPopoverContent>` |
| **OsdsTooltip** | Hover information display | `import { OsdsTooltip } from '@ovhcloud/ods-components/react';` | `<OsdsTooltip>Tooltip text</OsdsTooltip>` |
| **OsdsTooltipContent** | Tooltip content wrapper | `import { OsdsTooltipContent } from '@ovhcloud/ods-components/react';` | `<OsdsTooltipContent>Content</OsdsTooltipContent>` |

#### Utility Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsLink** | Styled link component | `import { OsdsLink } from '@ovhcloud/ods-components/react';` | `<OsdsLink href="/path">Link</OsdsLink>` |
| **OsdsClipboard** | Copy to clipboard functionality | `import { OsdsClipboard } from '@ovhcloud/ods-components/react';` | `<OsdsClipboard value="text to copy" />` |
| **OsdsContentAddon** | Content addon wrapper | `import { OsdsContentAddon } from '@ovhcloud/ods-components/react';` | `<OsdsContentAddon>Content</OsdsContentAddon>` |

#### Cart Components (E-commerce)
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsCart** | Shopping cart container | `import { OsdsCart } from '@ovhcloud/ods-components/react';` | `<OsdsCart>...</OsdsCart>` |
| **OsdsCartManager** | Cart management system | `import { OsdsCartManager } from '@ovhcloud/ods-components/react';` | `<OsdsCartManager sections={[]} />` |
| **OsdsCartHeader** | Cart header section | `import { OsdsCartHeader } from '@ovhcloud/ods-components/react';` | `<OsdsCartHeader headerTitle="Cart" />` |
| **OsdsCartSection** | Cart section divider | `import { OsdsCartSection } from '@ovhcloud/ods-components/react';` | `<OsdsCartSection>Section</OsdsCartSection>` |
| **OsdsCartItem** | Individual cart item | `import { OsdsCartItem } from '@ovhcloud/ods-components/react';` | `<OsdsCartItem>Item</OsdsCartItem>` |
| **OsdsCartItemOption** | Cart item option | `import { OsdsCartItemOption } from '@ovhcloud/ods-components/react';` | `<OsdsCartItemOption>Option</OsdsCartItemOption>` |
| **OsdsCartFooter** | Cart footer section | `import { OsdsCartFooter } from '@ovhcloud/ods-components/react';` | `<OsdsCartFooter>Footer</OsdsCartFooter>` |
| **OsdsCartFooterItem** | Cart footer item | `import { OsdsCartFooterItem } from '@ovhcloud/ods-components/react';` | `<OsdsCartFooterItem>Item</OsdsCartFooterItem>` |
| **OsdsCartTotal** | Cart total display | `import { OsdsCartTotal } from '@ovhcloud/ods-components/react';` | `<OsdsCartTotal>Total</OsdsCartTotal>` |

### Complete Component Props Reference

#### OsdsButton Component
```typescript
interface OsdsButtonProps {
  // Styling
  color?: 'default' | 'primary' | 'accent' | 'error' | 'info' | 'success' | 'warning' | 'promotion' | 'text';
  variant?: 'flat' | 'stroked' | 'ghost';
  size?: 'sm' | 'md';
  contrasted?: boolean;

  // State
  disabled?: boolean;
  inline?: boolean;
  circle?: boolean;

  // Link behavior
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
  download?: string;

  // Button behavior
  type?: 'button' | 'submit' | 'reset';
  textAlign?: 'start' | 'center' | 'end';

  // Content
  children?: React.ReactNode;
  className?: string;
}

// Usage Examples
<OsdsButton color="primary">Submit</OsdsButton>
<OsdsButton color="error" variant="ghost">Delete</OsdsButton>
<OsdsButton size="sm" disabled={isLoading}>Cancel</OsdsButton>
<OsdsButton href="/dashboard" target="_blank">Go to Dashboard</OsdsButton>
```

#### OsdsModal Component
```typescript
interface OsdsModalProps {
  // Header
  headline?: string;
  color?: 'default' | 'primary' | 'accent' | 'error' | 'info' | 'success' | 'warning' | 'promotion' | 'text';

  // Behavior
  dismissible?: boolean;
  masked?: boolean;

  // Content
  children?: React.ReactNode;
  className?: string;
}

// Methods available via ref
interface OsdsModalMethods {
  open: () => Promise<void>;
  close: () => Promise<void>;
}

// Events (use onOdsModalOpen, onOdsModalClose in React)
interface OsdsModalEvents {
  odsModalOpen: CustomEvent<void>;
  odsModalClose: CustomEvent<void>;
}

// Usage Examples
const modalRef = useRef<HTMLOsdsModalElement>(null);

<OsdsModal ref={modalRef} headline="Confirm Action" dismissible>
  <p>Are you sure you want to proceed?</p>
  <OsdsButton onClick={() => modalRef.current?.close()}>Close</OsdsButton>
</OsdsModal>

// Open programmatically
modalRef.current?.open();
```

#### OsdsInput Component
```typescript
interface OsdsInputProps {
  // Value
  value?: string | number | null;
  defaultValue?: string | number | null;

  // Type and validation
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time';
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;

  // Appearance
  size?: 'md';
  color?: 'default' | 'primary' | 'accent' | 'error' | 'info' | 'success' | 'warning';
  contrasted?: boolean;
  inline?: boolean;
  masked?: boolean;

  // Content
  placeholder?: string;
  label?: string;
  icon?: string; // ODS_ICON_NAME
  prefixValue?: string;

  // Numeric
  min?: number;
  max?: number;
  step?: number;

  // Features
  clearable?: boolean;
  loading?: boolean;

  // Accessibility
  ariaLabel?: string;
  ariaLabelledby?: string;
  name?: string;

  // Events (use onOdsValueChange, onOdsInputBlur, onOdsInputFocus in React)
  className?: string;
}

// Methods available via ref
interface OsdsInputMethods {
  setFocus: () => Promise<void>;
  clear: () => Promise<void>;
  reset: () => Promise<void>;
  hide: () => Promise<void>;
  getValidity: () => Promise<OdsInputValidityState>;
  stepUp: () => Promise<void>;
  stepDown: () => Promise<void>;
  setInputTabindex: (value: number) => Promise<void>;
}

// Usage Examples
<OsdsInput
  type="email"
  value={email}
  onOdsValueChange={(e) => setEmail(e.detail.value)}
  placeholder="Enter your email"
  required
  clearable
/>

<OsdsInput
  type="number"
  value={quantity}
  min={0}
  max={100}
  step={1}
  error={hasError}
  icon="shopping-cart"
/>
```

#### OsdsSelect Component
```typescript
interface OsdsSelectProps {
  // Value
  value?: string | number | null;
  defaultValue?: string | number | null;

  // State
  disabled?: boolean;
  required?: boolean;
  error?: boolean;

  // Appearance
  size?: 'md';
  color?: 'default' | 'primary' | 'accent' | 'error' | 'info' | 'success' | 'warning';
  inline?: boolean;

  // Accessibility
  ariaLabel?: string;
  ariaLabelledby?: string;
  name?: string;

  // Children: OsdsSelectOption elements
  children?: React.ReactNode;
  className?: string;
}

// Methods available via ref
interface OsdsSelectMethods {
  setFocus: () => Promise<void>;
  clear: () => Promise<void>;
  reset: () => Promise<void>;
  getValidity: () => Promise<OdsValidityState>;
  validate: () => Promise<OdsValidityState>;
  setInputTabindex: (value: number) => Promise<void>;
}

// Usage Examples
<OsdsSelect
  value={selectedCountry}
  onOdsValueChange={(e) => setSelectedCountry(e.detail.value)}
  required
>
  <OsdsSelectOption value="FR">France</OsdsSelectOption>
  <OsdsSelectOption value="US">United States</OsdsSelectOption>
  <OsdsSelectOption value="DE">Germany</OsdsSelectOption>
</OsdsSelect>

// With groups
<OsdsSelect value={selectedItem}>
  <OsdsSelectGroup>
    <OsdsSelectOption value="1">Option 1</OsdsSelectOption>
    <OsdsSelectOption value="2">Option 2</OsdsSelectOption>
  </OsdsSelectGroup>
</OsdsSelect>
```

#### OsdsCheckbox Component
```typescript
interface OsdsCheckboxProps {
  // Value
  checked: boolean;
  value?: string;

  // State
  disabled?: boolean;
  required?: boolean;
  updating?: boolean;
  hasFocus?: boolean;

  // Content
  label?: string;

  // Accessibility
  ariaLabel?: string;
  ariaLabelledby?: string;
  name?: string;

  // Pessimistic update callbacks
  beforeSave?: () => Promise<void>;
  save?: () => Promise<void>;
  afterSave?: () => Promise<void>;

  className?: string;
}

// Methods available via ref
interface OsdsCheckboxMethods {
  setFocus: () => Promise<void>;
  setTabindex: (index: number) => Promise<void>;
}

// Events (use onOdsCheckedChange in React)
interface OsdsCheckboxEvents {
  odsCheckedChange: CustomEvent<{ checked: boolean }>;
}

// Usage Examples
<OsdsCheckbox
  checked={isAccepted}
  onOdsCheckedChange={(e) => setIsAccepted(e.detail.checked)}
  label="I accept the terms and conditions"
  required
/>

<OsdsCheckbox
  checked={selectAll}
  label="Select all items"
  disabled={items.length === 0}
/>
```

#### OsdsFormField Component
```typescript
interface OsdsFormFieldProps {
  // Error state
  error?: string; // Error message to display

  // Appearance
  inline?: boolean;

  // Children: Input component
  children?: React.ReactNode;
  className?: string;
}

// Usage Examples
<OsdsFormField error={emailError}>
  <OsdsInput
    type="email"
    value={email}
    onOdsValueChange={(e) => setEmail(e.detail.value)}
    error={!!emailError}
    label="Email Address"
  />
</OsdsFormField>

<OsdsFormField error={passwordError}>
  <OsdsPassword
    value={password}
    onOdsValueChange={(e) => setPassword(e.detail.value)}
    error={!!passwordError}
    required
  />
</OsdsFormField>
```

#### OsdsMessage Component
```typescript
interface OsdsMessageProps {
  // Type (required)
  type?: 'error' | 'info' | 'success' | 'warning';

  // Appearance
  color?: 'default' | 'primary' | 'accent' | 'error' | 'info' | 'success' | 'warning';
  contrasted?: boolean;
  inline?: boolean;

  // Features
  removable?: boolean;
  icon?: string; // ODS_ICON_NAME

  // Content
  children?: React.ReactNode;
  className?: string;
}

// Usage Examples
<OsdsMessage type="success">
  Your changes have been saved successfully.
</OsdsMessage>

<OsdsMessage type="error" removable>
  An error occurred while processing your request.
</OsdsMessage>

<OsdsMessage type="warning" icon="warning-triangle">
  This action cannot be undone.
</OsdsMessage>
```

#### OsdsText Component
```typescript
interface OsdsTextProps {
  // Typography
  size?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800';
  level?: 1 | 2 | 3 | 4 | 5 | 6;

  // Color
  color?: 'default' | 'primary' | 'accent' | 'error' | 'info' | 'success' | 'warning' | 'text';
  hue?: string; // Color hue
  contrasted?: boolean;

  // Behavior
  breakSpaces?: boolean;

  // Content
  children?: React.ReactNode;
  className?: string;
}

// Usage Examples
<OsdsText size="600" level={1}>Main Heading</OsdsText>
<OsdsText size="400" color="text">Body text content</OsdsText>
<OsdsText size="300" color="error">Error message</OsdsText>
<OsdsText size="200" breakSpaces>
  Text with preserved line breaks
</OsdsText>
```

#### OsdsIcon Component
```typescript
interface OsdsIconProps {
  // Icon (required)
  name?: string; // ODS_ICON_NAME

  // Appearance
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  color?: 'default' | 'primary' | 'accent' | 'error' | 'info' | 'success' | 'warning' | 'text';
  contrasted?: boolean;
  hoverable?: boolean;

  // Accessibility
  ariaName?: string;

  className?: string;
}

// Usage Examples
<OsdsIcon name="home" size="md" />
<OsdsIcon name="check-circle" color="success" />
<OsdsIcon name="alert-triangle" color="warning" size="lg" />
<OsdsIcon name="trash" color="error" hoverable />
```

#### OsdsChip Component
```typescript
interface OsdsChipProps {
  // Appearance
  color?: 'default' | 'primary' | 'accent' | 'error' | 'info' | 'success' | 'warning' | 'promotion' | 'text';
  variant?: 'flat' | 'stroked';
  size?: 'sm' | 'md';
  contrasted?: boolean;

  // State
  disabled?: boolean;
  inline?: boolean;

  // Features
  removable?: boolean;
  selectable?: boolean;

  // Content
  children?: React.ReactNode;
  className?: string;
}

// Usage Examples
<OsdsChip color="success">Active</OsdsChip>
<OsdsChip color="warning" variant="stroked">Pending</OsdsChip>
<OsdsChip color="error" size="sm" removable>Error</OsdsChip>
<OsdsChip color="info" selectable>Selectable</OsdsChip>
```

#### OsdsDatagrid Component
```typescript
interface OsdsDatagridColumn {
  field: string;
  label: string;
  sortable?: boolean;
  // ... additional column properties
}

interface OsdsDatagridRow {
  [key: string]: any;
}

interface OsdsDatagridProps {
  // Data (required)
  columns: OsdsDatagridColumn[] | string; // Can be JSON string
  rows: OsdsDatagridRow[] | string; // Can be JSON string
  height: number; // Required, in pixels

  // Features
  isSelectable?: boolean;
  hasHideableColumns?: boolean;
  hideableColumns?: string[];
  rowHeight?: number;

  // Content
  noResultLabel?: string;

  className?: string;
}

// Usage Examples
const columns = [
  { field: 'name', label: 'Name', sortable: true },
  { field: 'email', label: 'Email' },
  { field: 'status', label: 'Status', sortable: true }
];

const rows = [
  { name: 'John Doe', email: 'john@example.com', status: 'active' },
  { name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' }
];

<OsdsDatagrid
  columns={columns}
  rows={rows}
  height={400}
  isSelectable
  rowHeight={48}
  noResultLabel="No data available"
/>
```

#### OsdsPagination Component
```typescript
interface OsdsPaginationProps {
  // Pagination (required)
  totalItems?: number;
  totalPages: number;
  defaultCurrentPage: number;
  defaultItemsPerPage: 10 | 25 | 50 | 100;

  // State
  disabled?: boolean;

  // Labels
  labelTooltipPrevious?: string;
  labelTooltipNext?: string;

  className?: string;
}

// Methods available via ref
interface OsdsPaginationMethods {
  getCurrentPage: () => Promise<number>;
  setPageIndex: (current: number) => Promise<void>;
}

// Events (use onOdsPaginationChanged, onOdsPaginationItemPerPageChanged in React)
interface OsdsPaginationEvents {
  odsPaginationChanged: CustomEvent<{ current: number }>;
  odsPaginationItemPerPageChanged: CustomEvent<{ itemsPerPage: number }>;
}

// Usage Examples
<OsdsPagination
  totalItems={150}
  totalPages={15}
  defaultCurrentPage={1}
  defaultItemsPerPage={10}
  onOdsPaginationChanged={(e) => setCurrentPage(e.detail.current)}
  onOdsPaginationItemPerPageChanged={(e) => setPageSize(e.detail.itemsPerPage)}
/>
```

#### OsdsBreadcrumb Component
```typescript
interface OdsBreadcrumbItem {
  label?: string;
  href: string;
  icon?: string; // ODS_ICON_NAME
  disabled?: boolean;
  referrerpolicy?: string;
  rel?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
}

interface OsdsBreadcrumbProps {
  // Items (required)
  items: OdsBreadcrumbItem[] | string; // Can be JSON string

  // Appearance
  contrasted?: boolean;

  className?: string;
}

// Usage Examples
<OsdsBreadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Details', href: '/products/123' }
  ]}
/>

// Using individual items
<OsdsBreadcrumb contrasted>
  <OsdsBreadcrumbItem href="/" label="Home" icon="home" />
  <OsdsBreadcrumbItem href="/products" label="Products" />
  <OsdsBreadcrumbItem href="/products/123" label="Details" disabled />
</OsdsBreadcrumb>
```

### Color Intent Values

All ODS components that support the `color` prop use the `ODS_THEME_COLOR_INTENT` enum:

```typescript
type ODS_THEME_COLOR_INTENT =
  | 'default'    // Default theme color
  | 'primary'    // Primary brand color
  | 'accent'     // Accent color
  | 'error'      // Error/danger color
  | 'info'       // Informational color
  | 'success'    // Success color
  | 'warning'    // Warning color
  | 'promotion'  // Promotional color
  | 'text';      // Text color
```

### Typography Size Values

Text components use numeric typography sizes:

```typescript
type ODS_TEXT_SIZE =
  | '100'  // Smallest
  | '200'
  | '300'
  | '400'  // Default/body
  | '500'
  | '600'
  | '700'
  | '800'; // Largest
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

const handleEmailChange = (event: CustomEvent<{ value: string }>) => {
  const newValue = event.detail.value;
  setEmail(newValue);
  validateEmail(newValue);
};

<OsdsFormField error={emailError}>
  <OsdsInput
    type="email"
    value={email}
    onOdsValueChange={handleEmailChange}
    onOdsInputBlur={() => validateEmail(email)}
    error={!!emailError}
    label="Email Address"
    required
    clearable
  />
</OsdsFormField>
```

#### 2. Modal with Confirmation Pattern
```typescript
const [isModalOpen, setIsModalOpen] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
const modalRef = useRef<HTMLOsdsModalElement>(null);

const handleDelete = async () => {
  setIsDeleting(true);
  try {
    await deleteItem(itemId);
    await modalRef.current?.close();
    // Handle success
  } catch (error) {
    // Handle error
  } finally {
    setIsDeleting(false);
  }
};

const openModal = () => {
  modalRef.current?.open();
};

<>
  <OsdsButton color="error" onClick={openModal}>
    Delete Item
  </OsdsButton>

  <OsdsModal
    ref={modalRef}
    headline="Delete Item"
    color="error"
    dismissible={!isDeleting}
  >
    <OsdsText>Are you sure you want to delete this item? This action cannot be undone.</OsdsText>
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
      <OsdsButton
        variant="ghost"
        onClick={() => modalRef.current?.close()}
        disabled={isDeleting}
      >
        Cancel
      </OsdsButton>
      <OsdsButton
        color="error"
        disabled={isDeleting}
        onClick={handleDelete}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </OsdsButton>
    </div>
  </OsdsModal>
</>
```

#### 3. Loading States Pattern
```typescript
const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState<DataType | null>(null);
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const result = await api.getData();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, []);

{isLoading ? (
  <OsdsSkeleton />
) : error ? (
  <OsdsMessage type="error">{error}</OsdsMessage>
) : data ? (
  <OsdsTile>
    <DataDisplay data={data} />
  </OsdsTile>
) : (
  <OsdsText>No data available</OsdsText>
)}
```

#### 4. Select with Dynamic Options Pattern
```typescript
const [countries, setCountries] = useState<Array<{code: string; name: string}>>([]);
const [selectedCountry, setSelectedCountry] = useState('');
const [isLoadingCountries, setIsLoadingCountries] = useState(false);

useEffect(() => {
  const loadCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const data = await api.getCountries();
      setCountries(data);
    } catch (error) {
      console.error('Failed to load countries', error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  loadCountries();
}, []);

<OsdsSelect
  value={selectedCountry}
  onOdsValueChange={(e) => setSelectedCountry(e.detail.value)}
  disabled={isLoadingCountries}
  required
>
  {isLoadingCountries ? (
    <OsdsSelectOption value="" disabled>Loading countries...</OsdsSelectOption>
  ) : (
    countries.map(country => (
      <OsdsSelectOption key={country.code} value={country.code}>
        {country.name}
      </OsdsSelectOption>
    ))
  )}
</OsdsSelect>
```

#### 5. Data Table with Pagination Pattern
```typescript
const [data, setData] = useState<DataRow[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [totalItems, setTotalItems] = useState(0);
const [isLoading, setIsLoading] = useState(false);

const columns: OdsDatagridColumn[] = [
  { field: 'name', label: 'Name', sortable: true },
  { field: 'email', label: 'Email', sortable: false },
  { field: 'status', label: 'Status', sortable: true }
];

const fetchData = async (page: number, size: number) => {
  setIsLoading(true);
  try {
    const result = await api.getData({ page, size });
    setData(result.items);
    setTotalItems(result.total);
  } catch (error) {
    console.error('Failed to fetch data', error);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchData(currentPage, pageSize);
}, [currentPage, pageSize]);

const handlePageChange = (event: CustomEvent<{ current: number }>) => {
  setCurrentPage(event.detail.current);
};

const handlePageSizeChange = (event: CustomEvent<{ itemsPerPage: number }>) => {
  setPageSize(event.detail.itemsPerPage);
  setCurrentPage(1); // Reset to first page
};

{isLoading ? (
  <OsdsSkeleton />
) : (
  <>
    <OsdsDatagrid
      columns={columns}
      rows={data}
      height={400}
      isSelectable
      rowHeight={48}
      noResultLabel="No data available"
    />
    <OsdsPagination
      totalItems={totalItems}
      totalPages={Math.ceil(totalItems / pageSize)}
      defaultCurrentPage={currentPage}
      defaultItemsPerPage={pageSize as 10 | 25 | 50 | 100}
      onOdsPaginationChanged={handlePageChange}
      onOdsPaginationItemPerPageChanged={handlePageSizeChange}
    />
  </>
)}
```

#### 6. Tabs with Content Pattern
```typescript
const [activeTab, setActiveTab] = useState('general');

<OsdsTabs>
  <OsdsTabBar>
    <OsdsTabBarItem
      onClick={() => setActiveTab('general')}
      className={activeTab === 'general' ? 'active' : ''}
    >
      General
    </OsdsTabBarItem>
    <OsdsTabBarItem
      onClick={() => setActiveTab('settings')}
      className={activeTab === 'settings' ? 'active' : ''}
    >
      Settings
    </OsdsTabBarItem>
    <OsdsTabBarItem
      onClick={() => setActiveTab('advanced')}
      className={activeTab === 'advanced' ? 'active' : ''}
    >
      Advanced
    </OsdsTabBarItem>
  </OsdsTabBar>

  {activeTab === 'general' && (
    <OsdsTabPanel>
      <OsdsText size="400">General information content</OsdsText>
    </OsdsTabPanel>
  )}

  {activeTab === 'settings' && (
    <OsdsTabPanel>
      <OsdsText size="400">Settings content</OsdsText>
    </OsdsTabPanel>
  )}

  {activeTab === 'advanced' && (
    <OsdsTabPanel>
      <OsdsText size="400">Advanced configuration</OsdsText>
    </OsdsTabPanel>
  )}
</OsdsTabs>
```

#### 7. Accordion with Dynamic Content Pattern
```typescript
const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

const toggleItem = (itemId: string) => {
  setExpandedItems(prev => {
    const newSet = new Set(prev);
    if (newSet.has(itemId)) {
      newSet.delete(itemId);
    } else {
      newSet.add(itemId);
    }
    return newSet;
  });
};

<OsdsAccordionGroup>
  {items.map(item => (
    <OsdsAccordion
      key={item.id}
      opened={expandedItems.has(item.id)}
      onClick={() => toggleItem(item.id)}
    >
      <div slot="summary">
        <OsdsText size="400">{item.title}</OsdsText>
      </div>
      <OsdsText size="300">{item.content}</OsdsText>
    </OsdsAccordion>
  ))}
</OsdsAccordionGroup>
```

### Common Pitfalls and Solutions

#### ❌ Wrong: Using React onChange Instead of ODS Event
```typescript
// ODS components emit custom events, not React synthetic events
<OsdsInput onChange={(e) => setValue(e.target.value)} />
```

#### ✅ Correct: Use ODS Custom Events
```typescript
<OsdsInput onOdsValueChange={(e) => setValue(e.detail.value)} />
```

#### ❌ Wrong: Missing Required Props
```typescript
// Missing required type prop
<OsdsInput value={email} />
```

#### ✅ Correct: All Required Props
```typescript
<OsdsInput type="email" value={email} onOdsValueChange={handleChange} />
```

#### ❌ Wrong: Using Uncontrolled Modal State
```typescript
// Cannot control modal visibility with state
<OsdsModal open={isOpen}>Content</OsdsModal>
```

#### ✅ Correct: Use Ref and Methods
```typescript
const modalRef = useRef<HTMLOsdsModalElement>(null);

// Open/close via ref methods
<OsdsModal ref={modalRef} headline="Title">Content</OsdsModal>
<OsdsButton onClick={() => modalRef.current?.open()}>Open</OsdsButton>
```

#### ❌ Wrong: Missing Form Validation
```typescript
<OsdsInput type="email" value={email} />
```

#### ✅ Correct: With Validation and Error Display
```typescript
<OsdsFormField error={emailError}>
  <OsdsInput
    type="email"
    value={email}
    onOdsValueChange={handleEmailChange}
    error={!!emailError}
    required
  />
</OsdsFormField>
```

#### ❌ Wrong: Direct Child Elements in Select
```typescript
<OsdsSelect value={value}>
  <option value="1">Option 1</option>
</OsdsSelect>
```

#### ✅ Correct: Use OsdsSelectOption Components
```typescript
<OsdsSelect value={value} onOdsValueChange={handleChange}>
  <OsdsSelectOption value="1">Option 1</OsdsSelectOption>
  <OsdsSelectOption value="2">Option 2</OsdsSelectOption>
</OsdsSelect>
```

#### ❌ Wrong: Using HTML Attributes for Styling
```typescript
<OsdsButton style={{ color: 'red', fontSize: '20px' }}>Button</OsdsButton>
```

#### ✅ Correct: Use ODS Props for Styling
```typescript
<OsdsButton color="error" size="md">Button</OsdsButton>
```

#### ❌ Wrong: Incorrect Icon Name
```typescript
<OsdsIcon name="home-icon" />
```

#### ✅ Correct: Use Valid ODS Icon Names
```typescript
<OsdsIcon name="home" />
```

### Performance Best Practices

#### 1. Memoization
```typescript
// Memoize data transformations
const selectOptions = useMemo(() =>
  data.map(item => ({
    value: item.id,
    label: item.name
  })),
  [data]
);

// Memoize event handlers
const handleSubmit = useCallback((e: CustomEvent) => {
  e.preventDefault();
  onSubmit(formData);
}, [formData, onSubmit]);

<OsdsSelect value={selected} onOdsValueChange={handleSubmit}>
  {selectOptions.map(opt => (
    <OsdsSelectOption key={opt.value} value={opt.value}>
      {opt.label}
    </OsdsSelectOption>
  ))}
</OsdsSelect>
```

#### 2. Conditional Rendering
```typescript
// Efficient conditional rendering
{isLoading ? (
  <OsdsSpinner />
) : error ? (
  <OsdsMessage type="error">{error}</OsdsMessage>
) : data ? (
  <DataComponent data={data} />
) : (
  <OsdsText>No data available</OsdsText>
)}
```

#### 3. Lazy Loading for Large Datasets
```typescript
// Use virtualization for large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }: { items: Item[] }) => (
  <List
    height={400}
    itemCount={items.length}
    itemSize={50}
    itemData={items}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <OsdsText>{data[index].name}</OsdsText>
      </div>
    )}
  </List>
);
```

#### 4. Avoid Unnecessary Re-renders
```typescript
// Use React.memo for components that don't need frequent updates
const MemoizedListItem = React.memo(({ item }: { item: Item }) => (
  <OsdsTile>
    <OsdsText>{item.name}</OsdsText>
    <OsdsText size="300" color="text">{item.description}</OsdsText>
  </OsdsTile>
));

// Use key prop for list items
{items.map(item => (
  <MemoizedListItem key={item.id} item={item} />
))}
```

### Testing Guidelines

#### 1. Component Testing with Test IDs
```typescript
// Include data-testid attributes via className or custom attributes
<OsdsButton
  color="primary"
  onClick={handleSubmit}
  data-testid="submit-button"
>
  Submit
</OsdsButton>

<OsdsInput
  type="email"
  value={email}
  onOdsValueChange={setEmail}
  data-testid="email-input"
/>
```

#### 2. Testing Custom Events
```typescript
// Example test with React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

test('input emits value change event', async () => {
  const handleChange = jest.fn();
  render(
    <OsdsInput
      type="text"
      value=""
      onOdsValueChange={handleChange}
      data-testid="test-input"
    />
  );

  const input = screen.getByTestId('test-input');
  const nativeInput = input.querySelector('input');

  fireEvent.input(nativeInput!, { target: { value: 'test' } });

  await waitFor(() => {
    expect(handleChange).toHaveBeenCalled();
  });
});
```

#### 3. Testing Modal Interactions
```typescript
test('modal opens and closes programmatically', async () => {
  const TestComponent = () => {
    const modalRef = useRef<HTMLOsdsModalElement>(null);

    return (
      <>
        <OsdsButton onClick={() => modalRef.current?.open()} data-testid="open-btn">
          Open
        </OsdsButton>
        <OsdsModal ref={modalRef} headline="Test Modal" data-testid="modal">
          Content
        </OsdsModal>
      </>
    );
  };

  render(<TestComponent />);

  const openButton = screen.getByTestId('open-btn');
  fireEvent.click(openButton);

  await waitFor(() => {
    const modal = screen.getByTestId('modal');
    expect(modal).toBeVisible();
  });
});
```

#### 4. Accessibility Testing
```typescript
// Test ARIA attributes and keyboard navigation
test('button has correct ARIA attributes', () => {
  render(
    <OsdsButton
      color="primary"
      aria-label="Submit form"
      data-testid="submit-btn"
    >
      Submit
    </OsdsButton>
  );

  const button = screen.getByTestId('submit-btn');
  expect(button).toHaveAttribute('aria-label', 'Submit form');
});
```

### Integration with Manager React Components (MRC)

```typescript
// Use ODS for basic UI components
import {
  OsdsButton,
  OsdsModal,
  OsdsInput,
  OsdsText,
  OsdsIcon,
  OsdsFormField
} from '@ovhcloud/ods-components/react';

// Use MRC for Manager-specific functionality with IAM
import { ManagerButton, ManagerText } from '@ovh-ux/manager-react-components';

// Basic ODS usage
<OsdsButton color="primary" onClick={handleClick}>
  Basic Action
</OsdsButton>

// Manager-specific usage with authorization
<ManagerButton
  id="delete-resource"
  label="Delete"
  iamActions={['resource:delete']}
  urn={`urn:v1:eu:resource:${resourceId}`}
/>

// Combining ODS and MRC
<OsdsTile>
  <OsdsText size="500">Resource Management</OsdsText>
  <OsdsText size="300" color="text">Manage your resources</OsdsText>
  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
    <OsdsButton color="primary">View Details</OsdsButton>
    <ManagerButton
      id="create-resource"
      label="Create Resource"
      iamActions={['resource:create']}
    />
  </div>
</OsdsTile>
```

### Theme Integration

```typescript
// Import theme first in your main App or index file
import '@ovhcloud/ods-themes/default';

// Or use specific theme
import '@ovhcloud/ods-themes/blue-jeans';

// Then import components
import {
  OsdsButton,
  OsdsModal,
  OsdsInput,
  OsdsText,
  OsdsIcon
} from '@ovhcloud/ods-components/react';

// Components will automatically use the theme
function App() {
  return (
    <div>
      <OsdsButton color="primary">Themed Button</OsdsButton>
    </div>
  );
}
```

### Advanced Component Usage

#### 1. Custom Form Components
```typescript
// Create reusable form components with ODS
interface FormInputProps {
  label: string;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  type = 'text',
  value,
  onChange,
  required,
  placeholder
}) => (
  <OsdsFormField error={error}>
    <OsdsInput
      type={type}
      value={value}
      onOdsValueChange={(e) => onChange(e.detail.value)}
      error={!!error}
      label={label}
      required={required}
      placeholder={placeholder}
      clearable
    />
  </OsdsFormField>
);

// Usage
<FormInput
  label="Email"
  value={email}
  onChange={setEmail}
  error={emailError}
  type="email"
  required
  placeholder="your.email@example.com"
/>
```

#### 2. Status Indicator Components
```typescript
// Create status display components
interface StatusChipProps {
  status: 'active' | 'inactive' | 'pending' | 'error';
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const colorMap: Record<string, ODS_THEME_COLOR_INTENT> = {
    active: 'success',
    inactive: 'default',
    pending: 'warning',
    error: 'error'
  };

  const labelMap: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    error: 'Error'
  };

  return (
    <OsdsChip color={colorMap[status]}>
      {labelMap[status]}
    </OsdsChip>
  );
};

// Usage in datagrid
const columns = [
  { field: 'name', label: 'Name' },
  {
    field: 'status',
    label: 'Status',
    render: (row: any) => <StatusChip status={row.status} />
  }
];
```

#### 3. Layout Components
```typescript
// Create layout components
interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href: string }>;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  children,
  actions,
  breadcrumbs
}) => (
  <div>
    {breadcrumbs && (
      <OsdsBreadcrumb items={breadcrumbs} />
    )}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      marginTop: '16px'
    }}>
      <OsdsText size="700" level={1}>{title}</OsdsText>
      {actions && <div style={{ display: 'flex', gap: '8px' }}>{actions}</div>}
    </div>
    <OsdsDivider separator />
    <div style={{ marginTop: '16px' }}>
      {children}
    </div>
  </div>
);

// Usage
<PageLayout
  title="User Management"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Users', href: '/users' }
  ]}
  actions={
    <>
      <OsdsButton variant="ghost">Import</OsdsButton>
      <OsdsButton color="primary">Add User</OsdsButton>
    </>
  }
>
  <OsdsDatagrid columns={columns} rows={users} height={400} />
</PageLayout>
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always import theme first**: `import '@ovhcloud/ods-themes/default';`
2. **Use ODS component names**: `import { OsdsButton, OsdsModal, OsdsInput } from '@ovhcloud/ods-components/react';`
3. **Use custom events**: ODS components emit custom events (e.g., `onOdsValueChange`), not React synthetic events
4. **Include all required props**: Check interface definitions above (e.g., `type` is required for OsdsInput)
5. **Use refs for imperative methods**: Modal, Select, Input have methods accessible via ref
6. **Handle loading states**: Show Spinner or Skeleton during data fetching
7. **Implement validation**: Use `OsdsFormField` with `error` prop for error messages
8. **Use semantic colors**: Use `color` prop with theme intents (primary, error, success, warning, etc.)
9. **Handle events correctly**: Use `event.detail` to access custom event data
10. **Optimize performance**: Use memoization and avoid unnecessary re-renders

### Component Selection Guide

- **Basic UI**: Use ODS components (`OsdsButton`, `OsdsInput`, `OsdsModal`, `OsdsText`, `OsdsIcon`)
- **Manager-specific**: Use MRC components (`ManagerButton`, `ManagerText`) for IAM-aware features
- **Forms**: Always wrap inputs with `OsdsFormField` for consistent error display
- **Feedback**: Use `OsdsMessage` for alerts, `OsdsSpinner`/`OsdsSkeleton` for loading
- **Navigation**: Use `OsdsBreadcrumb`, `OsdsPagination` for navigation
- **Layout**: Use `OsdsTile`, `OsdsAccordion`, `OsdsTabs` for content organization
- **Data Display**: Use `OsdsDatagrid` for complex tables with sorting/selection
- **Input Controls**: Use `OsdsSelect`, `OsdsCheckbox`, `OsdsRadio` for form controls
- **Overlays**: Use ref methods to control `OsdsModal`, `OsdsPopover`

### Complete Component Import Reference

```typescript
// Input Components
import {
  OsdsButton, OsdsInput, OsdsSelect, OsdsCheckbox, OsdsCheckboxButton,
  OsdsRadio, OsdsRadioButton, OsdsRadioGroup, OsdsSwitch,
  OsdsToggle, OsdsRange, OsdsPassword, OsdsTextarea, OsdsDatepicker,
  OsdsPhoneNumber, OsdsSearchBar, OsdsQuantity
} from '@ovhcloud/ods-components/react';

// Layout Components
import {
  OsdsModal, OsdsAccordion, OsdsAccordionGroup, OsdsCollapsible,
  OsdsTabs, OsdsTabBar, OsdsTabBarItem, OsdsTabPanel, OsdsTile, OsdsDivider
} from '@ovhcloud/ods-components/react';

// Navigation Components
import {
  OsdsBreadcrumb, OsdsBreadcrumbItem, OsdsPagination, OsdsMenu,
  OsdsMenuGroup, OsdsMenuItem
} from '@ovhcloud/ods-components/react';

// Feedback Components
import {
  OsdsMessage, OsdsSpinner, OsdsSkeleton, OsdsProgressBar, OsdsChip
} from '@ovhcloud/ods-components/react';

// Data Display Components
import {
  OsdsTable, OsdsDatagrid, OsdsText, OsdsCode, OsdsFlag, OsdsIcon, OsdsMedium
} from '@ovhcloud/ods-components/react';

// Form Components
import {
  OsdsFormField, OsdsSelectGroup, OsdsSelectOption
} from '@ovhcloud/ods-components/react';

// Overlay Components
import {
  OsdsPopover, OsdsPopoverContent, OsdsTooltip, OsdsTooltipContent
} from '@ovhcloud/ods-components/react';

// Utility Components
import {
  OsdsLink, OsdsClipboard, OsdsContentAddon
} from '@ovhcloud/ods-components/react';

// Cart Components (E-commerce)
import {
  OsdsCart, OsdsCartManager, OsdsCartHeader, OsdsCartSection,
  OsdsCartItem, OsdsCartItemOption, OsdsCartFooter, OsdsCartFooterItem, OsdsCartTotal
} from '@ovhcloud/ods-components/react';

// Type imports
import type {
  ODS_THEME_COLOR_INTENT,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_SIZE
} from '@ovhcloud/ods-components';
```

### Quick Reference: Common Patterns

```typescript
// Form Input with Validation
<OsdsFormField error={error}>
  <OsdsInput
    type="email"
    value={value}
    onOdsValueChange={(e) => setValue(e.detail.value)}
    error={!!error}
    required
    clearable
  />
</OsdsFormField>

// Modal with Actions
const modalRef = useRef<HTMLOsdsModalElement>(null);
<OsdsModal ref={modalRef} headline="Title" dismissible>
  <OsdsText>Content</OsdsText>
  <OsdsButton onClick={() => modalRef.current?.close()}>Close</OsdsButton>
</OsdsModal>

// Select with Options
<OsdsSelect value={selected} onOdsValueChange={(e) => setSelected(e.detail.value)}>
  <OsdsSelectOption value="1">Option 1</OsdsSelectOption>
  <OsdsSelectOption value="2">Option 2</OsdsSelectOption>
</OsdsSelect>

// Loading State
{isLoading ? <OsdsSpinner /> : <DataComponent data={data} />}

// Message Alert
<OsdsMessage type="error">An error occurred</OsdsMessage>

// Pagination
<OsdsPagination
  totalItems={100}
  totalPages={10}
  defaultCurrentPage={1}
  defaultItemsPerPage={10}
  onOdsPaginationChanged={(e) => setPage(e.detail.current)}
/>
```
