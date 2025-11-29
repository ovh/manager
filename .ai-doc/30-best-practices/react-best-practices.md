---
title: React Best Practices: Hooks, Components, Purity, and Everyday Pitfalls
last_update: 2025-01-27
tags: [react, hooks, components, best-practices, performance, ovhcloud, manager]
ai: true
---

# React Best Practices: Hooks, Components, Purity, and Everyday Pitfalls

## 🧭 Purpose

This document provides comprehensive guidelines for writing maintainable, performant, and bug-free React code in the OVHcloud Manager ecosystem. It covers essential patterns for Hooks usage, component design, performance optimization, and common pitfalls to avoid.

## ⚙️ Context

React best practices are essential for:
- **Maintainable code** that can evolve over time
- **Performance optimization** without premature optimization
- **Bug prevention** through proper patterns and linting
- **Team collaboration** with shared understanding
- **Consistent development** across all Manager µApps

## 🔗 References

- [Development Standards](./development-standards.md)
- [TypeScript Cheat Sheet](./typescript-cheatsheet.md)
- [Frontend Design Patterns](./frontend-design-patterns.md)
- [Frontend React Patterns](./frontend-react-patterns.md)
- [MUK Components](../20-dependencies/muk.md)
- [Manager React Core Application](../20-dependencies/manager-react-core-application.md)
- [React Official Documentation](https://react.dev/)

## 📘 Essential Rules

### 🎯 TL;DR

- ✅ **Call Hooks only at the top level** of function components or custom Hooks
- ❌ **Never call Hooks** in plain functions, render callbacks, loops, conditions, or nested functions
- ✅ **Reuse stateless logic** with utility functions
- ✅ **Reuse stateful UI logic** with custom Hooks (useX)
- ✅ **Keep components pure** (no side-effects during render)
- ✅ **Prefer props + composition**; memoize references when passing objects/functions deeply
- ✅ **Use TypeScript** for type safety
- ✅ **Test components** with React Testing Library
- ✅ **Use `useLogger`** from `@ovh-ux/manager-react-core-application` for debug logging (never `console.log`)

## 🎣 Rules of Hooks

### ✅ Valid Hook Calls

```typescript
// ✅ CORRECT: Top-level Hook calls
function Page() {
  const router = useRouter();        // ✅ top-level
  const data = useQuery(...);        // ✅ top-level
  return <Content router={router} data={data} />;
}

// ✅ CORRECT: Custom Hook calling other Hooks
function useLicenseTools() {
  const router = useRouter();
  const generateUrl = useCallback(
    (id: string) => router.link(`/licenses/${id}`),
    [router]
  );
  return { generateUrl };
}
```

### ❌ Invalid Hook Calls

```typescript
// ❌ WRONG: Hook in plain function
function buildCell(...) {
  const { generateUrl } = useGenerateUrl();  // ❌ Not a component or Hook
}

// ❌ WRONG: Hook in loop/condition/nested function
function Page({ items }: { items: Item[] }) {
  if (items.length) {
    useEffect(() => {}, []);                 // ❌ conditional
  }
  
  items.forEach(() => {
    useRef(null);                            // ❌ loop
  });
  
  function helper() {
    useMemo(() => 42, []);                   // ❌ nested function
  }
}
```

## 🧹 Keep Components Pure

A component should behave like a **pure function**:
- **Same inputs → same output** (JSX)
- **No side effects during render**

### Side Effects Go in useEffect

```typescript
// ✅ CORRECT: Pure component
function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// ✅ CORRECT: Side effects in useEffect
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  return <div>{user?.name}</div>;
}

// ❌ WRONG: Side effect during render
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  fetchUser(userId).then(setUser); // ❌ Side effect during render
  
  return <div>{user?.name}</div>;
}
```

### React Strict Mode Detection

React Strict Mode helps detect impure components:
- Components render twice in development
- Side effects during render cause issues
- Helps identify bugs early

## 🔄 Custom Hooks Best Practices

For comprehensive custom hooks patterns (Data Fetching, Form Handling, Local Storage, etc.), see [Frontend React Patterns](./frontend-react-patterns.md#custom-hooks-patterns).

### Naming Convention
- **Custom Hooks**: Start with `use` (e.g., `useUserData`, `useApiCall`)
- **Utility functions**: Don't start with `use` (e.g., `formatDate`, `validateEmail`)

### Hook for Stateful UI Logic

```typescript
// ✅ CORRECT: Hook for stateful UI logic
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  
  return { isOpen, openModal, closeModal };
}
```

### Utility Function for Pure Logic

```typescript
// ✅ CORRECT: Utility function for pure logic
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}
```

## 🚀 Performance Optimization

### Memoization with useMemo and useCallback

```typescript
// ✅ CORRECT: Memoize expensive calculations
function ExpensiveComponent({ items }: { items: Item[] }) {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);
  
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);
  
  return <div>{sortedItems.map(item => <div key={item.id}>{item.name}</div>)}</div>;
}

// ❌ WRONG: Unnecessary recalculation
function ExpensiveComponent({ items }: { items: Item[] }) {
  const sortedItems = items.sort((a, b) => a.name.localeCompare(b.name)); // ❌ Recalculates every render
  
  return <div>{sortedItems.map(item => <div key={item.id}>{item.name}</div>)}</div>;
}
```

### React.memo for Component Memoization

```typescript
// ✅ CORRECT: Memoize component to prevent re-renders
const UserProfile = React.memo(function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
});

// Only re-renders if user prop changes
```

## 🎯 Component Design Patterns

For comprehensive component design patterns (Container/Presentational, Compound Components, Render Props, etc.), see [Frontend React Patterns](./frontend-react-patterns.md).

## 🛡️ Error Handling

### Error Boundaries

```typescript
// ✅ CORRECT: Error boundary for catching component errors
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  static contextType = ShellContext;
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { shell } = this.context;
    if (shell?.logger) {
      shell.logger.error('Error caught by boundary:', error, errorInfo);
    }
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong: {this.state.error?.message}</div>;
    }
    
    return this.props.children;
  }
}
```

### Async Error Handling

```typescript
// ✅ CORRECT: Handle async errors properly
function DataComponent() {
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(err => {
        setError(err);
        // Log error
        if (logger) {
          logger.error('Failed to fetch data:', err);
        }
      });
  }, []);
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  return <div>Data loaded</div>;
}
```

## 📝 Logging and Debugging

### useLogger Hook

```typescript
import { useLogger } from '@ovh-ux/manager-react-core-application';

function DataComponent() {
  const logger = useLogger();
  
  const handleSave = async () => {
    if (logger) {
      logger.info('Saving data...');
    }
    
    try {
      await saveData();
      if (logger) {
        logger.info('Data saved successfully');
      }
    } catch (error) {
      if (logger) {
        logger.error('Failed to save data:', error);
      }
    }
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```

**Logger API:**
- `logger.info(message: string, ...args): void`
- `logger.warn(message: string, ...args): void`
- `logger.error(message: string, ...args): void`
- `logger.debug(message: string, ...args): void`

**Best Practices:**
1. Always check if logger exists: `if (logger) { logger.info(...) }`
2. Use appropriate log levels (info, warn, error, debug)
3. Don't log sensitive data
4. Use structured logging when possible

**Enable Debug Mode:**
```typescript
localStorage.setItem('MANAGER_SHELL_DEBUG', 'true');
```

**Important:** Use `useLogger` for debugging, `useNotifications` (from MUK) for user-facing messages.

## 🧪 Testing Best Practices

For comprehensive testing patterns, see [Frontend React Patterns](./frontend-react-patterns.md#testing-patterns).

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from './UserProfile';

test('renders user information', () => {
  const user = { name: 'John Doe', email: 'john@example.com' };
  render(<UserProfile user={user} />);
  
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('john@example.com')).toBeInTheDocument();
});
```

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('increments counter', () => {
  const { result } = renderHook(() => useCounter(0));
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

## 🚨 Common Pitfalls

### 1. Stale Closures

```typescript
// ❌ WRONG: Stale closure
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setTimeout(() => {
      setCount(count + 1); // ❌ Stale closure
    }, 1000);
  };
  return <button onClick={handleClick}>Count: {count}</button>;
}

// ✅ CORRECT: Functional update
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setTimeout(() => {
      setCount(prev => prev + 1); // ✅ Functional update
    }, 1000);
  };
  return <button onClick={handleClick}>Count: {count}</button>;
}
```

### 2. Missing Dependencies

```typescript
// ❌ WRONG: Missing dependencies
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // ❌ Missing userId
  
  return <div>{user?.name}</div>;
}

// ✅ CORRECT: Complete dependencies
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // ✅ Complete dependencies
  
  return <div>{user?.name}</div>;
}
```

### 3. Unnecessary Re-renders

```typescript
// ❌ WRONG: Object/function created on every render
function ParentComponent() {
  const [count, setCount] = useState(0);
  const handleClick = () => setCount(prev => prev + 1); // ❌ New function every render
  return <ChildComponent onClick={handleClick} />;
}

// ✅ CORRECT: Memoized function
function ParentComponent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => setCount(prev => prev + 1), []); // ✅ Memoized
  return <ChildComponent onClick={handleClick} />;
}
```

## 📚 TypeScript Integration

### Proper Type Definitions

```typescript
// ✅ CORRECT: Proper TypeScript types
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserProfileProps {
  user: User;
  onEdit?: (user: User) => void;
}

function UserProfile({ user, onEdit }: UserProfileProps) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {onEdit && <button onClick={() => onEdit(user)}>Edit</button>}
    </div>
  );
}
```

### Generic Components

```typescript
// ✅ CORRECT: Generic components for reusability
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

## 🔧 Development Tools

### ESLint Configuration

```json
{
  "extends": [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off"
  }
}
```

### React DevTools
- **Components tab**: Inspect component tree and props
- **Profiler tab**: Identify performance bottlenecks
- **Hooks tab**: Debug Hook state and effects

## 🤖 AI Development Guidelines

### Essential Rules

1. **Call Hooks only at top level** - Never in loops, conditions, or nested functions
2. **Keep components pure** - No side effects during render
3. **Use useCallback/useMemo** - When passing functions/objects to child components
4. **Handle all states** - Loading, error, success states
5. **Use TypeScript** - For type safety
6. **Test components** - With React Testing Library
7. **Use useLogger** - Never console.log
8. **Memoize appropriately** - Don't over-memoize, don't under-memoize

### Quick Reference Checklist

- [ ] Hooks called at top level only
- [ ] Components are pure (no side effects in render)
- [ ] Dependencies complete in useEffect/useMemo/useCallback
- [ ] Loading/error states handled
- [ ] TypeScript types defined
- [ ] Tests written for components
- [ ] useLogger used instead of console.log

---

## ⚖️ The React's Moral

- **Pure components** ensure predictable behavior
- **Proper Hook usage** prevents bugs and improves performance
- **TypeScript** provides safety and better developer experience
- **Testing** ensures code quality and prevents regressions

**👉 Good React code is maintainable, performant, and bug-free.**
