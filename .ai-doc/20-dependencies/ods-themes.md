---
title: OVHcloud Design System (ODS) Themes
last_update: 2025-01-27
tags: [ods, design-system, themes, ovhcloud, css, styling, documentation]
ai: true
---

# OVHcloud Design System (ODS) — Themes

> **📦 Version:** `@ovhcloud/ods-themes@^18.6.2`

The **OVHcloud Design System (ODS) Themes** package provides a comprehensive theming system for OVHcloud applications. It includes CSS custom properties, design tokens, and pre-built theme variants that ensure visual consistency across the OVHcloud ecosystem.

Official documentation: [ODS Storybook](https://ovh.github.io/design-system/latest/?path=/docs/ovhcloud-design-system-get-started--docs)

---

## 🧭 Purpose

This documentation provides comprehensive guidance for AI systems to correctly implement and customize ODS themes in React applications. It includes theme installation, usage patterns, customization options, and best practices.

---

## ⚙️ Context

ODS Themes is built on modern CSS standards and provides:
- **CSS Custom Properties** for dynamic theming
- **Design Tokens** for consistent spacing, colors, and typography
- **Multiple Theme Variants** (default, blue-jeans, etc.)
- **Dark Mode Support** with automatic theme switching
- **Performance Optimized** CSS with minimal bundle impact

---

## 🔗 References

- [ODS GitHub Repository](https://github.com/ovh/design-system) - Source code and issues
- [ODS Storybook Documentation](https://ovh.github.io/design-system/latest/) - Interactive theme examples
- [ODS Migration Guide](https://ovh.github.io/design-system/latest/?path=/docs/migration--page) - Version migration help
- [ODS Contributing Guide](https://github.com/ovh/design-system/blob/master/CONTRIBUTING.md) - How to contribute

---

## 📘 Guidelines / Implementation

### Installation and Setup

```bash
# Install ODS Themes package
npm install --save-exact @ovhcloud/ods-themes@^18.6.2
# or
yarn add --exact @ovhcloud/ods-themes@^18.6.2
```

### Basic Theme Import

```typescript
// Import the default theme (required)
import '@ovhcloud/ods-themes/default';

// Import components after theme
import { OsdsButton, OsdsModal, OsdsInput } from '@ovhcloud/ods-components/react';
```

### Available Themes

| Theme | Import | Description | Use Case |
|-------|--------|-------------|----------|
| **default** | `import '@ovhcloud/ods-themes/default';` | Standard OVHcloud theme | All OVHcloud applications |

> **⚠️ Note:** Currently, only the `default` theme is available in `@ovhcloud/ods-themes@^18.6.2`. Additional themes like `blue-jeans` and `dark` are not yet available in this version.

### Theme Structure

```css
/* CSS Custom Properties Structure (Actual ODS v18.6.2) */
:root {
  /* Colors - Primary Palette */
  --ods-color-primary-000: #ffffff;
  --ods-color-primary-050: #e6faff;
  --ods-color-primary-100: #bef1ff;
  --ods-color-primary-200: #85d9fd;
  --ods-color-primary-300: #4bb2f6;
  --ods-color-primary-400: #157eea;
  --ods-color-primary-500: #0050d7;
  --ods-color-primary-600: #002dbe;
  --ods-color-primary-700: #000e9c;
  --ods-color-primary-800: #00185e;
  --ods-color-primary-900: #000d1f;
  
  /* Colors - Neutral Palette */
  --ods-color-neutral-000: #ffffff;
  --ods-color-neutral-050: #f2f2f2;
  --ods-color-neutral-100: #e6e6e6;
  --ods-color-neutral-200: #cccccc;
  --ods-color-neutral-300: #b3b3b3;
  --ods-color-neutral-400: #999999;
  --ods-color-neutral-500: #808080;
  --ods-color-neutral-600: #666666;
  --ods-color-neutral-700: #4d4d4d;
  --ods-color-neutral-800: #333333;
  --ods-color-neutral-900: #1a1a1a;
  
  /* Colors - Semantic Colors */
  --ods-color-success-500: #2b8000;
  --ods-color-warning-500: #ff8b00;
  --ods-color-critical-500: #d70022;
  --ods-color-information-500: #0050d7;
  
  /* Typography */
  --ods-font-family-default: 'Source Sans Pro', 'Trebuchet MS', arial, 'Segoe UI', sans-serif;
  --ods-font-family-code: 'Source Code Pro', arial;
  --ods-color-text: var(--ods-color-neutral-800);
  --ods-color-heading: var(--ods-color-neutral-900);
  
  /* Border Radius */
  --ods-border-radius-xs: 0.125rem;  /* 2px */
  --ods-border-radius-sm: 0.25rem;   /* 4px */
  --ods-border-radius-md: 0.375rem;  /* 6px */
  --ods-border-radius-lg: 0.5rem;    /* 8px */
  
  /* Border Width */
  --ods-border-width-sm: 1px;
  --ods-border-width-md: 2px;
  
  /* Form Elements */
  --ods-form-element-input-height: 2.5rem;  /* 40px */
  --ods-color-form-element-background-default: var(--ods-color-neutral-000);
  --ods-color-form-element-border-default: var(--ods-color-neutral-300);
  --ods-color-form-element-text-default: var(--ods-color-text);
  
  /* Focus Outline */
  --ods-outline-color-default: var(--ods-color-primary-500);
  --ods-outline-width: 2px;
  --ods-outline-offset: 2px;
  --ods-outline-style-default: solid;
}
```

### Theme Usage Patterns

#### 1. Basic Theme Application

```typescript
// App.tsx or main entry point
import '@ovhcloud/ods-themes/default';
import { OsdsButton, OsdsModal } from '@ovhcloud/ods-components/react';

function App() {
  return (
    <div className="ods-theme">
      <OsdsButton color="primary">Themed Button</OsdsButton>
    </div>
  );
}
```

#### 2. Theme Provider (Single Theme)

```typescript
// Theme provider component for single theme
import { ReactNode } from 'react';
import '@ovhcloud/ods-themes/default';

function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <div className="ods-theme">
      {children}
    </div>
  );
}
```

#### 3. Custom Theme Variables Override

```typescript
import { useState } from 'react';
import '@ovhcloud/ods-themes/default';
import { OsdsButton } from '@ovhcloud/ods-components/react';

function CustomThemeExample() {
  const [useCustomTheme, setUseCustomTheme] = useState(false);

  const toggleCustomTheme = () => {
    setUseCustomTheme(!useCustomTheme);
    
    // Apply custom theme class
    if (useCustomTheme) {
      document.documentElement.classList.remove('custom-theme');
    } else {
      document.documentElement.classList.add('custom-theme');
    }
  };

  return (
    <div className={useCustomTheme ? 'custom-theme' : ''}>
      <OsdsButton onClick={toggleCustomTheme}>
        {useCustomTheme ? 'Use Default Theme' : 'Use Custom Theme'}
      </OsdsButton>
    </div>
  );
}
```

#### 4. Custom Theme Variables

```css
/* Custom theme overrides */
.custom-theme {
  /* Override primary colors */
  --ods-color-primary-500: #ff6b35;
  --ods-color-primary-600: #e55a2b;
  
  /* Override neutral colors */
  --ods-color-neutral-100: #f8f9fa;
  --ods-color-neutral-200: #e9ecef;
  
  /* Override typography */
  --ods-font-family-default: 'Roboto', sans-serif;
  
  /* Override border radius */
  --ods-border-radius-md: 0.5rem; /* 8px instead of 6px */
}

/* Apply custom theme to specific components */
.custom-themed-button {
  --ods-color-primary-500: #28a745;
  --ods-color-primary-600: #218838;
}
```

```typescript
// Using custom theme
import '@ovhcloud/ods-themes/default';
import './custom-theme.css';
import { OsdsButton } from '@ovhcloud/ods-components/react';

function CustomThemedComponent() {
  return (
    <div className="custom-theme">
      <OsdsButton color="primary">Custom Themed Button</OsdsButton>
    </div>
  );
}
```

### Dark Mode Implementation (Custom)

```typescript
import { useState, useEffect } from 'react';
import '@ovhcloud/ods-themes/default';

function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    // Apply dark mode class
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <button onClick={toggleDarkMode}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      {children}
    </div>
  );
}
```

```css
/* Custom dark mode implementation */
.dark-mode {
  /* Override colors for dark mode */
  --ods-color-neutral-000: #1a1a1a;
  --ods-color-neutral-050: #2d2d2d;
  --ods-color-neutral-100: #404040;
  --ods-color-neutral-200: #525252;
  --ods-color-neutral-300: #666666;
  --ods-color-neutral-400: #808080;
  --ods-color-neutral-500: #999999;
  --ods-color-neutral-600: #b3b3b3;
  --ods-color-neutral-700: #cccccc;
  --ods-color-neutral-800: #e6e6e6;
  --ods-color-neutral-900: #ffffff;
  
  /* Override text colors */
  --ods-color-text: var(--ods-color-neutral-800);
  --ods-color-heading: var(--ods-color-neutral-900);
  
  /* Override form element colors */
  --ods-color-form-element-background-default: var(--ods-color-neutral-100);
  --ods-color-form-element-border-default: var(--ods-color-neutral-300);
  --ods-color-form-element-text-default: var(--ods-color-neutral-800);
}
```

### CSS-in-JS Integration

```typescript
import styled from 'styled-components';
import '@ovhcloud/ods-themes/default';

// Using ODS design tokens in styled-components
const StyledCard = styled.div`
  background-color: var(--ods-color-neutral-100);
  border-radius: var(--ods-border-radius-md);
  padding: 1rem; /* Use standard CSS units for spacing */
  border: var(--ods-border-width-sm) solid var(--ods-color-neutral-200);
  
  &:hover {
    border-color: var(--ods-color-neutral-300);
  }
`;

const StyledButton = styled.button`
  background-color: var(--ods-color-primary-500);
  color: var(--ods-color-neutral-000);
  border: none;
  border-radius: var(--ods-border-radius-sm);
  padding: 0.5rem 1rem;
  font-family: var(--ods-font-family-default);
  height: var(--ods-form-element-input-height);
  
  &:hover {
    background-color: var(--ods-color-primary-600);
  }
  
  &:disabled {
    background-color: var(--ods-color-neutral-300);
    cursor: not-allowed;
  }
  
  &:focus {
    outline: var(--ods-outline-width) var(--ods-outline-style-default) var(--ods-outline-color-default);
    outline-offset: var(--ods-outline-offset);
  }
`;
```

### Tailwind CSS Integration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'var(--ods-color-primary-500)',
          600: 'var(--ods-color-primary-600)',
        },
        neutral: {
          100: 'var(--ods-color-neutral-100)',
          200: 'var(--ods-color-neutral-200)',
          300: 'var(--ods-color-neutral-300)',
          800: 'var(--ods-color-neutral-800)',
          900: 'var(--ods-color-neutral-900)',
        },
        success: {
          500: 'var(--ods-color-success-500)',
        },
        warning: {
          500: 'var(--ods-color-warning-500)',
        },
        critical: {
          500: 'var(--ods-color-critical-500)',
        }
      },
      fontFamily: {
        default: ['var(--ods-font-family-default)'],
        code: ['var(--ods-font-family-code)'],
      },
      borderRadius: {
        'ods-xs': 'var(--ods-border-radius-xs)',
        'ods-sm': 'var(--ods-border-radius-sm)',
        'ods-md': 'var(--ods-border-radius-md)',
        'ods-lg': 'var(--ods-border-radius-lg)',
      },
      height: {
        'ods-input': 'var(--ods-form-element-input-height)',
      }
    }
  },
  plugins: []
};
```

```typescript
// Using Tailwind with ODS tokens
import '@ovhcloud/ods-themes/default';

function TailwindThemedComponent() {
  return (
    <div className="bg-neutral-100 p-4 rounded-ods-md border border-neutral-200">
      <h2 className="font-default text-lg text-primary-500">
        Themed Heading
      </h2>
      <p className="text-base text-neutral-800">
        Themed paragraph with ODS design tokens
      </p>
      <button className="bg-primary-500 text-white px-4 py-2 rounded-ods-sm h-ods-input">
        Themed Button
      </button>
    </div>
  );
}
```

### Performance Best Practices

#### 1. Theme Loading Optimization

```typescript
// Lazy load theme (only default available)
const loadTheme = async (themeName: string) => {
  switch (themeName) {
    case 'default':
      await import('@ovhcloud/ods-themes/default');
      break;
    default:
      console.warn(`Theme '${themeName}' not available. Using default theme.`);
      await import('@ovhcloud/ods-themes/default');
      break;
  }
};

// Usage
useEffect(() => {
  loadTheme('default'); // Only default theme available
}, []);
```

#### 2. CSS Custom Properties Fallbacks

```css
/* Always provide fallbacks for CSS custom properties */
.themed-element {
  background-color: #0050d7; /* Fallback */
  background-color: var(--ods-color-primary-500, #0050d7);
  padding: 1rem; /* Fallback */
  border-radius: 0.375rem; /* Fallback */
  border-radius: var(--ods-border-radius-md, 0.375rem);
  font-family: 'Source Sans Pro', sans-serif; /* Fallback */
  font-family: var(--ods-font-family-default, 'Source Sans Pro', sans-serif);
}
```

### Common Pitfalls and Solutions

#### ❌ Wrong: Missing Theme Import

```typescript
// Missing theme import
import { OsdsButton } from '@ovhcloud/ods-components/react';

function App() {
  return <OsdsButton>Unstyled Button</OsdsButton>; // No theme applied
}
```

#### ✅ Correct: Proper Theme Import

```typescript
// Import theme first
import '@ovhcloud/ods-themes/default';
import { OsdsButton } from '@ovhcloud/ods-components/react';

function App() {
  return <OsdsButton>Themed Button</OsdsButton>; // Properly themed
}
```

#### ❌ Wrong: Using Non-existent Themes

```typescript
// Wrong - these themes don't exist
import '@ovhcloud/ods-themes/blue-jeans'; // ❌ Doesn't exist
import '@ovhcloud/ods-themes/dark'; // ❌ Doesn't exist
```

#### ✅ Correct: Using Available Theme

```typescript
// Correct - only default theme is available
import '@ovhcloud/ods-themes/default'; // ✅ Available
```

#### ❌ Wrong: Missing CSS Custom Properties

```css
/* Missing CSS custom properties */
.custom-component {
  background-color: #0050d7; /* Hardcoded color */
  padding: 1rem; /* Hardcoded spacing */
  border-radius: 0.375rem; /* Hardcoded border radius */
}
```

#### ✅ Correct: Using CSS Custom Properties

```css
/* Using CSS custom properties */
.custom-component {
  background-color: var(--ods-color-primary-500);
  padding: 1rem; /* Use standard CSS units for spacing */
  border-radius: var(--ods-border-radius-md);
  font-family: var(--ods-font-family-default);
}
```

### Testing Guidelines

#### 1. Theme Testing

```typescript
// Test theme application
import { render, screen } from '@testing-library/react';
import '@ovhcloud/ods-themes/default';
import { ThemeProvider } from './ThemeProvider';

test('applies correct theme class', () => {
  render(
    <ThemeProvider>
      <div>Test content</div>
    </ThemeProvider>
  );
  
  expect(document.documentElement).toHaveClass('ods-theme');
});
```

#### 2. CSS Custom Properties Testing

```typescript
// Test CSS custom properties
test('applies CSS custom properties', () => {
  const { container } = render(
    <div className="ods-theme">
      <div className="test-element">Test</div>
    </div>
  );
  
  const testElement = container.querySelector('.test-element');
  const computedStyle = window.getComputedStyle(testElement);
  
  expect(computedStyle.getPropertyValue('--ods-color-primary-500')).toBeTruthy();
});
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always import theme first**: `import '@ovhcloud/ods-themes/default';`
2. **Use CSS custom properties**: `var(--ods-color-primary-500)` instead of hardcoded values
3. **Apply theme classes**: Use `ods-theme` class on root elements
4. **Provide fallbacks**: Always provide fallback values for CSS custom properties
5. **Optimize theme loading**: Use dynamic imports for multiple themes
6. **Test theme switching**: Ensure themes can be switched dynamically
7. **Use design tokens**: Leverage spacing, typography, and color tokens
8. **Support dark mode**: Implement dark mode with proper theme classes
9. **Performance**: Lazy load themes when possible
10. **Accessibility**: Ensure themes maintain proper contrast ratios

### Theme Selection Guide

- **Default Theme**: Use for all OVHcloud applications (only theme available)
- **Custom Themes**: Create for specific brand requirements by overriding CSS custom properties

### Integration with ODS Components

```typescript
// Always import theme before components
import '@ovhcloud/ods-themes/default';
import { OsdsButton, OsdsModal, OsdsInput } from '@ovhcloud/ods-components/react';

// Theme is automatically applied to ODS components
<OsdsButton color="primary">Themed Button</OsdsButton>
```

### Integration with Manager React Components

```typescript
// Import theme first
import '@ovhcloud/ods-themes/default';

// Then import MRC components
import { ManagerButton, Datagrid } from '@ovh-ux/manager-react-components';

// MRC components inherit ODS theming
<ManagerButton id="action" label="Action" />
```
