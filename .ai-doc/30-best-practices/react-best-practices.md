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
- [MRC Components](../20-dependencies/mrc-components.md)
- [ODS Components](../20-dependencies/ods-components.md)
- [React Official Documentation](https://react.dev/)

## 📘 Guidelines / Implementation

### 🎯 TL;DR - Essential Rules

- ✅ **Call Hooks only at the top level** of function components or custom Hooks
- ❌ **Never call Hooks** in plain functions, render callbacks, loops, conditions, or nested functions
- ✅ **Reuse stateless logic** with utility functions
- ✅ **Reuse stateful UI logic** with custom Hooks (useX)
- ✅ **Keep components pure** (no side-effects during render)
- ✅ **Prefer props + composition**; memoize references when passing objects/functions deeply
- ✅ **Use TypeScript** for type safety and better developer experience
- ✅ **Test components** with React Testing Library

### 🎣 Rules of Hooks

#### Valid Hook Calls
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

#### Invalid Hook Calls
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

### 🧹 Keep Components Pure

A component should behave like a **pure function**:
- **Same inputs → same output** (JSX)
- **No side effects during render**

#### Side Effects Go in useEffect
```typescript
// ✅ CORRECT: Pure component
function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// ✅ CORRECT: Side effects in useEffect
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Side effect: fetching data
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  if (!user) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

#### React Strict Mode Detection
React Strict Mode runs components **twice in development** to detect impurity:

```typescript
// ❌ WRONG: Impure component (side effect during render)
function ImpureComponent() {
  document.title = 'New Title'; // Side effect during render
  return <div>Content</div>;
}

// ✅ CORRECT: Pure component
function PureComponent() {
  useEffect(() => {
    document.title = 'New Title'; // Side effect in useEffect
  }, []);
  
  return <div>Content</div>;
}
```

### 🔄 Custom Hooks Best Practices

#### Naming Convention
- **Custom Hooks**: Start with `use` (e.g., `useUserData`, `useApiCall`)
- **Utility functions**: Don't start with `use` (e.g., `formatDate`, `validateEmail`)

#### Hook for Stateful UI Logic
```typescript
// ✅ CORRECT: Hook for stateful UI logic
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  
  return { isOpen, openModal, closeModal };
}

// Usage
function MyComponent() {
  const { isOpen, openModal, closeModal } = useModal();
  
  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      {isOpen && <Modal onClose={closeModal} />}
    </div>
  );
}
```

#### Utility Function for Pure Logic
```typescript
// ✅ CORRECT: Utility function for pure logic
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

// Usage
function MyComponent() {
  const formattedDate = formatDate(new Date());
  return <div>{formattedDate}</div>;
}
```

### 🚀 Performance Optimization

#### Memoization with useMemo and useCallback
```typescript
// ✅ CORRECT: Memoize expensive calculations
function ExpensiveComponent({ items }: { items: Item[] }) {
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);
  
  return <div>{expensiveValue}</div>;
}

// ✅ CORRECT: Memoize function references
function ParentComponent() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return <ChildComponent onClick={handleClick} />;
}
```

#### React.memo for Component Memoization
```typescript
// ✅ CORRECT: Memoize component to prevent unnecessary re-renders
const ExpensiveChild = React.memo(({ data }: { data: ComplexData }) => {
  return <div>{/* Expensive rendering */}</div>;
});

// Usage
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [data] = useState(complexData);
  
  return (
    <div>
      <button onClick={() => setCount(prev => prev + 1)}>
        Count: {count}
      </button>
      <ExpensiveChild data={data} />
    </div>
  );
}
```

### 🎯 Component Design Patterns

#### Composition over Inheritance
```typescript
// ✅ CORRECT: Composition pattern
function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

// Usage
function UserCard({ user }: { user: User }) {
  return (
    <Card title={user.name}>
      <p>{user.email}</p>
      <button>Edit</button>
    </Card>
  );
}
```

#### Render Props Pattern
```typescript
// ✅ CORRECT: Render props for flexible component composition
function DataFetcher({ 
  url, 
  children 
}: { 
  url: string; 
  children: (data: any, loading: boolean, error: Error | null) => React.ReactNode;
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return <>{children(data, loading, error)}</>;
}

// Usage
function UserList() {
  return (
    <DataFetcher url="/api/users">
      {(data, loading, error) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        return <div>{data.map(user => <div key={user.id}>{user.name}</div>)}</div>;
      }}
    </DataFetcher>
  );
}
```

### 🛡️ Error Handling

#### Error Boundaries
```typescript
// ✅ CORRECT: Error boundary for catching component errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong: {this.state.error?.message}</div>;
    }
    
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

#### Async Error Handling
```typescript
// ✅ CORRECT: Proper async error handling
function useAsyncData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      cancelled = true;
    };
  }, [url]);
  
  return { data, loading, error };
}
```

### 🧪 Testing Best Practices

#### Component Testing
```typescript
// ✅ CORRECT: Test component behavior, not implementation
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('should display user information', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    
    render(<UserProfile user={user} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
  
  it('should handle edit button click', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    const onEdit = jest.fn();
    
    render(<UserProfile user={user} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText('Edit'));
    
    expect(onEdit).toHaveBeenCalledWith(user);
  });
});
```

#### Hook Testing
```typescript
// ✅ CORRECT: Test custom hooks
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### 🚨 Common Pitfalls to Avoid

#### 1. Stale Closures
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

#### 2. Missing Dependencies
```typescript
// ❌ WRONG: Missing dependencies
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // ❌ Missing userId dependency
  
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

#### 3. Unnecessary Re-renders
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

### 📚 TypeScript Integration

#### Proper Type Definitions
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
  onDelete?: (userId: string) => void;
}

function UserProfile({ user, onEdit, onDelete }: UserProfileProps) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {onEdit && <button onClick={() => onEdit(user)}>Edit</button>}
      {onDelete && <button onClick={() => onDelete(user.id)}>Delete</button>}
    </div>
  );
}
```

#### Generic Components
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
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Usage
function UserList({ users }: { users: User[] }) {
  return (
    <List
      items={users}
      renderItem={(user) => <UserProfile user={user} />}
      keyExtractor={(user) => user.id}
    />
  );
}
```

### 🔧 Development Tools

#### ESLint Configuration
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
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

#### React DevTools
- **Components tab**: Inspect component tree and props
- **Profiler tab**: Identify performance bottlenecks
- **Hooks tab**: Debug Hook state and effects

### 📖 References

- [React Official Documentation](https://react.dev/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [TypeScript with React](https://www.typescriptlang.org/docs/handbook/react.html)
- [React DevTools](https://react.dev/learn/react-developer-tools)
