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
| **OsdsSelect** | Standard dropdown selection | `import { OsdsSelect } from '@ovhcloud/ods-components/react';` | `<OsdsSelect options={[{value:'1',label:'Option 1'}]} />` |
| **OsdsCheckbox** | Boolean selection control | `import { OsdsCheckbox } from '@ovhcloud/ods-components/react';` | `<OsdsCheckbox label="Accept terms" />` |
| **OsdsCheckboxButton** | Checkbox styled as button | `import { OsdsCheckboxButton } from '@ovhcloud/ods-components/react';` | `<OsdsCheckboxButton label="Option" />` |
| **OsdsRadio** | Single selection from multiple options | `import { OsdsRadio } from '@ovhcloud/ods-components/react';` | `<OsdsRadio name="choice" value="1" />` |
| **OsdsRadioButton** | Radio styled as button | `import { OsdsRadioButton } from '@ovhcloud/ods-components/react';` | `<OsdsRadioButton name="choice" value="1" />` |
| **OsdsRadioGroup** | Group of radio buttons | `import { OsdsRadioGroup } from '@ovhcloud/ods-components/react';` | `<OsdsRadioGroup name="choice">...</OsdsRadioGroup>` |
| **OsdsSwitch** | Toggle switch control | `import { OsdsSwitch } from '@ovhcloud/ods-components/react';` | `<OsdsSwitch checked={isOn} />` |
| **OsdsSwitchItem** | Switch item for grouped switches | `import { OsdsSwitchItem } from '@ovhcloud/ods-components/react';` | `<OsdsSwitchItem label="Option" />` |
| **OsdsToggle** | Toggle button control | `import { OsdsToggle } from '@ovhcloud/ods-components/react';` | `<OsdsToggle checked={isOn} />` |
| **OsdsRange** | Slider input for numeric values | `import { OsdsRange } from '@ovhcloud/ods-components/react';` | `<OsdsRange min={0} max={100} value={50} />` |
| **OsdsPassword** | Password input with visibility toggle | `import { OsdsPassword } from '@ovhcloud/ods-components/react';` | `<OsdsPassword placeholder="Password" />` |
| **OsdsTextarea** | Multi-line text input | `import { OsdsTextarea } from '@ovhcloud/ods-components/react';` | `<OsdsTextarea placeholder="Enter text" />` |
| **OsdsDatepicker** | Date selection input | `import { OsdsDatepicker } from '@ovhcloud/ods-components/react';` | `<OsdsDatepicker value={date} />` |
| **OsdsPhoneNumber** | Phone number input with validation | `import { OsdsPhoneNumber } from '@ovhcloud/ods-components/react';` | `<OsdsPhoneNumber value={phone} />` |
| **OsdsSearchBar** | Search input with icon | `import { OsdsSearchBar } from '@ovhcloud/ods-components/react';` | `<OsdsSearchBar placeholder="Search..." />` |
| **OsdsQuantity** | Numeric input with increment/decrement | `import { OsdsQuantity } from '@ovhcloud/ods-components/react';` | `<OsdsQuantity value={1} min={0} max={10} />` |

#### Layout Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsModal** | Centered dialog window | `import { OsdsModal } from '@ovhcloud/ods-components/react';` | `<OsdsModal open title="Confirm">Content</OsdsModal>` |
| **OsdsAccordion** | Expandable/collapsible container | `import { OsdsAccordion } from '@ovhcloud/ods-components/react';` | `<OsdsAccordion summary="Details">Content</OsdsAccordion>` |
| **OsdsAccordionGroup** | Group of accordions | `import { OsdsAccordionGroup } from '@ovhcloud/ods-components/react';` | `<OsdsAccordionGroup>...</OsdsAccordionGroup>` |
| **OsdsCollapsible** | Collapsible content container | `import { OsdsCollapsible } from '@ovhcloud/ods-components/react';` | `<OsdsCollapsible open>Content</OsdsCollapsible>` |
| **OsdsTabs** | Tab container | `import { OsdsTabs } from '@ovhcloud/ods-components/react';` | `<OsdsTabs>...</OsdsTabs>` |
| **OsdsTabBar** | Tab navigation bar | `import { OsdsTabBar } from '@ovhcloud/ods-components/react';` | `<OsdsTabBar>...</OsdsTabBar>` |
| **OsdsTabBarItem** | Individual tab item | `import { OsdsTabBarItem } from '@ovhcloud/ods-components/react';` | `<OsdsTabBarItem label="Tab 1" />` |
| **OsdsTabPanel** | Tab content panel | `import { OsdsTabPanel } from '@ovhcloud/ods-components/react';` | `<OsdsTabPanel>Content</OsdsTabPanel>` |
| **OsdsTile** | Visual container for grouped content | `import { OsdsTile } from '@ovhcloud/ods-components/react';` | `<OsdsTile title="Information">Content</OsdsTile>` |
| **OsdsDivider** | Visual separator line | `import { OsdsDivider } from '@ovhcloud/ods-components/react';` | `<OsdsDivider />` |

#### Navigation Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsBreadcrumb** | Hierarchical navigation path | `import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';` | `<OsdsBreadcrumb items={[{label:'Home'}]} />` |
| **OsdsBreadcrumbItem** | Individual breadcrumb item | `import { OsdsBreadcrumbItem } from '@ovhcloud/ods-components/react';` | `<OsdsBreadcrumbItem label="Home" />` |
| **OsdsPagination** | Page navigation control | `import { OsdsPagination } from '@ovhcloud/ods-components/react';` | `<OsdsPagination total={100} pageSize={10} />` |
| **OsdsMenu** | Dropdown menu container | `import { OsdsMenu } from '@ovhcloud/ods-components/react';` | `<OsdsMenu>...</OsdsMenu>` |
| **OsdsMenuGroup** | Grouped menu items | `import { OsdsMenuGroup } from '@ovhcloud/ods-components/react';` | `<OsdsMenuGroup label="Group">...</OsdsMenuGroup>` |
| **OsdsMenuItem** | Individual menu item | `import { OsdsMenuItem } from '@ovhcloud/ods-components/react';` | `<OsdsMenuItem label="Item" />` |

#### Feedback Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsMessage** | Feedback alert (info, error, success) | `import { OsdsMessage } from '@ovhcloud/ods-components/react';` | `<OsdsMessage type="success">Saved</OsdsMessage>` |
| **OsdsSpinner** | Circular loading indicator | `import { OsdsSpinner } from '@ovhcloud/ods-components/react';` | `<OsdsSpinner />` |
| **OsdsSkeleton** | Loading placeholder element | `import { OsdsSkeleton } from '@ovhcloud/ods-components/react';` | `<OsdsSkeleton width="100%" height="20px" />` |
| **OsdsProgressBar** | Progress indicator | `import { OsdsProgressBar } from '@ovhcloud/ods-components/react';` | `<OsdsProgressBar value={50} max={100} />` |
| **OsdsChip** | Small labeled element | `import { OsdsChip } from '@ovhcloud/ods-components/react';` | `<OsdsChip color="primary">Tag</OsdsChip>` |

#### Data Display Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsTable** | Data table | `import { OsdsTable } from '@ovhcloud/ods-components/react';` | `<OsdsTable data={rows} columns={columns} />` |
| **OsdsDatagrid** | Advanced data grid | `import { OsdsDatagrid } from '@ovhcloud/ods-components/react';` | `<OsdsDatagrid data={data} />` |
| **OsdsText** | Text display component | `import { OsdsText } from '@ovhcloud/ods-components/react';` | `<OsdsText>Hello World</OsdsText>` |
| **OsdsCode** | Code display with syntax highlighting | `import { OsdsCode } from '@ovhcloud/ods-components/react';` | `<OsdsCode language="javascript">code</OsdsCode>` |
| **OsdsFlag** | Country flag display | `import { OsdsFlag } from '@ovhcloud/ods-components/react';` | `<OsdsFlag iso="FR" />` |
| **OsdsIcon** | Icon display | `import { OsdsIcon } from '@ovhcloud/ods-components/react';` | `<OsdsIcon name="home" />` |
| **OsdsMedium** | Media display component | `import { OsdsMedium } from '@ovhcloud/ods-components/react';` | `<OsdsMedium src="image.jpg" />` |

#### Form Components
| Component | Description | Import | Basic Example |
|-----------|-------------|---------|---------------|
| **OsdsFormField** | Combines label, help text, and input control | `import { OsdsFormField } from '@ovhcloud/ods-components/react';` | `<OsdsFormField label="Name"><OsdsInput /></OsdsFormField>` |
| **OsdsSelectGroup** | Grouped select options | `import { OsdsSelectGroup } from '@ovhcloud/ods-components/react';` | `<OsdsSelectGroup label="Group">...</OsdsSelectGroup>` |
| **OsdsSelectOption** | Individual select option | `import { OsdsSelectOption } from '@ovhcloud/ods-components/react';` | `<OsdsSelectOption value="1" label="Option 1" />` |

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
| **OsdsCartManager** | Cart management system | `import { OsdsCartManager } from '@ovhcloud/ods-components/react';` | `<OsdsCartManager>...</OsdsCartManager>` |
| **OsdsCartHeader** | Cart header section | `import { OsdsCartHeader } from '@ovhcloud/ods-components/react';` | `<OsdsCartHeader>Header</OsdsCartHeader>` |
| **OsdsCartSection** | Cart section divider | `import { OsdsCartSection } from '@ovhcloud/ods-components/react';` | `<OsdsCartSection>Section</OsdsCartSection>` |
| **OsdsCartItem** | Individual cart item | `import { OsdsCartItem } from '@ovhcloud/ods-components/react';` | `<OsdsCartItem>Item</OsdsCartItem>` |
| **OsdsCartItemOption** | Cart item option | `import { OsdsCartItemOption } from '@ovhcloud/ods-components/react';` | `<OsdsCartItemOption>Option</OsdsCartItemOption>` |
| **OsdsCartFooter** | Cart footer section | `import { OsdsCartFooter } from '@ovhcloud/ods-components/react';` | `<OsdsCartFooter>Footer</OsdsCartFooter>` |
| **OsdsCartFooterItem** | Cart footer item | `import { OsdsCartFooterItem } from '@ovhcloud/ods-components/react';` | `<OsdsCartFooterItem>Item</OsdsCartFooterItem>` |
| **OsdsCartTotal** | Cart total display | `import { OsdsCartTotal } from '@ovhcloud/ods-components/react';` | `<OsdsCartTotal total={100} />` |

### Complete Component Props Reference

#### OsdsButton Component
```typescript
interface OsdsButtonProps {
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
<OsdsButton color="primary" onClick={handleSubmit}>Submit</OsdsButton>
<OsdsButton color="critical" isLoading={isDeleting}>Delete</OsdsButton>
<OsdsButton variant="ghost" size="s">Cancel</OsdsButton>
```

#### OsdsModal Component
```typescript
interface OsdsModalProps {
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
<OsdsModal open={isOpen} onClose={() => setIsOpen(false)} title="Confirm">
  <p>Are you sure you want to delete this item?</p>
</OsdsModal>

<OsdsModal open={isOpen} color="critical" isDismissible={false}>
  <h2>Critical Action Required</h2>
  <p>This action cannot be undone.</p>
</OsdsModal>
```

#### OsdsInput Component
```typescript
interface OsdsInputProps {
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
<OsdsInput 
  value={email} 
  onChange={setEmail}
  type="email"
  placeholder="Enter your email"
  isRequired
/>

<OsdsInput 
  value={password}
  onChange={setPassword}
  type="password"
  hasError={!!passwordError}
  errorMessage={passwordError}
/>
```

#### OsdsSelect Component
```typescript
interface OsdsSelectProps {
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
<OsdsSelect 
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="Choose an option"
/>

<OsdsSelect 
  options={countries}
  value={country}
  onChange={setCountry}
  hasError={!!countryError}
  errorMessage={countryError}
  isRequired
/>
```

#### OsdsCheckbox Component
```typescript
interface OsdsCheckboxProps {
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
<OsdsCheckbox 
  checked={isAccepted}
  onChange={setIsAccepted}
  label="I accept the terms and conditions"
  isRequired
/>

<OsdsCheckbox 
  checked={isIndeterminate}
  isIndeterminate={isIndeterminate}
  onChange={handleIndeterminateChange}
  label="Select all items"
/>
```

#### OsdsFormField Component
```typescript
interface OsdsFormFieldProps {
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
<OsdsFormField 
  label="Email Address" 
  helpText="We'll never share your email"
  hasError={!!emailError}
  errorMessage={emailError}
  isRequired
>
  <OsdsInput 
    type="email"
    value={email}
    onChange={setEmail}
    hasError={!!emailError}
  />
</OsdsFormField>
```

#### OsdsMessage Component
```typescript
interface OsdsMessageProps {
  type: 'info' | 'success' | 'warning' | 'error';  // Required
  title?: string;
  children?: React.ReactNode;
  isDismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<OsdsMessage type="success" title="Success!">
  Your changes have been saved successfully.
</OsdsMessage>

<OsdsMessage type="error" isDismissible onDismiss={handleDismiss}>
  An error occurred while processing your request.
</OsdsMessage>
```

#### OsdsTile Component
```typescript
interface OsdsTileProps {
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
<OsdsTile 
  title="Product Information"
  subtitle="Basic details"
  image={{ src: "/product.jpg", alt: "Product image" }}
  actions={<OsdsButton>Edit</OsdsButton>}
>
  <p>Product description goes here.</p>
</OsdsTile>
```

#### OsdsChip Component
```typescript
interface OsdsChipProps {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'flat' | 'stroked';
  size?: 'xs' | 's' | 'm' | 'l';
  children?: React.ReactNode;
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<OsdsChip color="success">Active</OsdsChip>
<OsdsChip color="warning" variant="stroked">Pending</OsdsChip>
<OsdsChip color="error" size="s">Error</OsdsChip>
```

#### OsdsText Component
```typescript
interface OsdsTextProps {
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  children?: React.ReactNode;
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<OsdsText size="l" weight="bold">Heading</OsdsText>
<OsdsText color="secondary">Secondary text</OsdsText>
<OsdsText size="s" color="error">Error message</OsdsText>
```

#### OsdsIcon Component
```typescript
interface OsdsIconProps {
  name: string;                    // Required - icon name
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<OsdsIcon name="home" size="m" />
<OsdsIcon name="check" color="success" />
<OsdsIcon name="warning" color="warning" size="l" />
```

#### OsdsTable Component
```typescript
interface OsdsTableProps {
  data: Array<any>;               // Required
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
  sortable?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<OsdsTable 
  data={users}
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', render: (value) => <OsdsChip color={value === 'active' ? 'success' : 'error'}>{value}</OsdsChip> }
  ]}
  onSort={handleSort}
/>
```

#### OsdsPagination Component
```typescript
interface OsdsPaginationProps {
  total: number;                  // Required
  pageSize: number;               // Required
  currentPage?: number;
  onPageChange?: (page: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  className?: string;
  dataTestId?: string;
}

// Usage Examples
<OsdsPagination 
  total={100}
  pageSize={10}
  currentPage={currentPage}
  onPageChange={setCurrentPage}
  showSizeChanger
  pageSizeOptions={[10, 20, 50]}
  onPageSizeChange={setPageSize}
/>
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

<OsdsFormField 
  label="Email" 
  hasError={!!emailError}
  errorMessage={emailError}
  isRequired
>
  <OsdsInput 
    type="email"
    value={email}
    onChange={(value) => {
      setEmail(value);
      validateEmail(value);
    }}
    hasError={!!emailError}
  />
</OsdsFormField>
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

<OsdsModal 
  open={isModalOpen} 
  onClose={() => setIsModalOpen(false)}
  title="Delete Item"
  color="critical"
>
  <p>Are you sure you want to delete this item? This action cannot be undone.</p>
  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
    <OsdsButton variant="ghost" onClick={() => setIsModalOpen(false)}>
      Cancel
    </OsdsButton>
    <OsdsButton 
      color="critical" 
      isLoading={isDeleting}
      onClick={handleDelete}
    >
      Delete
    </OsdsButton>
  </div>
</OsdsModal>
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
  <OsdsSkeleton width="100%" height="200px" />
) : (
  <OsdsTile title="Data">
    {data ? <DataDisplay data={data} /> : <OsdsText>No data available</OsdsText>}
  </OsdsTile>
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

<OsdsSelect 
  options={countries}
  value={selectedCountry}
  onChange={setSelectedCountry}
  placeholder={isLoadingCountries ? "Loading countries..." : "Select a country"}
  isDisabled={isLoadingCountries}
/>
```

#### 5. Data Table with Pagination Pattern
```typescript
const [data, setData] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [isLoading, setIsLoading] = useState(false);

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { 
    key: 'status', 
    label: 'Status', 
    render: (value) => (
      <OsdsChip color={value === 'active' ? 'success' : 'error'}>
        {value}
      </OsdsChip>
    )
  }
];

const handlePageChange = (page: number) => {
  setCurrentPage(page);
  fetchData(page, pageSize);
};

{isLoading ? (
  <OsdsSkeleton width="100%" height="300px" />
) : (
  <>
    <OsdsTable 
      data={data}
      columns={columns}
      onSort={handleSort}
    />
    <OsdsPagination 
      total={totalItems}
      pageSize={pageSize}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      showSizeChanger
      pageSizeOptions={[10, 20, 50]}
      onPageSizeChange={setPageSize}
    />
  </>
)}
```

#### 6. Tabs with Content Pattern
```typescript
const [activeTab, setActiveTab] = useState('tab1');

<OsdsTabs>
  <OsdsTabBar>
    <OsdsTabBarItem 
      label="General" 
      active={activeTab === 'tab1'}
      onClick={() => setActiveTab('tab1')}
    />
    <OsdsTabBarItem 
      label="Settings" 
      active={activeTab === 'tab2'}
      onClick={() => setActiveTab('tab2')}
    />
  </OsdsTabBar>
  
  <OsdsTabPanel active={activeTab === 'tab1'}>
    <OsdsText>General information content</OsdsText>
  </OsdsTabPanel>
  
  <OsdsTabPanel active={activeTab === 'tab2'}>
    <OsdsText>Settings content</OsdsText>
  </OsdsTabPanel>
</OsdsTabs>
```

#### 7. Accordion with Dynamic Content Pattern
```typescript
const [expandedItems, setExpandedItems] = useState<string[]>([]);

const toggleItem = (itemId: string) => {
  setExpandedItems(prev => 
    prev.includes(itemId) 
      ? prev.filter(id => id !== itemId)
      : [...prev, itemId]
  );
};

<OsdsAccordionGroup>
  {items.map(item => (
    <OsdsAccordion
      key={item.id}
      summary={item.title}
      open={expandedItems.includes(item.id)}
      onToggle={() => toggleItem(item.id)}
    >
      <OsdsText>{item.content}</OsdsText>
    </OsdsAccordion>
  ))}
</OsdsAccordionGroup>
```

### Common Pitfalls and Solutions

#### ❌ Wrong: Missing Required Props
```typescript
// Missing required 'open' prop
<OsdsModal>Content</OsdsModal>
```

#### ✅ Correct: All Required Props
```typescript
<OsdsModal open={isOpen} onClose={() => setIsOpen(false)}>Content</OsdsModal>
```

#### ❌ Wrong: Incorrect Event Handler
```typescript
// ODS Input provides value directly, not event
<OsdsInput onChange={(e) => setValue(e.target.value)} />
```

#### ✅ Correct: Proper Event Handler
```typescript
<OsdsInput onChange={setValue} />
```

#### ❌ Wrong: Missing Form Validation
```typescript
<OsdsInput value={email} />
```

#### ✅ Correct: With Validation
```typescript
<OsdsFormField hasError={!!emailError} errorMessage={emailError}>
  <OsdsInput value={email} onChange={setEmail} hasError={!!emailError} />
</OsdsFormField>
```

#### ❌ Wrong: No Loading States
```typescript
<OsdsButton onClick={handleSubmit}>Submit</OsdsButton>
```

#### ✅ Correct: With Loading State
```typescript
<OsdsButton isLoading={isSubmitting} onClick={handleSubmit}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</OsdsButton>
```

#### ❌ Wrong: Using Old Component Names
```typescript
// Old naming convention
import { Button, Input, Modal } from '@ovhcloud/ods-components/react';
<Button>Click me</Button>
```

#### ✅ Correct: Using ODS Component Names
```typescript
// Correct ODS naming convention
import { OsdsButton, OsdsInput, OsdsModal } from '@ovhcloud/ods-components/react';
<OsdsButton>Click me</OsdsButton>
```

#### ❌ Wrong: Missing Icon Name
```typescript
<OsdsIcon />
```

#### ✅ Correct: With Required Icon Name
```typescript
<OsdsIcon name="home" />
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
  <OsdsSpinner />
) : error ? (
  <OsdsMessage type="error">{error}</OsdsMessage>
) : (
  <DataComponent data={data} />
)}
```

#### 3. Lazy Loading for Large Lists
```typescript
// Use virtual scrolling for large datasets
import { FixedSizeList as List } from 'react-window';

const VirtualizedTable = ({ items }) => (
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

### Testing Guidelines

#### 1. Test IDs
```typescript
// Always include test IDs
<OsdsButton dataTestId="submit-button" onClick={handleSubmit}>
  Submit
</OsdsButton>

<OsdsInput 
  dataTestId="email-input"
  value={email}
  onChange={setEmail}
/>
```

#### 2. Accessibility
```typescript
// Include proper ARIA attributes
<OsdsButton 
  aria-label="Close modal"
  onClick={onClose}
  dataTestId="close-button"
>
  <OsdsIcon name="close" />
</OsdsButton>
```

#### 3. Component Testing
```typescript
// Example test with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { OsdsButton } from '@ovhcloud/ods-components/react';

test('button calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<OsdsButton onClick={handleClick}>Click me</OsdsButton>);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Integration with Manager React Components

```typescript
// Use ODS for basic UI components
import { 
  OsdsButton, 
  OsdsModal, 
  OsdsInput,
  OsdsText,
  OsdsIcon 
} from '@ovhcloud/ods-components/react';

// Use MRC for Manager-specific functionality with IAM
import { ManagerButton, ManagerText } from '@ovh-ux/manager-react-components';

// Basic ODS usage
<OsdsButton color="primary" onClick={handleClick}>Basic Action</OsdsButton>

// Manager-specific usage with authorization
<ManagerButton
  id="delete-resource"
  label="Delete"
  iamActions={['resource:delete']}
  urn={`urn:v1:eu:resource:${resourceId}`}
/>

// Combining ODS and MRC
<OsdsTile title="Resource Management">
  <OsdsText>Manage your resources</OsdsText>
  <ManagerButton
    id="create-resource"
    label="Create Resource"
    iamActions={['resource:create']}
  />
</OsdsTile>
```

### Theme Integration

```typescript
// Import theme first
import '@ovhcloud/ods-themes/default';

// Or use specific theme
import '@ovhcloud/ods-themes/blue-jeans';

// Import components
import { 
  OsdsButton, 
  OsdsModal,
  OsdsInput,
  OsdsText,
  OsdsIcon
} from '@ovhcloud/ods-components/react';
```

### Advanced Component Usage

#### 1. Custom Form Components
```typescript
// Create reusable form components
const FormInput = ({ label, error, ...props }) => (
  <OsdsFormField 
    label={label}
    hasError={!!error}
    errorMessage={error}
  >
    <OsdsInput {...props} hasError={!!error} />
  </OsdsFormField>
);

// Usage
<FormInput 
  label="Email"
  value={email}
  onChange={setEmail}
  error={emailError}
  type="email"
/>
```

#### 2. Data Display Components
```typescript
// Create data display components
const StatusChip = ({ status }) => {
  const colorMap = {
    active: 'success',
    inactive: 'error',
    pending: 'warning'
  };
  
  return (
    <OsdsChip color={colorMap[status] || 'secondary'}>
      {status}
    </OsdsChip>
  );
};

// Usage in table
<OsdsTable 
  data={users}
  columns={[
    { key: 'name', label: 'Name' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => <StatusChip status={value} />
    }
  ]}
/>
```

#### 3. Layout Components
```typescript
// Create layout components
const PageLayout = ({ title, children, actions }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <OsdsText size="xl" weight="bold">{title}</OsdsText>
      {actions && <div>{actions}</div>}
    </div>
    {children}
  </div>
);

// Usage
<PageLayout 
  title="User Management"
  actions={<OsdsButton color="primary">Add User</OsdsButton>}
>
  <OsdsTable data={users} columns={columns} />
</PageLayout>
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always import theme first**: `import '@ovhcloud/ods-themes/default';`
2. **Use ODS component names**: `import { OsdsButton, OsdsModal, OsdsInput } from '@ovhcloud/ods-components/react';`
3. **Include all required props**: Check interface definitions above
4. **Handle loading states**: Use `isLoading` props and conditional rendering
5. **Implement validation**: Use `OsdsFormField` with `hasError` and `errorMessage`
6. **Add test IDs**: Include `dataTestId` for all interactive elements
7. **Use semantic colors**: `primary`, `critical`, `success`, `warning`, `error`
8. **Handle events correctly**: ODS provides values directly, not events
9. **Implement accessibility**: Include ARIA attributes where needed
10. **Optimize performance**: Use memoization for expensive operations

### Component Selection Guide

- **Basic UI**: Use ODS components (`OsdsButton`, `OsdsInput`, `OsdsModal`, `OsdsText`, `OsdsIcon`)
- **Manager-specific**: Use MRC components (`ManagerButton`, `ManagerText`)
- **Forms**: Always wrap inputs with `OsdsFormField`
- **Feedback**: Use `OsdsMessage` for alerts, `OsdsSpinner`/`OsdsSkeleton` for loading
- **Navigation**: Use `OsdsBreadcrumb`, `OsdsPagination` for navigation
- **Layout**: Use `OsdsTile`, `OsdsAccordion`, `OsdsTabs` for content organization
- **Data Display**: Use `OsdsTable`, `OsdsDatagrid` for data presentation
- **Input Controls**: Use `OsdsSelect`, `OsdsCheckbox`, `OsdsRadio`, `OsdsSwitch` for form controls
- **Overlays**: Use `OsdsModal`, `OsdsPopover`, `OsdsTooltip` for overlays

### Complete Component Import Reference

```typescript
// Input Components
import { 
  OsdsButton, OsdsInput, OsdsSelect, OsdsCheckbox, OsdsCheckboxButton,
  OsdsRadio, OsdsRadioButton, OsdsRadioGroup, OsdsSwitch, OsdsSwitchItem,
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
```
