---
title: React Best Practices: Hooks, Components, Purity, and Everyday Pitfalls
last_update: 2025-01-27
tags: [react, hooks, components, best-practices, performance, ovhcloud, manager]
ai: true
---

# React Best Practices: Hooks, Components, Purity, and Everyday Pitfalls

## 🧭 Purpose

This document provides comprehensive guidelines for writing maintainable, performant, and bug-free React code in the OVHcloud Manager ecosystem. It covers essential patterns for Hooks usage, component design, performance optimization, and common pitfalls to avoid.

The guide emphasizes defensive programming strategies and proper React patterns to prevent runtime errors, improve code quality, and ensure consistent development practices across all Manager applications.

## ⚙️ Context

React best practices are essential for:
- **Maintainable code** that can evolve over time
- **Performance optimization** without premature optimization
- **Bug prevention** through proper patterns and linting
- **Team collaboration** with shared understanding
- **Consistent development** across all Manager µApps

This guide is designed for developers working with:
- **React 18+** applications in the Manager ecosystem
- **TypeScript** with strict type checking
- **Modern React patterns** with Hooks and functional components
- **Performance-critical** applications with complex state management

## 🔗 References

- [Development Standards](./development-standards.md)
- [TypeScript Cheat Sheet](./typescript-cheatsheet.md)
- [Frontend Design Patterns](./frontend-design-patterns.md)
- [MRC Components](../20-design-system/mrc-components.md)
- [ODS Components](../20-design-system/ods-components.md)
- [React Official Documentation](https://react.dev/)
- [React Hooks Documentation](https://react.dev/reference/react)

## 📘 Guidelines / Implementation

### 🎯 TL;DR - Essential Rules

- ✅ **Call Hooks only at the top level** of function components or custom Hooks
- ❌ **Never call Hooks** in plain functions, render callbacks, loops, conditions, or nested functions
- ✅ **Reuse stateless logic** with utility functions
- ✅ **Reuse stateful UI logic** with custom Hooks (useX)
- ✅ **Keep components pure** (no side-effects during render)
- ✅ **Prefer props + composition**; memoize references when passing objects/functions deeply
- ✅ **Use useMemo/useCallback** only for performance stability, not by default

### 🔧 Hooks vs Utility Functions

| Topic | Custom Hook | Utility Function |
|-------|-------------|------------------|
| **Purpose** | Reuse stateful UI logic across components | Reuse stateless or non-React logic |
| **Naming** | Must start with `use` (e.g., `useGenerateUrl`) | Any name (e.g., `formatPrice`) |
| **Where it can be called** | Only in function components or other Hooks | Anywhere |
| **May call other Hooks?** | ✅ Yes | ❌ No |
| **Tied to React render cycle?** | ✅ Yes | ❌ No |

#### Custom Hook Example
```typescript
// ✅ CORRECT: Custom Hook for stateful UI logic
export function useGenerateUrl() {
  const router = useRouter();
  return useCallback((id: string) => router.link(`/licenses/${id}`), [router]);
}

// Usage in component
function LicensePage() {
  const generateUrl = useGenerateUrl();
  return <Link to={generateUrl('123')}>View License</Link>;
}
```

#### Utility Function Example
```typescript
// ✅ CORRECT: Utility function for pure calculations
export function formatPrice(cents: number, locale = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(cents / 100);
}

// Usage anywhere
const price = formatPrice(1999); // "19,99 €"
```

### 📋 Rules of Hooks (What & Why)

#### The Two Rules
1. **Only call Hooks at the top level** of a React function (no loops, conditions, nested functions, or try/catch)
2. **Only call Hooks from React functions** (function components or custom Hooks)

#### Why These Rules Exist
React needs a **predictable call order per render** to map Hooks to their internal state slots. Violating the rules breaks that mapping.

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

// ❌ WRONG: Hook inside useMemo/useCallback callback
const columns = useMemo(() => {
  const x = useSomething();                  // ❌ nested Hook
  return [];
}, []);
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

### ⚡ Effects, Events, and Escape Hatches

#### Prefer Event Handlers Over Effects
```typescript
// ❌ WRONG: Using Effect for user interaction
function SearchForm() {
  const [query, setQuery] = useState('');
  
  useEffect(() => {
    // Don't do this - use event handler instead
    if (query) {
      search(query);
    }
  }, [query]);
  
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

// ✅ CORRECT: Using event handler
function SearchForm() {
  const [query, setQuery] = useState('');
  
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery) {
      search(newQuery);
    }
  };
  
  return <input value={query} onChange={(e) => handleSearch(e.target.value)} />;
}
```

#### Use Effects for External System Synchronization
```typescript
// ✅ CORRECT: Syncing with external system
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}
```

### 🔄 Props, Identity, and Re-renders

#### React's Shallow Comparison
React compares props **shallowly**. Passing new objects/functions each render causes unnecessary re-renders.

```typescript
// ❌ WRONG: New objects/functions on every render
function Parent({ items }: { items: Item[] }) {
  return (
    <Child 
      data={[...items]}           // New array every render
      onClick={() => {}}          // New function every render
    />
  );
}

// ✅ CORRECT: Stable references
function Parent({ items }: { items: Item[] }) {
  const data = useMemo(() => [...items], [items]);
  const handleClick = useCallback(() => {}, []);
  
  return <Child data={data} onClick={handleClick} />;
}

// ✅ CORRECT: Prefer primitives
function Parent({ items }: { items: Item[] }) {
  return <Child itemCount={items.length} />; // Primitive value
}
```

#### Rule of Thumb
- **Prefer primitives** in props
- **If you must pass objects/arrays/functions** → stabilize them with `useMemo`/`useCallback`

### 🧠 Custom Hook vs Utility

#### Custom Hook - Uses React APIs
```typescript
// ✅ CORRECT: Custom Hook with React state/effects
export function useApiData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
          setError(err instanceof Error ? err.message : 'An error occurred');
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

#### Utility Function - Pure Calculation
```typescript
// ✅ CORRECT: Utility function for pure calculations
export function formatPrice(cents: number, locale = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(cents / 100);
}

export function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
```

### 🔧 Linting & Static Analysis

#### OVHcloud Static Analysis Kit
Always use the **@ovh-ux/manager-static-analysis-kit** for standardized linting:

```bash
# Migrate your app to use the static analysis kit
yarn manager-cli static-analysis-migrate --app <app-name>

# Preview changes safely
yarn manager-cli static-analysis-migrate --app <app-name> --dry-run
```

**⚠️ Do not hand-roll ESLint or TS configs** — migrate your app with the CLI instead.

The kit provides:
- **ESLint** with React Hooks rules
- **TypeScript** strict configuration
- **Prettier** code formatting
- **Complexity** analysis rules

### 🔨 Refactor Cookbook

#### A. Hook Inside a Loop
```typescript
// ❌ WRONG: Hook in loop
function ItemList({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map((item) => {
        const ref = useRef(null); // ❌ Hook in loop
        return <div key={item.id} ref={ref}>{item.name}</div>;
      })}
    </div>
  );
}

// ✅ CORRECT: Extract to component
function ItemRow({ item }: { item: Item }) {
  const ref = useRef(null); // ✅ Hook at top level
  return <div ref={ref}>{item.name}</div>;
}

function ItemList({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map((item) => (
        <ItemRow key={item.id} item={item} />
      ))}
    </div>
  );
}
```

#### B. Hook After Conditional Return
```typescript
// ❌ WRONG: Hook after early return
function Panel({ ready }: { ready: boolean }) {
  if (!ready) return null;
  const [open, setOpen] = useState(false); // ❌ Hook after return
  return <div>Panel content</div>;
}

// ✅ CORRECT: All Hooks before any returns
function Panel({ ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false); // ✅ Hook at top level
  if (!ready) return null;
  return <div>Panel content</div>;
}
```

#### C. Hook Inside useMemo/useCallback
```typescript
// ❌ WRONG: Hook inside useMemo
function DataTable() {
  const columns = useMemo(() => {
    const t = useTranslation(); // ❌ Hook inside useMemo
    return [
      { key: 'name', title: t('name') },
      { key: 'email', title: t('email') }
    ];
  }, []);
  
  return <Table columns={columns} />;
}

// ✅ CORRECT: Hook outside useMemo
function DataTable() {
  const t = useTranslation(); // ✅ Hook at top level
  const columns = useMemo(() => [
    { key: 'name', title: t('name') },
    { key: 'email', title: t('email') }
  ], [t]);
  
  return <Table columns={columns} />;
}
```

### 🎯 useCallback vs useMemo

Both are memoization hooks but solve different problems:

#### 🔹 useMemo - Cache Computation Results
```typescript
// ✅ CORRECT: useMemo for expensive computations
const sortedItems = useMemo(() => {
  return heavySort(items);
}, [items]);

// ✅ CORRECT: useMemo for stable object references
const style = useMemo(() => ({
  color: theme.primary,
  fontSize: '16px'
}), [theme.primary]);

// ✅ CORRECT: useMemo for filtered data
const filteredUsers = useMemo(() => {
  return users.filter(user => user.isActive);
}, [users]);
```

#### 🔹 useCallback - Cache Function References
```typescript
// ✅ CORRECT: useCallback for stable function references
const handleSave = useCallback(() => {
  save(data);
}, [data]);

// ✅ CORRECT: useCallback for event handlers
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);

// ✅ CORRECT: useCallback for React.memo children
const MemoizedChild = React.memo(Child);

function Parent() {
  const handleClick = useCallback(() => {
    // Handle click
  }, []);
  
  return <MemoizedChild onClick={handleClick} />;
}
```

#### 🔹 How to Decide
- **If you're memoizing a function** → use `useCallback`
- **If you're memoizing a value** → use `useMemo`

They are equivalent under the hood:
```typescript
useCallback(fn, deps) === useMemo(() => fn, deps)
```

But for readability, always use the semantically correct one.

#### 🔹 Common Pitfalls
```typescript
// ❌ WRONG: Overuse of memoization
const simpleValue = useMemo(() => a + b, [a, b]); // Unnecessary for simple math

// ❌ WRONG: Missing dependencies
const handleClick = useCallback(() => {
  console.log(data); // data not in deps
}, []); // Missing data dependency

// ❌ WRONG: Memoizing everything
const Component = React.memo(({ onClick }) => {
  const handleClick = useCallback(() => onClick(), [onClick]);
  const style = useMemo(() => ({ color: 'blue' }), []);
  // ... rest of component
});
```

### 🚀 Memoization & Performance Guidelines

#### When to Use Memoization
- **After profiling** or when reference stability is required
- **Heavy computations** (filtering, sorting, transformations)
- **Stable context values** for context consumers
- **Stable props** for React.memo children

#### When NOT to Use Memoization
- **Cheap calculations** (memoization has overhead)
- **By default** (premature optimization)
- **Simple primitives** (strings, numbers, booleans)

#### Performance Example
```typescript
// ✅ CORRECT: Memoize expensive computation
function ExpensiveComponent({ items }: { items: Item[] }) {
  const processedItems = useMemo(() => {
    return items
      .filter(item => item.isActive)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(item => ({
        ...item,
        displayName: `${item.name} (${item.category})`
      }));
  }, [items]);
  
  return (
    <ul>
      {processedItems.map(item => (
        <li key={item.id}>{item.displayName}</li>
      ))}
    </ul>
  );
}

// ✅ CORRECT: Memoize for React.memo
const MemoizedItem = React.memo(function Item({ item, onSelect }: ItemProps) {
  return (
    <div onClick={() => onSelect(item.id)}>
      {item.name}
    </div>
  );
});

function ItemList({ items, onSelect }: ItemListProps) {
  const handleSelect = useCallback((id: string) => {
    onSelect(id);
  }, [onSelect]);
  
  return (
    <div>
      {items.map(item => (
        <MemoizedItem 
          key={item.id} 
          item={item} 
          onSelect={handleSelect} 
        />
      ))}
    </div>
  );
}
```

### 🧹 Cleaning Up Effects & Timers

Always clean up subscriptions, timers, and event listeners to prevent memory leaks.

#### Event Listeners
```typescript
// ✅ CORRECT: Clean up event listeners
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size
    
    return () => {
      window.removeEventListener('resize', handleResize); // ✅ cleanup
    };
  }, []);
  
  return size;
}
```

#### Timers
```typescript
// ✅ CORRECT: Clean up timers
function useInterval(callback: () => void, delay: number) {
  useEffect(() => {
    const id = setInterval(callback, delay);
    
    return () => clearInterval(id); // ✅ cleanup
  }, [callback, delay]);
}

// ✅ CORRECT: Clean up timeouts
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler); // ✅ cleanup
  }, [value, delay]);
  
  return debouncedValue;
}
```

#### Subscriptions
```typescript
// ✅ CORRECT: Clean up subscriptions
function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => setSocket(ws);
    ws.onmessage = (event) => setMessage(event.data);
    ws.onclose = () => setSocket(null);
    
    return () => {
      ws.close(); // ✅ cleanup
    };
  }, [url]);
  
  return { socket, message };
}
```

**💡 Rule**: Always return a cleanup function from `useEffect` whenever you subscribe to something external.

### 🔍 Shallow Prop Comparison & React.memo

React compares props with **shallow equality** when deciding whether to re-render a `React.memo` component.

#### The Problem
```typescript
// ❌ WRONG: New references on every render
function Parent({ items }: { items: Item[] }) {
  return (
    <Child 
      data={[...items]}           // New array every render
      onClick={() => {}}          // New function every render
    />
  );
}

const Child = React.memo(({ data, onClick }: ChildProps) => {
  return <div onClick={onClick}>{data.length} items</div>;
});
```

Even if `items` doesn't change, `Child` will re-render because the `data` array and `onClick` function are new references every time.

#### The Solution
```typescript
// ✅ CORRECT: Stable references
function Parent({ items }: { items: Item[] }) {
  const data = useMemo(() => [...items], [items]);
  const handleClick = useCallback(() => {}, []);
  
  return <Child data={data} onClick={handleClick} />;
}

// ✅ CORRECT: Prefer primitives
function Parent({ items }: { items: Item[] }) {
  return <Child itemCount={items.length} />; // Primitive value
}
```

### 🐛 Common React Issues

#### Hook Placement & Order
```typescript
// ❌ WRONG: "Invalid hook call. Hooks can only be called inside of the body of a function component."
function buildCell(...) {
  const { generateUrl } = useGenerateUrl(); // ❌ Not a component or Hook
}

// ✅ CORRECT: Call Hooks only in components or custom Hooks
function CellComponent(...) {
  const { generateUrl } = useGenerateUrl(); // ✅ In component
  return <div>{generateUrl('123')}</div>;
}
```

#### Infinite Updates & Render Loops
```typescript
// ❌ WRONG: "Too many re-renders. React limits the number of renders to prevent an infinite loop."
function BadComponent() {
  const [count, setCount] = useState(0);
  
  // This will cause infinite re-renders
  setCount(count + 1); // ❌ Setting state during render
  
  return <div>{count}</div>;
}

// ✅ CORRECT: Set state in effects or event handlers
function GoodComponent() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1); // ✅ In event handler
  };
  
  return <button onClick={handleClick}>{count}</button>;
}
```

#### Lifecycle / Cleanup Mistakes
```typescript
// ❌ WRONG: "Warning: Can't perform a React state update on an unmounted component."
function BadComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData); // ❌ No cleanup, might set state after unmount
  }, []);
  
  return <div>{data}</div>;
}

// ✅ CORRECT: Clean up async operations
function GoodComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    fetchData().then(result => {
      if (!cancelled) {
        setData(result); // ✅ Only set state if component is still mounted
      }
    });
    
    return () => {
      cancelled = true; // ✅ Cleanup
    };
  }, []);
  
  return <div>{data}</div>;
}
```

#### Dependency Array Issues
```typescript
// ❌ WRONG: Missing dependencies
function BadComponent({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser); // ❌ userId not in deps
  }, []); // Missing userId dependency
  
  return <div>{user?.name}</div>;
}

// ✅ CORRECT: Complete dependencies
function GoodComponent({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // ✅ Include all dependencies
  
  return <div>{user?.name}</div>;
}
```

#### Cross-Component Updates During Render
```typescript
// ❌ WRONG: "Cannot update a component ('A') while rendering a different component ('B')."
function Parent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <Child onRender={() => setCount(count + 1)} /> {/* ❌ State update during render */}
      <div>Count: {count}</div>
    </div>
  );
}

// ✅ CORRECT: Move updates to effects or event handlers
function Parent() {
  const [count, setCount] = useState(0);
  
  const handleChildRender = useCallback(() => {
    setCount(prev => prev + 1); // ✅ In callback
  }, []);
  
  return (
    <div>
      <Child onRender={handleChildRender} />
      <div>Count: {count}</div>
    </div>
  );
}
```

#### Import/Version Pitfalls
```typescript
// ❌ WRONG: "useState is not a function" / "Cannot read properties of undefined (reading 'useState')"
import React from 'react'; // ❌ Wrong import
const [state, setState] = React.useState(0);

// ✅ CORRECT: Proper import
import React, { useState } from 'react';
const [state, setState] = useState(0);

// ✅ CORRECT: Or import from react only
import { useState } from 'react';
const [state, setState] = useState(0);
```

### 🧪 Testing React Components

#### Testing Hooks
```typescript
// ✅ CORRECT: Testing custom hooks
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('useCounter', () => {
  const { result } = renderHook(() => useCounter());
  
  expect(result.current.count).toBe(0);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

#### Testing Components
```typescript
// ✅ CORRECT: Testing components with hooks
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

test('Counter component', () => {
  render(<Counter />);
  
  expect(screen.getByText('Count: 0')).toBeInTheDocument();
  
  fireEvent.click(screen.getByText('Increment'));
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

---

## 🤖 AI Development Guidelines

### Essential React Rules for AI Code Generation

1. **Always call Hooks at the top level**: Never in loops, conditions, or nested functions
2. **Keep components pure**: No side effects during render
3. **Use proper dependency arrays**: Include all referenced variables in useEffect/useCallback/useMemo
4. **Clean up effects**: Always return cleanup functions for subscriptions and timers
5. **Prefer event handlers over effects**: Use effects only for external system synchronization
6. **Use memoization judiciously**: Only when needed for performance or reference stability
7. **Follow naming conventions**: Custom hooks must start with 'use'
8. **Handle async operations properly**: Use cleanup to prevent state updates after unmount
9. **Use proper imports**: Import hooks from 'react' correctly
10. **Test components thoroughly**: Include tests for custom hooks and components

### React Development Checklist

- [ ] All Hooks called at top level of components/custom hooks
- [ ] Components are pure (no side effects during render)
- [ ] All useEffect dependencies are included
- [ ] Cleanup functions returned from effects
- [ ] Custom hooks follow 'use' naming convention
- [ ] Memoization used only when necessary
- [ ] Event handlers preferred over effects for user interactions
- [ ] Async operations properly cleaned up
- [ ] Components tested with React Testing Library
- [ ] Static analysis kit configured and passing

### Common Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Hook in loop
{items.map(item => {
  const ref = useRef(null); // ❌ Hook in loop
  return <div ref={ref}>{item.name}</div>;
})}

// ❌ WRONG: Side effect during render
function Component() {
  document.title = 'New Title'; // ❌ Side effect during render
  return <div>Content</div>;
}

// ❌ WRONG: Missing dependencies
useEffect(() => {
  fetchData(userId); // ❌ userId not in deps
}, []); // Missing userId

// ❌ WRONG: No cleanup
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  // ❌ No cleanup function
}, []);
```

### Recommended Patterns

```typescript
// ✅ CORRECT: Hook at top level
function Component() {
  const ref = useRef(null); // ✅ Top level
  return <div ref={ref}>Content</div>;
}

// ✅ CORRECT: Side effect in useEffect
function Component() {
  useEffect(() => {
    document.title = 'New Title'; // ✅ In useEffect
  }, []);
  return <div>Content</div>;
}

// ✅ CORRECT: Complete dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]); // ✅ Include all dependencies

// ✅ CORRECT: Cleanup function
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer); // ✅ Cleanup
}, []);
```

---

## ⚖️ The React Developer's Moral

- **Hooks are the foundation** of modern React development
- **Pure components** are predictable and testable
- **Proper cleanup** prevents memory leaks and bugs
- **Performance optimization** should be measured, not assumed

**👉 Good React code is readable, maintainable, and follows the rules of Hooks.**

React best practices ensure that your components are predictable, performant, and free from common pitfalls. By following these guidelines, you'll write code that's easier to debug, test, and maintain in the long run.
