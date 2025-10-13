---
title: OVHcloud Design System (ODS) React Components
last_update: 2025-10-13
tags: [ods, design-system, ui, ovhcloud, react, components, documentation]
ai: true
---

# OVHcloud Design System (ODS) — React Components

The **OVHcloud Design System (ODS)** provides a unified and reusable set of **React UI components** used across OVHcloud products to ensure a consistent, accessible, and modern user experience.  
It is the **single source of truth** for UI patterns and interactions in the OVHcloud ecosystem.

Official documentation: [ODS Storybook](https://ovh.github.io/design-system/latest/?path=/docs/ovhcloud-design-system-get-started--docs)

---

## ⚙️ Installation

Install ODS React and Themes packages:

```bash
npm install --save-exact @ovhcloud/ods-react @ovhcloud/ods-themes
# or
yarn add --exact @ovhcloud/ods-react @ovhcloud/ods-themes
```

---

## 🚀 Basic Usage

```tsx
import { Button } from '@ovhcloud/ods-react';

export default function App() {
  return <Button color="primary">Click Me</Button>;
}
```

Compatible with **React v18.2+** and **v19+**.

---

## 🧩 React Components Overview

Below is the list of all main ODS React components available in **v19.1.0**, grouped by functional category.

| Component | Category | Description | Import | Example |
|------------|-----------|--------------|---------|----------|
| **Accordion** | Layout | Expandable/collapsible container. | `import { Accordion } from '@ovhcloud/ods-react';` | `<Accordion summary="Details">Content</Accordion>` |
| **Badge** | Feedback | Displays a visual indicator (state, label, or number). | `import { Badge } from '@ovhcloud/ods-react';` | `<Badge color="success">Active</Badge>` |
| **Breadcrumb** | Navigation | Displays hierarchical navigation path. | `import { Breadcrumb } from '@ovhcloud/ods-react';` | `<Breadcrumb items={[{label:'Home'},{label:'Page'}]} />` |
| **Button** | Inputs | Primary interactive element for actions. | `import { Button } from '@ovhcloud/ods-react';` | `<Button color="primary">Submit</Button>` |
| **Card** | Layout | Visual container for grouped content. | `import { Card } from '@ovhcloud/ods-react';` | `<Card title="Information">Content</Card>` |
| **Checkbox** | Inputs | Boolean selection control. | `import { Checkbox } from '@ovhcloud/ods-react';` | `<Checkbox label="Accept terms" />` |
| **Clipboard** | Utility | Copy content to clipboard. | `import { Clipboard } from '@ovhcloud/ods-react';` | `<Clipboard value="copied text" />` |
| **Code** | Display | Syntax-highlighted code block. | `import { Code } from '@ovhcloud/ods-react';` | `<Code language="ts">const x = 42;</Code>` |
| **Combobox** | Inputs | Text input combined with dropdown selection. | `import { Combobox } from '@ovhcloud/ods-react';` | `<Combobox options={['One', 'Two']} />` |
| **Datepicker** | Inputs | Date selection input. | `import { Datepicker } from '@ovhcloud/ods-react';` | `<Datepicker value={new Date()} />` |
| **Divider** | Layout | Visual separator for sections. | `import { Divider } from '@ovhcloud/ods-react';` | `<Divider />` |
| **Drawer** | Layout | Sliding side panel. | `import { Drawer } from '@ovhcloud/ods-react';` | `<Drawer open>Content</Drawer>` |
| **File Upload** | Inputs | Upload file interface. | `import { FileUpload } from '@ovhcloud/ods-react';` | `<FileUpload label="Upload file" />` |
| **Form Field** | Inputs | Combines label, help text, and input control. | `import { FormField } from '@ovhcloud/ods-react';` | `<FormField label="Name"><Input /></FormField>` |
| **Icon** | Display | Displays an ODS SVG icon. | `import { Icon } from '@ovhcloud/ods-react';` | `<Icon name="cloud" />` |
| **Input** | Inputs | Basic text input field. | `import { Input } from '@ovhcloud/ods-react';` | `<Input placeholder="Enter name" />` |
| **Link** | Navigation | Styled link with optional target. | `import { Link } from '@ovhcloud/ods-react';` | `<Link href="#">Read more</Link>` |
| **Medium** | Display | Displays media like image or video. | `import { Medium } from '@ovhcloud/ods-react';` | `<Medium src="demo.png" alt="Demo" />` |
| **Message** | Feedback | Feedback alert (info, error, success). | `import { Message } from '@ovhcloud/ods-react';` | `<Message type="success">Saved</Message>` |
| **Modal** | Layout | Centered dialog window. | `import { Modal } from '@ovhcloud/ods-react';` | `<Modal open title="Confirm">Are you sure?</Modal>` |
| **Pagination** | Navigation | Page navigation control. | `import { Pagination } from '@ovhcloud/ods-react';` | `<Pagination total={100} pageSize={10} />` |
| **Password** | Inputs | Secure text input with mask toggle. | `import { Password } from '@ovhcloud/ods-react';` | `<Password />` |
| **Phone Number** | Inputs | International phone input field. | `import { PhoneNumber } from '@ovhcloud/ods-react';` | `<PhoneNumber />` |
| **Popover** | Overlay | Tooltip-like popup triggered by event. | `import { Popover } from '@ovhcloud/ods-react';` | `<Popover content="Help text"><Button>Info</Button></Popover>` |
| **Progress Bar** | Feedback | Displays progress value. | `import { ProgressBar } from '@ovhcloud/ods-react';` | `<ProgressBar value={70} />` |
| **Quantity** | Inputs | Numeric quantity selector. | `import { Quantity } from '@ovhcloud/ods-react';` | `<Quantity value={1} />` |
| **Radio Group** | Inputs | Multiple choice group. | `import { RadioGroup } from '@ovhcloud/ods-react';` | `<RadioGroup options={['Yes','No']} />` |
| **Range** | Inputs | Slider for selecting a numeric range. | `import { Range } from '@ovhcloud/ods-react';` | `<Range min={0} max={100} />` |
| **Select** | Inputs | Standard dropdown selection. | `import { Select } from '@ovhcloud/ods-react';` | `<Select options={['A','B']} />` |
| **Skeleton** | Feedback | Loading placeholder element. | `import { Skeleton } from '@ovhcloud/ods-react';` | `<Skeleton width="100%" height="20px" />` |
| **Spinner** | Feedback | Circular loading indicator. | `import { Spinner } from '@ovhcloud/ods-react';` | `<Spinner />` |

---

## 🧱 Best Practices for Implementation

- Always use the `@ovhcloud/ods-themes` package to ensure design consistency.
- Use semantic HTML wrapped with ODS components for accessibility (ARIA compliance).
- Favor ODS components over custom ones — they are versioned, tested, and supported.
- Combine ODS styling with **Tailwind CSS** or **SCSS modules** when necessary.
- Keep imports scoped (e.g. `import { Button } from '@ovhcloud/ods-react'`) — do not import the whole library.

---

## 🔗 References

- [📘 ODS Storybook – Get Started](https://ovh.github.io/design-system/latest/?path=/docs/ovhcloud-design-system-get-started--docs)
- [🧩 NPM: @ovhcloud/ods-react](https://www.npmjs.com/package/@ovhcloud/ods-react)
- [🎨 NPM: @ovhcloud/ods-themes](https://www.npmjs.com/package/@ovhcloud/ods-themes)

---

## 🤖 AI Integration Notes

This Markdown is designed to be consumed by AI systems (like NIA) for **React code generation assistance**.  
Each component section includes an example, import path, and behavior context.  
The AI can use these examples to auto-complete component implementations while respecting ODS conventions.

