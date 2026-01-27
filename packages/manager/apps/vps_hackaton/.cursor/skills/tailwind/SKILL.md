---
name: tailwind
description: Apply Tailwind CSS best practices, utility patterns, and responsive design. Use when styling components or working with Tailwind classes.
---

# Tailwind CSS Best Practices

## Utility Classes

### Common Patterns

```tsx
// ✅ GOOD: Layout utilities
<div className="flex w-full flex-col gap-6">
  <section className="mb-8">
    {/* content */}
  </section>
</div>

// ✅ GOOD: Grid layouts
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {/* items */}
</div>

// ✅ GOOD: Spacing
<div className="mt-8 px-4 py-8 md:mt-2 md:px-10 md:py-9">
  {/* content */}
</div>
```

### ODS Theme Variable Integration

```tsx
// ✅ GOOD: Use ODS CSS variables in Tailwind classes
<Text className="text-[--ods-color-critical-500]">
  Error message
</Text>

<div className="bg-[--ods-color-primary-100] hover:bg-[--ods-color-primary-200]">
  Interactive element
</div>

// ✅ GOOD: Conditional styling with ODS variables
<Text
  className={clsx('text-sm', {
    'text-[--ods-color-critical-500]': hasError,
    'text-[--ods-color-primary-500]': isActive,
  })}
>
  Content
</Text>
```

## Responsive Design

### Breakpoints

```tsx
// ✅ GOOD: Mobile-first approach
<div className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-4 
  gap-4
">
  {/* Responsive grid */}
</div>

// ✅ GOOD: Responsive spacing
<div className="mt-4 md:mt-8 lg:mt-12">
  {/* Content */}
</div>

// ✅ GOOD: Responsive visibility
<div className="hidden md:block">
  {/* Desktop only */}
</div>
<div className="block md:hidden">
  {/* Mobile only */}
</div>
```

### Common Responsive Patterns

```tsx
// ✅ GOOD: Responsive padding/margin
<div className="px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
  {/* Content */}
</div>

// ✅ GOOD: Responsive text sizes
<Text className="text-sm md:text-base lg:text-lg">
  Responsive text
</Text>

// ✅ GOOD: Responsive flex direction
<div className="flex flex-col md:flex-row gap-4">
  {/* Content */}
</div>
```

## Styling Patterns

### Conditional Classes

```tsx
// ✅ GOOD: Use clsx for conditional classes
import clsx from 'clsx';

<div
  className={clsx('base-class', {
    'active-class': isActive,
    'error-class': hasError,
    'disabled-class': isDisabled,
    'hover:bg-primary-100': !isDisabled,
  })}
>
  Content
</div>
```

### Common Utility Combinations

```tsx
// ✅ GOOD: Card-like containers
<div className="flex flex-col gap-6 p-6 border border-[--ods-color-neutral-200] rounded">
  {/* Card content */}
</div>

// ✅ GOOD: Button-like elements
<div className="
  px-4 py-2 
  bg-[--ods-color-primary-500] 
  text-white 
  rounded 
  cursor-pointer 
  hover:bg-[--ods-color-primary-600]
">
  Button
</div>

// ✅ GOOD: Form layouts
<div className="flex flex-col gap-4 max-w-md">
  {/* Form fields */}
</div>
```

## When to Use Tailwind vs SCSS

### Use Tailwind For:
- All standard styling (spacing, colors, layout, typography)
- Responsive design
- Utility-based styling
- Conditional classes

### Use SCSS For:
- ODS component parts (`::part()` selectors)
- Complex custom styles difficult to express with utilities
- Global styles in `index.scss`
- CSS custom properties for ODS theme variables

## Integration with ODS

### ODS Theme Variables

```tsx
// ✅ GOOD: Colors from ODS theme
className="text-[--ods-color-primary-500]"
className="bg-[--ods-color-neutral-100]"
className="border-[--ods-color-critical-500]"

// ✅ GOOD: Hover states with ODS colors
className="hover:bg-[--ods-color-primary-100]"
className="hover:text-[--ods-color-primary-600]"
```

### SCSS for ODS Parts

```scss
// ✅ GOOD: Style ODS component parts in SCSS
ods-text.custom-class::part(text) {
  font-weight: bold;
  color: var(--ods-color-primary-500);
}
```

## Best Practices

1. **Mobile-first**: Start with mobile styles, add desktop with breakpoints
2. **Consistency**: Use consistent spacing scale (4, 8, 16, 24, etc.)
3. **Readability**: Break long className strings across lines for complex cases
4. **ODS First**: Always use ODS theme variables for colors
5. **Responsive**: Always consider responsive design
6. **Performance**: Tailwind purges unused classes in production
