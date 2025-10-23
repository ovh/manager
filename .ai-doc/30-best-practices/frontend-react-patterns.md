---
title: Frontend React Patterns
last_update: 2025-01-27
tags: [react, patterns, frontend, components, hooks, ovhcloud, manager]
ai: true
---

# Frontend React Patterns

## 🧭 Purpose

This document defines the **frontend React patterns** used in the OVHcloud Manager ecosystem. It provides a comprehensive guide to common React patterns, component design principles, and architectural approaches that ensure consistency and maintainability across all Manager applications.

These patterns serve as a shared language for teams and provide proven solutions to common React development challenges.

## ⚙️ Context

Frontend React patterns are essential for:
- **Consistent component design** across all Manager applications
- **Reusable solutions** to common React problems
- **Team collaboration** with shared understanding
- **Maintainable code** that can evolve over time
- **Performance optimization** through proven patterns

This guide covers patterns specifically relevant to:
- **React 18+** applications in the Manager ecosystem
- **TypeScript** development with type safety
- **Modern React patterns** with Hooks and functional components
- **Manager-specific** patterns and conventions

## 🔗 References

- [React Best Practices](./react-best-practices.md)
- [Development Standards](./development-standards.md)
- [TypeScript Cheat Sheet](./typescript-cheatsheet.md)
- [Frontend Design Patterns](./frontend-design-patterns.md)
- [MRC Components](../20-dependencies/mrc-components.md)
- [ODS Components](../20-dependencies/ods-components.md)

## 📘 Guidelines / Implementation

### 🏗️ Component Architecture Patterns

#### 1. Container/Presentational Pattern
```typescript
// ✅ CORRECT: Container component (logic)
function UserListContainer() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers().then(setUsers).finally(() => setLoading(false));
  }, []);
  
  return <UserList users={users} loading={loading} />;
}

// ✅ CORRECT: Presentational component (UI)
interface UserListProps {
  users: User[];
  loading: boolean;
}

function UserList({ users, loading }: UserListProps) {
  if (loading) return <div>Loading...</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

#### 2. Compound Components Pattern
```typescript
// ✅ CORRECT: Compound components for flexible UI
interface ModalContextType {
  isOpen: boolean;
  onClose: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal components must be used within Modal');
  }
  return context;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

function ModalHeader({ children }: { children: React.ReactNode }) {
  return <div className="modal-header">{children}</div>;
}

function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="modal-body">{children}</div>;
}

function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className="modal-footer">{children}</div>;
}

function ModalCloseButton() {
  const { onClose } = useModalContext();
  return (
    <button className="modal-close" onClick={onClose}>
      ×
    </button>
  );
}

// Usage
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader>
    <h2>Confirm Action</h2>
    <ModalCloseButton />
  </ModalHeader>
  <ModalBody>
    <p>Are you sure you want to perform this action?</p>
  </ModalBody>
  <ModalFooter>
    <button onClick={() => setIsOpen(false)}>Cancel</button>
    <button onClick={handleConfirm}>Confirm</button>
  </ModalFooter>
</Modal>
```

#### 3. Render Props Pattern
```typescript
// ✅ CORRECT: Render props for flexible data sharing
interface DataFetcherProps<T> {
  url: string;
  children: (data: {
    data: T | null;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return <>{children({ data, loading, error })}</>;
}

// Usage
<DataFetcher<User[]> url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return <UserList users={data || []} />;
  }}
</DataFetcher>
```

### 🎣 Custom Hooks Patterns

#### 1. Data Fetching Hook
```typescript
// ✅ CORRECT: Custom hook for data fetching
function useApiData<T>(url: string) {
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

#### 2. Form Handling Hook
```typescript
// ✅ CORRECT: Custom hook for form handling
interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: (values: T) => Record<keyof T, string>;
  onSubmit: (values: T) => void | Promise<void>;
}

function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (validationSchema) {
      const validationErrors = validationSchema(values);
      const hasErrors = Object.values(validationErrors).some(error => error);
      
      if (hasErrors) {
        setErrors(validationErrors);
        return;
      }
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationSchema, onSubmit]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  };
}
```

#### 3. Local Storage Hook
```typescript
// ✅ CORRECT: Custom hook for local storage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}
```

### 🎨 UI Component Patterns

#### 1. Polymorphic Components
```typescript
// ✅ CORRECT: Polymorphic component
interface AsProp<C extends React.ElementType> {
  as?: C;
}

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref'];

type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = {}
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

function Box<C extends React.ElementType = "div">({
  as,
  ...props
}: PolymorphicComponentPropWithRef<C>) {
  const Component = as || "div";
  return <Component {...props} />;
}

// Usage
<Box as="button" onClick={handleClick}>Click me</Box>
<Box as="a" href="/link">Link</Box>
<Box as="section" className="container">Content</Box>
```

#### 2. Higher-Order Components (HOCs)
```typescript
// ✅ CORRECT: HOC for authentication
interface WithAuthProps {
  isAuthenticated: boolean;
  user: User | null;
}

function withAuth<P extends object>(
  Component: React.ComponentType<P & WithAuthProps>
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, user } = useAuth();
    
    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }
    
    return <Component {...props} isAuthenticated={isAuthenticated} user={user} />;
  };
}

// Usage
const ProtectedPage = withAuth(function Page({ user }: { user: User }) {
  return <div>Welcome, {user.name}!</div>;
});
```

#### 3. Context Pattern
```typescript
// ✅ CORRECT: Context for theme management
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### 🔄 State Management Patterns

#### 1. Reducer Pattern
```typescript
// ✅ CORRECT: useReducer for complex state
interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_FILTER'; payload: 'all' | 'active' | 'completed' };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, { id: Date.now().toString(), text: action.payload, completed: false }]
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        )
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all'
  });
  
  const filteredTodos = useMemo(() => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter(todo => !todo.completed);
      case 'completed':
        return state.todos.filter(todo => todo.completed);
      default:
        return state.todos;
    }
  }, [state.todos, state.filter]);
  
  return (
    <div>
      {/* Todo list implementation */}
    </div>
  );
}
```

#### 2. State Machine Pattern
```typescript
// ✅ CORRECT: State machine for complex UI states
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: any }
  | { status: 'error'; error: string };

type LoadingAction = 
  | { type: 'FETCH' }
  | { type: 'SUCCESS'; data: any }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' };

function loadingReducer(state: LoadingState, action: LoadingAction): LoadingState {
  switch (state.status) {
    case 'idle':
      if (action.type === 'FETCH') {
        return { status: 'loading' };
      }
      return state;
    
    case 'loading':
      if (action.type === 'SUCCESS') {
        return { status: 'success', data: action.data };
      }
      if (action.type === 'ERROR') {
        return { status: 'error', error: action.error };
      }
      return state;
    
    case 'success':
    case 'error':
      if (action.type === 'RESET') {
        return { status: 'idle' };
      }
      return state;
    
    default:
      return state;
  }
}
```

### 🎯 Performance Patterns

#### 1. Virtual Scrolling
```typescript
// ✅ CORRECT: Virtual scrolling for large lists
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

function VirtualList<T>({ items, itemHeight, containerHeight, renderItem }: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  
  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${visibleStart * itemHeight}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={visibleStart + index} style={{ height: itemHeight }}>
              {renderItem(item, visibleStart + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### 2. Lazy Loading
```typescript
// ✅ CORRECT: Lazy loading with intersection observer
function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);
  
  return isIntersecting;
}

function LazyImage({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const imgRef = useRef<HTMLImageElement>(null);
  const isVisible = useIntersectionObserver(imgRef);
  
  return (
    <img
      ref={imgRef}
      src={isVisible ? src : undefined}
      alt={alt}
      {...props}
    />
  );
}
```

### 🧪 Testing Patterns

#### 1. Component Testing
```typescript
// ✅ CORRECT: Testing React components
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter', () => {
  it('increments count when button is clicked', () => {
    render(<Counter />);
    
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Increment'));
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
  
  it('handles async operations', async () => {
    render(<AsyncComponent />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Data loaded')).toBeInTheDocument();
    });
  });
});
```

#### 2. Hook Testing
```typescript
// ✅ CORRECT: Testing custom hooks
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

---

## 🤖 AI Development Guidelines

### Essential React Pattern Rules for AI Code Generation

1. **Use appropriate patterns**: Choose the right pattern for the problem
2. **Follow naming conventions**: Custom hooks start with 'use', components are PascalCase
3. **Implement proper TypeScript**: Type all props, state, and function parameters
4. **Handle edge cases**: Always consider loading, error, and empty states
5. **Optimize performance**: Use memoization and lazy loading when appropriate
6. **Test thoroughly**: Include unit tests for components and hooks
7. **Follow Manager conventions**: Use MRC components and ODS design system
8. **Implement proper error handling**: Use error boundaries and proper error states
9. **Use proper state management**: Choose between useState, useReducer, or context
10. **Follow accessibility guidelines**: Ensure components are accessible

### React Pattern Selection Guide

- **Simple state**: Use `useState`
- **Complex state**: Use `useReducer`
- **Shared state**: Use Context API
- **Data fetching**: Use custom hooks with proper cleanup
- **Form handling**: Use custom hooks or libraries
- **Performance**: Use `React.memo`, `useMemo`, `useCallback`
- **Large lists**: Use virtual scrolling
- **Lazy loading**: Use intersection observer
- **Authentication**: Use HOCs or context
- **Theming**: Use context providers

### Common Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Prop drilling
function App() {
  const [user, setUser] = useState(null);
  return <Header user={user} />;
}

function Header({ user }) {
  return <Navigation user={user} />;
}

function Navigation({ user }) {
  return <UserMenu user={user} />;
}

// ❌ WRONG: Mutating state directly
function Component() {
  const [items, setItems] = useState([]);
  
  const addItem = (item) => {
    items.push(item); // ❌ Mutating state
    setItems(items);
  };
}

// ❌ WRONG: Missing dependency arrays
useEffect(() => {
  fetchData(userId);
}, []); // ❌ Missing userId dependency
```

### Recommended Patterns

```typescript
// ✅ CORRECT: Context for shared state
const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header />
    </UserContext.Provider>
  );
}

// ✅ CORRECT: Immutable state updates
function Component() {
  const [items, setItems] = useState([]);
  
  const addItem = (item) => {
    setItems(prev => [...prev, item]); // ✅ Immutable update
  };
}

// ✅ CORRECT: Complete dependency arrays
useEffect(() => {
  fetchData(userId);
}, [userId]); // ✅ Include all dependencies
```

---

## ⚖️ The React Pattern's Moral

- **Choose the right pattern** for the problem at hand
- **Consistency is key** - use the same patterns across your application
- **Performance matters** - but measure before optimizing
- **Testing is essential** - patterns should be testable

**👉 Good React patterns make your code more maintainable, reusable, and performant.**

React patterns provide proven solutions to common problems. By following these patterns, you'll write code that's easier to understand, test, and maintain in the long run.
