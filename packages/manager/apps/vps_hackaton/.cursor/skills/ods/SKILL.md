---
name: ods
description: Guide selection and usage of ODS (OVHcloud Design System) components. Helps determine when to use ODS components vs creating custom ones. Use when implementing UI components or when deciding between ODS and custom components.
---

# ODS Component Library Expertise

## ODS First Principle

**Always check ODS components before creating custom ones.** ODS provides a comprehensive set of components that should be used whenever possible.

## ODS Packages

### @ovhcloud/ods-react
React wrapper components - **Primary choice for React apps**

```typescript
// ✅ GOOD: Import from ods-react
import { Button, Text, Input, FormField, FormFieldLabel } from '@ovhcloud/ods-react';

// Available components:
// - Button, Icon, Link, Text, Input, Textarea, Select, RadioGroup, Checkbox
// - FormField, FormFieldLabel, Card, Badge, Divider, Spinner
// - Drawer, Modal, Popover, Tooltip
// - And more...
```

### @ovhcloud/ods-components/react
Web components (Osds* prefix) - **Use when ods-react doesn't have the component**

```typescript
// ✅ GOOD: Import web components when needed
import { OsdsButton, OsdsIcon, OsdsCard, OsdsPopover } from '@ovhcloud/ods-components/react';

// Usage:
<OsdsButton size={ODS_BUTTON_SIZE.sm} variant={ODS_BUTTON_VARIANT.stroked}>
  <OsdsIcon name={ODS_ICON_NAME.ADD} />
  Button Text
</OsdsButton>
```

### @ovhcloud/ods-components
Constants and enums - **For component props**

```typescript
// ✅ GOOD: Import constants for component props
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_PRESET,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';

// Usage:
<Button size={ODS_BUTTON_SIZE.sm} variant={ODS_BUTTON_VARIANT.stroked}>
  Click
</Button>
```

### @ovhcloud/ods-common-theming
Theme constants - **For theming values**

```typescript
// ✅ GOOD: Import theme constants
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

// Usage:
<OsdsButton color={ODS_THEME_COLOR_INTENT.primary}>
  Button
</OsdsButton>
```

## Component Selection Guide

### When to Use @ovhcloud/ods-react

**Primary choice** - Use for:
- Forms (Input, Textarea, Select, FormField, etc.)
- Buttons, Links, Icons
- Text, Badges, Cards
- Layout components (Divider, Spinner)
- Most common UI needs

```typescript
// ✅ GOOD: Use ods-react components
import { Button, Text, Input, FormField } from '@ovhcloud/ods-react';

<FormField>
  <FormFieldLabel>Label</FormFieldLabel>
  <Input {...register('field')} />
</FormField>
```

### When to Use @ovhcloud/ods-components/react

Use when:
- ods-react doesn't have the component you need
- You need web component features
- Advanced components (Popover, Tooltip, etc.)

```typescript
// ✅ GOOD: Use web components for advanced features
import { OsdsPopover, OsdsPopoverContent } from '@ovhcloud/ods-components/react';

<OsdsPopover>
  <OsdsButton slot="popover-trigger">Open</OsdsButton>
  <OsdsPopoverContent>Content</OsdsPopoverContent>
</OsdsPopover>
```

## Common ODS Components

### Form Components

```typescript
import { FormField, FormFieldLabel, Input, Textarea, Select } from '@ovhcloud/ods-react';

// ✅ GOOD: Form field pattern
<FormField>
  <FormFieldLabel>Name</FormFieldLabel>
  <Input {...register('name')} invalid={!!error} />
</FormField>
```

### Buttons and Actions

```typescript
import { Button } from '@ovhcloud/ods-react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

// ✅ GOOD: Button with constants
<Button size={ODS_BUTTON_SIZE.sm} variant={ODS_BUTTON_VARIANT.stroked}>
  Action
</Button>
```

### Text and Typography

```typescript
import { Text } from '@ovhcloud/ods-react';
import { TEXT_PRESET } from '@ovhcloud/ods-react';

// ✅ GOOD: Text with presets
<Text preset="heading-1">Title</Text>
<Text preset="heading-2">Subtitle</Text>
<Text preset="paragraph">Body text</Text>
```

### Layout Components

```typescript
import { Divider, Spinner, Card } from '@ovhcloud/ods-react';

// ✅ GOOD: Layout components
<Divider spacing="64" />
<Spinner />
<Card>Content</Card>
```

## Styling ODS Components

### Using className

```typescript
// ✅ GOOD: Apply Tailwind classes to ODS components
<Button className="w-full md:w-auto">
  Button
</Button>

<Text className="text-[--ods-color-critical-500]">
  Error text
</Text>
```

### Using CSS Variables

```typescript
// ✅ GOOD: Use ODS CSS variables
<div className="bg-[--ods-color-primary-100] text-[--ods-color-primary-600]">
  Content
</div>
```

### Styling ODS Parts (SCSS)

```scss
// ✅ GOOD: Style ODS component parts in SCSS
ods-text.custom-class::part(text) {
  font-weight: bold;
  color: var(--ods-color-primary-500);
}

ods-button.custom-button::part(button) {
  padding: 1rem;
}
```

## Decision Tree: ODS vs Custom

1. **Check @ovhcloud/ods-react first**
   - Does it have the component? → Use it
   - Need form components? → Use FormField, Input, etc. from ods-react

2. **Check @ovhcloud/ods-components/react**
   - Need advanced features? → Check web components
   - Need Popover, Tooltip? → Use Osds* components

3. **Create custom only if:**
   - ODS doesn't have the component
   - You need very specific behavior not available in ODS
   - It's a composite component using multiple ODS components

## Import Patterns

```typescript
// ✅ GOOD: Group ODS imports
// ODS React components
import { Button, Text, Input } from '@ovhcloud/ods-react';

// ODS Web components
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';

// ODS Constants
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';

// ODS Theming
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
```

## Best Practices

1. **Always check ODS first** before creating custom components
2. **Prefer @ovhcloud/ods-react** over web components when available
3. **Use constants** from @ovhcloud/ods-components for props
4. **Style with Tailwind** using ODS CSS variables
5. **Use SCSS** only for `::part()` selectors when needed
6. **Follow ODS patterns** for consistency across the application
