---
name: react
description: Apply React best practices for component development, hooks usage, and patterns. Use when creating React components, hooks, or when React patterns are needed.
---

# React Best Practices

## Component Patterns

### Functional Components

```typescript
// ✅ GOOD: Functional component with explicit types
type ComponentProps = {
  title: string;
  onAction: () => void;
  optional?: boolean;
};

export const ComponentName = ({ title, onAction, optional }: ComponentProps) => {
  const { t } = useTranslation(['common']);
  
  return (
    <article className="flex w-full flex-col">
      <Text preset="heading-2">{title}</Text>
      <Button onClick={onAction}>{t('action_label')}</Button>
    </article>
  );
};
```

### Component Organization

- **File naming**: `ComponentName.component.tsx` for components, `PageName.page.tsx` for pages
- **Folder structure**: Each component in its own camelCase folder
- **Co-location**: Keep related files together (component, tests, constants)

## Hooks Best Practices

### useState

```typescript
// ✅ GOOD: Initialize with proper types
const [value, setValue] = useState<string>('');
const [count, setCount] = useState<number>(0);
const [data, setData] = useState<TData | null>(null);
```

### useEffect

```typescript
// ✅ GOOD: Proper dependencies and cleanup
useEffect(() => {
  const subscription = subscribe();
  return () => {
    subscription.unsubscribe();
  };
}, [dependency]);

// ✅ GOOD: Separate effects by concern
useEffect(() => {
  // Effect 1
}, [dep1]);

useEffect(() => {
  // Effect 2
}, [dep2]);
```

### useMemo and useCallback

```typescript
// ✅ GOOD: Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ GOOD: Memoize callbacks passed to children
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### Custom Hooks

```typescript
// ✅ GOOD: Extract reusable logic
export const useCustomLogic = (param: string) => {
  const [state, setState] = useState<string>('');
  
  useEffect(() => {
    // Logic here
  }, [param]);
  
  return { state, setState };
};
```

## Performance Optimization

### Avoid Unnecessary Re-renders

```typescript
// ✅ GOOD: Memoize components when needed
import { memo } from 'react';

export const ExpensiveComponent = memo(({ data }: Props) => {
  // Component logic
});

// ✅ GOOD: Memoize callbacks
const handleAction = useCallback(() => {
  performAction(id);
}, [id]);
```

### Data Fetching

- Use TanStack Query for data fetching
- Place data hooks in `/data/hooks/`
- Use proper query keys and cache management

## TypeScript with React

### Props Types

```typescript
// ✅ GOOD: Explicit prop types
type Props = {
  required: string;
  optional?: number;
  callback: (value: string) => void;
  children?: React.ReactNode;
};

// ✅ GOOD: Extend HTML attributes when needed
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: 'primary' | 'secondary';
};
```

### Component Types

```typescript
// ✅ GOOD: FC type for components
import { FC } from 'react';

const Component: FC<Props> = ({ prop1, prop2 }) => {
  // ...
};

// ✅ GOOD: Direct function declaration (preferred)
export const Component = ({ prop1, prop2 }: Props) => {
  // ...
};
```

## Component Composition

### Prefer Composition

```typescript
// ✅ GOOD: Compose components
<Card>
  <CardHeader>
    <Title>{title}</Title>
  </CardHeader>
  <CardContent>
    {children}
  </CardContent>
</Card>

// ❌ BAD: Complex props
<Card header={header} content={content} footer={footer} />
```

### Children Pattern

```typescript
// ✅ GOOD: Use children prop
type Props = {
  title: string;
  children: React.ReactNode;
};

export const Layout = ({ title, children }: Props) => (
  <div>
    <h1>{title}</h1>
    {children}
  </div>
);
```

## Common Patterns

### Conditional Rendering

```typescript
// ✅ GOOD: Early returns
if (!data) return <Spinner />;
if (error) return <Error message={error} />;

return <Content data={data} />;

// ✅ GOOD: Conditional in JSX
{isLoading ? <Spinner /> : <Content />}
{condition && <Component />}
```

### Lists

```typescript
// ✅ GOOD: Keys and proper mapping
{items.map((item) => (
  <ItemComponent key={item.id} item={item} />
))}
```

### Event Handlers

```typescript
// ✅ GOOD: Inline handlers for simple cases
<Button onClick={() => handleClick(id)}>Click</Button>

// ✅ GOOD: Extracted handlers for complex logic
const handleClick = useCallback(() => {
  // Complex logic
  performAction(id);
  trackEvent('click', { id });
}, [id]);

<Button onClick={handleClick}>Click</Button>
```
