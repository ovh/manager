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
import { Button, Modal, Input } from '@ovhcloud/ods-components/react';
```

### Available Themes

| Theme | Import | Description | Use Case |
|-------|--------|-------------|----------|
| **default** | `import '@ovhcloud/ods-themes/default';` | Standard OVHcloud theme | Default applications |
| **blue-jeans** | `import '@ovhcloud/ods-themes/blue-jeans';` | Blue accent theme | Specialized applications |
| **dark** | `import '@ovhcloud/ods-themes/dark';` | Dark mode variant | Dark mode support |

### Theme Structure

```css
/* CSS Custom Properties Structure */
:root {
  /* Colors */
  --ods-color-primary-500: #0072ff;
  --ods-color-primary-600: #0056b3;
  --ods-color-secondary-500: #6c757d;
  
  /* Spacing */
  --ods-size-01: 0.25rem;  /* 4px */
  --ods-size-02: 0.5rem;   /* 8px */
  --ods-size-03: 0.75rem;  /* 12px */
  --ods-size-04: 1rem;     /* 16px */
  --ods-size-05: 1.25rem;  /* 20px */
  --ods-size-06: 1.5rem;   /* 24px */
  
  /* Typography */
  --ods-font-family-primary: 'Inter', sans-serif;
  --ods-font-size-xs: 0.75rem;
  --ods-font-size-s: 0.875rem;
  --ods-font-size-m: 1rem;
  --ods-font-size-l: 1.125rem;
  --ods-font-size-xl: 1.25rem;
  
  /* Shadows */
  --ods-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ods-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --ods-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Border Radius */
  --ods-border-radius-sm: 0.25rem;
  --ods-border-radius-md: 0.375rem;
  --ods-border-radius-lg: 0.5rem;
  --ods-border-radius-xl: 0.75rem;
}
```

### Theme Usage Patterns

#### 1. Basic Theme Application

```typescript
// App.tsx or main entry point
import '@ovhcloud/ods-themes/default';
import { Button, Modal } from '@ovhcloud/ods-components/react';

function App() {
  return (
    <div className="ods-theme">
      <Button color="primary">Themed Button</Button>
    </div>
  );
}
```

#### 2. Multiple Theme Support

```typescript
// Theme provider component
import { useState, useEffect } from 'react';
import '@ovhcloud/ods-themes/default';
import '@ovhcloud/ods-themes/blue-jeans';
import '@ovhcloud/ods-themes/dark';

type Theme = 'default' | 'blue-jeans' | 'dark';

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('default');

  useEffect(() => {
    // Apply theme class to document
    document.documentElement.className = `ods-theme-${theme}`;
  }, [theme]);

  return (
    <div className={`ods-theme-${theme}`}>
      {children}
    </div>
  );
}
```

#### 3. Dynamic Theme Switching

```typescript
import { useState } from 'react';
import '@ovhcloud/ods-themes/default';
import '@ovhcloud/ods-themes/blue-jeans';
import { Button } from '@ovhcloud/ods-components/react';

function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<'default' | 'blue-jeans'>('default');

  const switchTheme = () => {
    const newTheme = currentTheme === 'default' ? 'blue-jeans' : 'default';
    setCurrentTheme(newTheme);
    
    // Update document class
    document.documentElement.className = `ods-theme-${newTheme}`;
  };

  return (
    <Button onClick={switchTheme}>
      Switch to {currentTheme === 'default' ? 'Blue Jeans' : 'Default'} Theme
    </Button>
  );
}
```

#### 4. Custom Theme Variables

```css
/* Custom theme overrides */
.ods-theme-custom {
  /* Override primary colors */
  --ods-color-primary-500: #ff6b35;
  --ods-color-primary-600: #e55a2b;
  
  /* Override spacing */
  --ods-size-04: 1.125rem; /* 18px instead of 16px */
  
  /* Override typography */
  --ods-font-family-primary: 'Roboto', sans-serif;
}

/* Apply custom theme */
.custom-theme {
  @apply ods-theme-custom;
}
```

```typescript
// Using custom theme
import '@ovhcloud/ods-themes/default';
import './custom-theme.css';
import { Button } from '@ovhcloud/ods-components/react';

function CustomThemedComponent() {
  return (
    <div className="custom-theme">
      <Button color="primary">Custom Themed Button</Button>
    </div>
  );
}
```

### Dark Mode Implementation

```typescript
import { useState, useEffect } from 'react';
import '@ovhcloud/ods-themes/default';
import '@ovhcloud/ods-themes/dark';

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
      document.documentElement.classList.add('ods-theme-dark');
    } else {
      document.documentElement.classList.remove('ods-theme-dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? 'ods-theme-dark' : 'ods-theme-default'}>
      <button onClick={toggleDarkMode}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      {children}
    </div>
  );
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
  padding: var(--ods-size-04);
  box-shadow: var(--ods-shadow-sm);
  border: 1px solid var(--ods-color-neutral-200);
  
  &:hover {
    box-shadow: var(--ods-shadow-md);
  }
`;

const StyledButton = styled.button`
  background-color: var(--ods-color-primary-500);
  color: var(--ods-color-neutral-000);
  border: none;
  border-radius: var(--ods-border-radius-sm);
  padding: var(--ods-size-02) var(--ods-size-04);
  font-family: var(--ods-font-family-primary);
  font-size: var(--ods-font-size-m);
  
  &:hover {
    background-color: var(--ods-color-primary-600);
  }
  
  &:disabled {
    background-color: var(--ods-color-neutral-300);
    cursor: not-allowed;
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
        }
      },
      spacing: {
        'ods-01': 'var(--ods-size-01)',
        'ods-02': 'var(--ods-size-02)',
        'ods-03': 'var(--ods-size-03)',
        'ods-04': 'var(--ods-size-04)',
        'ods-05': 'var(--ods-size-05)',
        'ods-06': 'var(--ods-size-06)',
      },
      fontFamily: {
        primary: ['var(--ods-font-family-primary)'],
      },
      fontSize: {
        'ods-xs': 'var(--ods-font-size-xs)',
        'ods-s': 'var(--ods-font-size-s)',
        'ods-m': 'var(--ods-font-size-m)',
        'ods-l': 'var(--ods-font-size-l)',
        'ods-xl': 'var(--ods-font-size-xl)',
      },
      boxShadow: {
        'ods-sm': 'var(--ods-shadow-sm)',
        'ods-md': 'var(--ods-shadow-md)',
        'ods-lg': 'var(--ods-shadow-lg)',
      },
      borderRadius: {
        'ods-sm': 'var(--ods-border-radius-sm)',
        'ods-md': 'var(--ods-border-radius-md)',
        'ods-lg': 'var(--ods-border-radius-lg)',
        'ods-xl': 'var(--ods-border-radius-xl)',
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
    <div className="bg-neutral-100 p-ods-04 rounded-ods-md shadow-ods-sm">
      <h2 className="font-primary text-ods-l text-primary-500">
        Themed Heading
      </h2>
      <p className="text-ods-m text-neutral-700">
        Themed paragraph with ODS design tokens
      </p>
    </div>
  );
}
```

### Performance Best Practices

#### 1. Theme Loading Optimization

```typescript
// Lazy load themes
const loadTheme = async (themeName: string) => {
  switch (themeName) {
    case 'default':
      await import('@ovhcloud/ods-themes/default');
      break;
    case 'blue-jeans':
      await import('@ovhcloud/ods-themes/blue-jeans');
      break;
    case 'dark':
      await import('@ovhcloud/ods-themes/dark');
      break;
  }
};

// Usage
useEffect(() => {
  loadTheme(selectedTheme);
}, [selectedTheme]);
```

#### 2. CSS Custom Properties Fallbacks

```css
/* Always provide fallbacks for CSS custom properties */
.themed-element {
  background-color: #0072ff; /* Fallback */
  background-color: var(--ods-color-primary-500, #0072ff);
  padding: 16px; /* Fallback */
  padding: var(--ods-size-04, 16px);
}
```

### Common Pitfalls and Solutions

#### ❌ Wrong: Missing Theme Import

```typescript
// Missing theme import
import { Button } from '@ovhcloud/ods-components/react';

function App() {
  return <Button>Unstyled Button</Button>; // No theme applied
}
```

#### ✅ Correct: Proper Theme Import

```typescript
// Import theme first
import '@ovhcloud/ods-themes/default';
import { Button } from '@ovhcloud/ods-components/react';

function App() {
  return <Button>Themed Button</Button>; // Properly themed
}
```

#### ❌ Wrong: Incorrect Theme Class Application

```typescript
// Wrong theme class
<div className="ods-theme-default"> // Incorrect class name
  <Button>Themed Button</Button>
</div>
```

#### ✅ Correct: Proper Theme Class

```typescript
// Correct theme class
<div className="ods-theme"> // Correct class name
  <Button>Themed Button</Button>
</div>
```

#### ❌ Wrong: Missing CSS Custom Properties

```css
/* Missing CSS custom properties */
.custom-component {
  background-color: #0072ff; /* Hardcoded color */
  padding: 16px; /* Hardcoded spacing */
}
```

#### ✅ Correct: Using CSS Custom Properties

```css
/* Using CSS custom properties */
.custom-component {
  background-color: var(--ods-color-primary-500);
  padding: var(--ods-size-04);
}
```

### Testing Guidelines

#### 1. Theme Testing

```typescript
// Test theme switching
import { render, screen } from '@testing-library/react';
import '@ovhcloud/ods-themes/default';
import { ThemeProvider } from './ThemeProvider';

test('applies correct theme class', () => {
  render(
    <ThemeProvider theme="blue-jeans">
      <div>Test content</div>
    </ThemeProvider>
  );
  
  expect(document.documentElement).toHaveClass('ods-theme-blue-jeans');
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

- **Default Theme**: Use for standard OVHcloud applications
- **Blue Jeans Theme**: Use for specialized or branded applications
- **Dark Theme**: Use for dark mode support
- **Custom Themes**: Create for specific brand requirements

### Integration with ODS Components

```typescript
// Always import theme before components
import '@ovhcloud/ods-themes/default';
import { Button, Modal, Input } from '@ovhcloud/ods-components/react';

// Theme is automatically applied to ODS components
<Button color="primary">Themed Button</Button>
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
