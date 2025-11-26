---
title: Tailwind CSS
version: 3.4.4
last_update: 2025-11-21
tags: [tailwind, css, styling, ovhcloud, manager, muk, responsive, utilities]
ai: true
---

# Tailwind CSS

> **📦 Version:** `tailwindcss@^3.4.4` + `@ovh-ux/manager-tailwind-config@^0.5.5`
> **📚 Official Documentation:** https://v3.tailwindcss.com/docs (v3) | https://tailwindcss.com/docs (v4)

## 🧭 Purpose

**Tailwind CSS** is a utility-first CSS framework used in the OVHcloud Manager ecosystem for styling React applications. It's configured with `@ovh-ux/manager-tailwind-config` to provide standardized spacing, breakpoints, and design tokens that integrate with the MUK (Manager UI Kit) and ODS.

This package is essential for consistent styling across all Manager applications, providing utility classes that work seamlessly with MUK components and design tokens.

## ⚙️ Context

Tailwind CSS is designed for:
- **Utility-first styling** with consistent design tokens
- **MUK integration** with design system variables
- **Responsive design** with standardized breakpoints
- **Component styling** for React applications
- **Design consistency** across all Manager applications

This package is essential for:
- **React µApps** in the Manager ecosystem
- **Consistent styling** with ODS design tokens
- **Responsive layouts** with standardized breakpoints
- **Component development** with utility classes

## 🔗 References

- [MUK Components](./muk.md)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "dependencies": {
    "tailwindcss": "^3.4.4",
    "@ovh-ux/manager-tailwind-config": "^0.5.5"
  }
}
```

### Configuration

#### Basic Tailwind Configuration

```javascript
// tailwind.config.mjs
import baseConfig from '@ovh-ux/manager-tailwind-config';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkgDir = (name) => path.dirname(require.resolve(`${name}/package.json`));
const toGlob = (dir) => `${dir.replace(/\\/g, '/')}/**/*.{js,jsx,ts,tsx}`;

const mukComponentsDir = pkgDir('@ovh-ux/muk');

const baseTailwindConfig = [
  ...(baseConfig.content ?? []),
  './src/**/*.{js,jsx,ts,tsx}',
  toGlob(mukComponentsDir),
];

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: baseTailwindConfig,
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts with MUK
  },
};
```

#### Manager Tailwind Config

The `@ovh-ux/manager-tailwind-config` provides:

```javascript
// Default configuration from manager-tailwind-config
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      spacing: {
        0: '0',
        1: '0.0625rem',   // 1px
        2: '0.125rem',    // 2px
        3: '0.25rem',     // 4px
        4: '0.5rem',      // 8px
        5: '0.75rem',     // 12px
        6: '1rem',        // 16px
        7: '1.25rem',     // 20px
        8: '1.5rem',      // 24px
        9: '2rem',        // 32px
        10: '2.5rem',     // 40px
        11: '3rem',       // 48px
      },
    },
    screens: {
      xs: '0',
      sm: '36em',    // 576px
      md: '48em',    // 768px
      lg: '62em',    // 992px
      xl: '75em',    // 1200px
      xxl: '87.5em', // 1400px
    },
    borderRadius: {
      none: '0',
      sm: 'var(--ods-border-radius-sm, var(--ods-size-border-radius-01, 4px))',
      DEFAULT: 'var(--ods-border-radius-sm, var(--ods-size-border-radius-01, 4px))',
      md: 'var(--ods-border-radius-md, var(--ods-size-border-radius-02, 8px))',
      lg: 'var(--ods-border-radius-lg, var(--ods-size-border-radius-02, 16px))',
      full: '50%',
    },
  },
  plugins: [],
};
```

### Spacing System

#### Standard Spacing

```tsx
// Using the standardized spacing system
function SpacingExample() {
  return (
    <div className="p-4 m-6">
      {/* Padding: 8px, Margin: 24px */}
      <div className="space-y-2">
        {/* Space between children: 8px */}
        <div className="p-2">Item 1</div>
        <div className="p-2">Item 2</div>
      </div>
    </div>
  );
}
```

#### Spacing Scale

```tsx
// Available spacing classes
const spacingClasses = {
  'p-0': 'padding: 0',
  'p-1': 'padding: 0.0625rem (1px)',
  'p-2': 'padding: 0.125rem (2px)',
  'p-3': 'padding: 0.25rem (4px)',
  'p-4': 'padding: 0.5rem (8px)',
  'p-5': 'padding: 0.75rem (12px)',
  'p-6': 'padding: 1rem (16px)',
  'p-7': 'padding: 1.25rem (20px)',
  'p-8': 'padding: 1.5rem (24px)',
  'p-9': 'padding: 2rem (32px)',
  'p-10': 'padding: 2.5rem (40px)',
  'p-11': 'padding: 3rem (48px)',
};
```

### Responsive Design

#### Breakpoint System

```tsx
// Using the standardized breakpoints
function ResponsiveComponent() {
  return (
    <div className="
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3 
      lg:grid-cols-4 
      xl:grid-cols-5 
      xxl:grid-cols-6
    ">
      {/* Responsive grid layout */}
      <div className="col-span-1">Item 1</div>
      <div className="col-span-1">Item 2</div>
    </div>
  );
}
```

#### Breakpoint Reference

```tsx
// Available breakpoints
const breakpoints = {
  xs: '0px',      // Mobile
  sm: '576px',    // Small tablets
  md: '768px',    // Tablets
  lg: '992px',    // Small desktops
  xl: '1200px',   // Desktops
  xxl: '1400px',  // Large desktops
};

// Usage examples
function BreakpointExamples() {
  return (
    <div>
      {/* Mobile-first approach */}
      <div className="text-sm md:text-base lg:text-lg">
        Responsive text
      </div>
      
      {/* Hide on mobile, show on desktop */}
      <div className="hidden md:block">
        Desktop only content
      </div>
      
      {/* Show on mobile, hide on desktop */}
      <div className="block md:hidden">
        Mobile only content
      </div>
    </div>
  );
}
```

### Border Radius with MUK

#### MUK Border Radius

```tsx
// Using MUK border radius variables
function BorderRadiusExample() {
  return (
    <div>
      {/* Small border radius */}
      <div className="rounded-sm">Small radius</div>
      
      {/* Default border radius */}
      <div className="rounded">Default radius</div>
      
      {/* Medium border radius */}
      <div className="rounded-md">Medium radius</div>
      
      {/* Large border radius */}
      <div className="rounded-lg">Large radius</div>
      
      {/* Full border radius */}
      <div className="rounded-full">Full radius</div>
    </div>
  );
}
```

#### Custom Border Radius

```tsx
// Custom border radius with MUK variables
function CustomBorderRadius() {
  return (
    <div className="rounded-lg border-2 border-blue-500">
      {/* Uses MUK border radius variables */}
      <p>This div uses the MUK border radius system</p>
    </div>
  );
}
```

### Integration with MUK

#### MUK Component Styling

```tsx
import { Button, Card, Text } from '@ovh-ux/muk';

function MUKIntegration() {
  return (
    <div className="p-6 space-y-4">
      {/* MUK Card with Tailwind spacing */}
      <Card className="p-4">
        <Text className="mb-4">
          Card content with Tailwind spacing
        </Text>
        
        {/* MUK Button with Tailwind classes */}
        <Button 
          className="w-full sm:w-auto"
          variant="primary"
        >
          Responsive Button
        </Button>
      </Card>
    </div>
  );
}
```

#### Custom Component Styling

```tsx
// Custom components with Tailwind utilities
function CustomComponent() {
  return (
    <div className="
      bg-white 
      border 
      border-gray-200 
      rounded-lg 
      p-6 
      shadow-sm
      hover:shadow-md 
      transition-shadow
    ">
      <h3 className="text-lg font-semibold mb-4">
        Custom Component
      </h3>
      
      <p className="text-gray-600 mb-4">
        Content with Tailwind styling
      </p>
      
      <div className="flex gap-2">
        <button className="
          px-4 
          py-2 
          bg-blue-500 
          text-white 
          rounded 
          hover:bg-blue-600 
          transition-colors
        ">
          Primary Action
        </button>
        
        <button className="
          px-4 
          py-2 
          border 
          border-gray-300 
          text-gray-700 
          rounded 
          hover:bg-gray-50 
          transition-colors
        ">
          Secondary Action
        </button>
      </div>
    </div>
  );
}
```

### Layout Patterns

#### Grid Layouts

```tsx
// Responsive grid layouts
function GridLayout() {
  return (
    <div className="
      grid 
      grid-cols-1 
      md:grid-cols-2 
      lg:grid-cols-3 
      gap-4 
      p-6
    ">
      <div className="bg-gray-100 p-4 rounded">
        Grid Item 1
      </div>
      <div className="bg-gray-100 p-4 rounded">
        Grid Item 2
      </div>
      <div className="bg-gray-100 p-4 rounded">
        Grid Item 3
      </div>
    </div>
  );
}
```

#### Flexbox Layouts

```tsx
// Flexbox layouts with responsive behavior
function FlexLayout() {
  return (
    <div className="
      flex 
      flex-col 
      md:flex-row 
      gap-4 
      items-center 
      justify-between
      p-6
    ">
      <div className="flex-1">
        <h2 className="text-xl font-bold">Title</h2>
        <p className="text-gray-600">Description</p>
      </div>
      
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Action 1
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded">
          Action 2
        </button>
      </div>
    </div>
  );
}
```

### Typography

#### Text Styling

```tsx
// Typography with Tailwind classes
function TypographyExample() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">
        Main Heading
      </h1>
      
      <h2 className="text-2xl font-semibold text-gray-800">
        Section Heading
      </h2>
      
      <h3 className="text-xl font-medium text-gray-700">
        Subsection Heading
      </h3>
      
      <p className="text-base text-gray-600 leading-relaxed">
        Body text with proper line height and color
      </p>
      
      <p className="text-sm text-gray-500">
        Small text for captions or metadata
      </p>
    </div>
  );
}
```

#### Responsive Typography

```tsx
// Responsive typography
function ResponsiveTypography() {
  return (
    <div>
      <h1 className="
        text-2xl 
        md:text-3xl 
        lg:text-4xl 
        font-bold 
        text-gray-900
      ">
        Responsive Heading
      </h1>
      
      <p className="
        text-sm 
        md:text-base 
        lg:text-lg 
        text-gray-600
      ">
        Responsive body text
      </p>
    </div>
  );
}
```

### State Management

#### Hover States

```tsx
// Hover states and interactions
function InteractiveComponent() {
  return (
    <div className="
      bg-white 
      border 
      border-gray-200 
      rounded-lg 
      p-4
      hover:border-blue-300 
      hover:shadow-md 
      transition-all 
      duration-200
      cursor-pointer
    ">
      <h3 className="font-semibold mb-2">Interactive Card</h3>
      <p className="text-gray-600">
        Hover over this card to see the transition
      </p>
    </div>
  );
}
```

#### Focus States

```tsx
// Focus states for accessibility
function FocusableComponent() {
  return (
    <button className="
      px-4 
      py-2 
      bg-blue-500 
      text-white 
      rounded
      hover:bg-blue-600 
      focus:outline-none 
      focus:ring-2 
      focus:ring-blue-500 
      focus:ring-offset-2
      transition-colors
    ">
      Focusable Button
    </button>
  );
}
```

### Best Practices

#### 1. Component Organization

```tsx
// ✅ CORRECT: Organized utility classes
function WellOrganizedComponent() {
  return (
    <div className="
      // Layout
      flex flex-col md:flex-row gap-4
      
      // Spacing
      p-6 m-4
      
      // Colors
      bg-white text-gray-900
      
      // Borders
      border border-gray-200 rounded-lg
      
      // Effects
      shadow-sm hover:shadow-md transition-shadow
    ">
      Content
    </div>
  );
}

// ❌ WRONG: Disorganized classes
function PoorlyOrganizedComponent() {
  return (
    <div className="bg-white p-6 flex flex-col md:flex-row gap-4 m-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-900">
      Content
    </div>
  );
}
```

#### 2. Responsive Design

```tsx
// ✅ CORRECT: Mobile-first responsive design
function ResponsiveComponent() {
  return (
    <div className="
      // Mobile first
      grid grid-cols-1 gap-4
      
      // Tablet
      md:grid-cols-2 md:gap-6
      
      // Desktop
      lg:grid-cols-3 lg:gap-8
    ">
      Content
    </div>
  );
}

// ❌ WRONG: Desktop-first approach
function DesktopFirstComponent() {
  return (
    <div className="
      grid grid-cols-3 gap-8
      md:grid-cols-2 md:gap-6
      sm:grid-cols-1 sm:gap-4
    ">
      Content
    </div>
  );
}
```

#### 3. MUK Integration

```tsx
// ✅ CORRECT: Proper MUK integration
import { Card, Button } from '@ovh-ux/muk';

function MUKIntegration() {
  return (
    <Card className="p-4">
      <Button 
        className="w-full sm:w-auto"
        variant="primary"
      >
        MUK Button with Tailwind
      </Button>
    </Card>
  );
}

// ❌ WRONG: Overriding MUK styles
function PoorMUKIntegration() {
  return (
    <Card className="p-4 bg-red-500 border-2 border-blue-500">
      {/* Don't override MUK component styles */}
    </Card>
  );
}
```

### Common Pitfalls

#### ❌ Wrong: Using Tailwind with MUK Conflicts

```tsx
// Don't override MUK component styles
<Button className="bg-red-500 text-white">
  {/* This overrides MUK button styles */}
</Button>
```

#### ✅ Correct: Complementary Styling

```tsx
// Use Tailwind for layout and spacing
<Button className="w-full sm:w-auto mb-4">
  {/* Only use Tailwind for layout, not colors */}
</Button>
```

#### ❌ Wrong: Inconsistent Spacing

```tsx
// Don't mix different spacing systems
<div className="p-4 m-8">
  {/* Inconsistent spacing */}
</div>
```

#### ✅ Correct: Consistent Spacing

```tsx
// Use the standardized spacing system
<div className="p-4 m-4">
  {/* Consistent spacing */}
</div>
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Use manager-tailwind-config**: Always extend the base configuration
2. **Follow MUK integration**: Don't override MUK component styles
3. **Use standardized spacing**: Use the provided spacing scale
4. **Implement responsive design**: Use mobile-first approach
5. **Organize utility classes**: Group related classes together
6. **Use semantic class names**: Choose descriptive class combinations
7. **Test responsive behavior**: Verify breakpoints work correctly
8. **Maintain accessibility**: Include focus states and proper contrast

### Styling Checklist

- [ ] Tailwind configuration extends manager-tailwind-config
- [ ] Content paths include all source files
- [ ] Preflight disabled to avoid MUK conflicts
- [ ] Responsive design implemented
- [ ] MUK integration maintained
- [ ] Spacing system used consistently
- [ ] Accessibility considerations included

### Component Styling Checklist

- [ ] Utility classes organized logically
- [ ] Responsive breakpoints implemented
- [ ] Hover and focus states included
- [ ] MUK components not overridden
- [ ] Consistent spacing used
- [ ] Color system followed
- [ ] Typography hierarchy maintained

### Performance Optimization Checklist

- [ ] Unused classes purged
- [ ] Critical CSS extracted
- [ ] Responsive images used
- [ ] Efficient class combinations
- [ ] Minimal custom CSS
- [ ] Optimized build output

---

## ⚖️ The Styling's Moral

- **Consistent design** ensures professional appearance across all applications
- **Responsive layouts** provide optimal experience on all devices
- **MUK integration** maintains brand consistency and accessibility
- **Utility-first approach** enables rapid development and maintenance

**👉 Good styling is invisible to users but essential for professional applications.**
