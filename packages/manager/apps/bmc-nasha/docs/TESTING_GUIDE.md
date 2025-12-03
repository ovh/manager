# Testing Guide: bmc-nasha

**Application:** bmc-nasha (NAS-HA React)  
**Testing Framework:** Vitest + React Testing Library  
**Coverage Target:** > 80%

---

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test Structure](#test-structure)
3. [Running Tests](#running-tests)
4. [Writing Tests](#writing-tests)
5. [Testing Patterns](#testing-patterns)
6. [Mock Strategies](#mock-strategies)
7. [Coverage Guidelines](#coverage-guidelines)

---

## Testing Philosophy

### Principles

1. **Test Behavior, Not Implementation**
   - Focus on what the component does, not how it does it
   - Test from the user's perspective
   - Avoid testing internal state or methods

2. **Write Tests That Give Confidence**
   - Tests should catch real bugs
   - Avoid false positives
   - Prefer integration tests over unit tests when appropriate

3. **Keep Tests Maintainable**
   - Clear test names that describe the scenario
   - DRY principle (Don't Repeat Yourself)
   - Use helper functions and custom render methods

4. **Follow Testing Library Guidelines**
   - Query by role, label, or text (in that order)
   - Avoid `querySelector` and class selectors
   - Use semantic queries

---

## Test Structure

### File Organization

```
src/
├── components/
│   └── ComponentName/
│       ├── ComponentName.tsx
│       └── ComponentName.spec.tsx        # Component tests
├── hooks/
│   └── useHookName/
│       ├── useHookName.ts
│       └── useHookName.spec.ts           # Hook tests
└── pages/
    └── PageName/
        ├── PageName.page.tsx
        └── PageName.page.spec.tsx        # Page tests
```

### Test File Naming

- Unit tests: `*.spec.ts` or `*.spec.tsx`
- Integration tests: `*.integration.spec.tsx`
- E2E tests: `*.e2e.spec.tsx`

---

## Running Tests

### Commands

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test:coverage

# Run specific test file
yarn test src/hooks/listing/useListingColumns.spec.tsx

# Run tests matching pattern
yarn test --grep "OrderPage"

# Update snapshots
yarn test --update
```

### CI/CD Integration

Tests run automatically on:
- Pull request creation
- Commit push to main branches
- Pre-commit hooks (optional)

---

## Writing Tests

### Component Tests

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render with default props', () => {
    render(<MyComponent title="Test" />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should call onClick when button is clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<MyComponent onClick={handleClick} />);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useMyHook } from './useMyHook';

// Create wrapper for hooks that need providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useMyHook', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useMyHook(), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });

  it('should fetch data successfully', async () => {
    const { result } = renderHook(() => useMyHook('test-id'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

### Page Tests

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import MyPage from './MyPage.page';

// Create router wrapper
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MyPage', () => {
  it('should render page layout', () => {
    renderWithRouter(<MyPage />);
    
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    renderWithRouter(<MyPage />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

---

## Testing Patterns

### 1. Query Priority

Follow Testing Library's query priority:

```typescript
// ✅ GOOD: Query by role (most accessible)
screen.getByRole('button', { name: /submit/i });

// ✅ GOOD: Query by label text
screen.getByLabelText('Username');

// ✅ GOOD: Query by text content
screen.getByText('Welcome');

// ⚠️ OK: Query by test ID (when semantic queries don't work)
screen.getByTestId('custom-component');

// ❌ BAD: Query by class or CSS selector
screen.querySelector('.my-class');
```

### 2. Async Testing

```typescript
// ✅ GOOD: Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Data loaded')).toBeInTheDocument();
});

// ✅ GOOD: Use findBy queries (built-in async)
const element = await screen.findByText('Data loaded');
expect(element).toBeInTheDocument();

// ❌ BAD: Don't use arbitrary timeouts
await new Promise(resolve => setTimeout(resolve, 1000));
```

### 3. User Interactions

```typescript
import userEvent from '@testing-library/user-event';

// ✅ GOOD: Use userEvent for realistic interactions
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'test text');

// ❌ BAD: Use fireEvent (less realistic)
fireEvent.click(button);
```

### 4. Testing API Calls

```typescript
import { vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Mock API module
vi.mock('@ovh-ux/manager-core-api', () => ({
  fetchIcebergV6: vi.fn(),
}));

describe('useMyApiHook', () => {
  it('should fetch data from API', async () => {
    const { fetchIcebergV6 } = await import('@ovh-ux/manager-core-api');
    
    (fetchIcebergV6 as any).mockResolvedValueOnce({
      data: [{ id: 1, name: 'Test' }],
      totalCount: 1,
    });

    const { result } = renderHook(() => useMyApiHook(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchIcebergV6).toHaveBeenCalledWith({
      route: '/api/endpoint',
      pageSize: 25,
    });
  });
});
```

---

## Mock Strategies

### 1. Mocking Dependencies

```typescript
// Mock external modules
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(() => ({ id: 'test-id' })),
  };
});

// Mock manager shell client
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: () => ({
    trackClick: vi.fn(),
  }),
  ShellContext: { Provider: ({ children }: any) => children },
}));

// Mock translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));
```

### 2. Mocking MUK Components

```typescript
// Mock complex MUK components
vi.mock('@ovh-ux/muk', () => ({
  BaseLayout: ({ children, header }: any) => (
    <div data-testid="base-layout">
      <div data-testid="header">{header.title}</div>
      {children}
    </div>
  ),
  Datagrid: ({ columns, data }: any) => (
    <div data-testid="datagrid">
      {data.map((row: any) => (
        <div key={row.id}>{row.name}</div>
      ))}
    </div>
  ),
}));
```

### 3. Test Utilities

```typescript
// src/utils/Test.utils.tsx
import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

export const renderWithProviders = (ui: ReactElement) => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>,
  );
};
```

---

## Coverage Guidelines

### Minimum Coverage Targets

- **Overall:** > 80%
- **Critical paths:** > 90%
  - API hooks
  - Form validation
  - Business logic
- **UI components:** > 70%
  - Focus on behavior, not implementation

### What to Test

**✅ DO test:**
- User interactions (clicks, typing, navigation)
- Data fetching and mutations
- Error states and edge cases
- Form validation logic
- Conditional rendering
- Accessibility features

**❌ DON'T test:**
- Third-party library internals
- Trivial getters/setters
- Constant values
- Types (TypeScript handles this)

### Coverage Report

```bash
# Generate coverage report
yarn test:coverage

# View HTML report
open coverage/index.html
```

---

## Best Practices

### 1. Test Organization

```typescript
describe('ComponentName', () => {
  // Group related tests
  describe('rendering', () => {
    it('should render with default props', () => {});
    it('should render with custom props', () => {});
  });

  describe('user interactions', () => {
    it('should handle click events', () => {});
    it('should handle form submission', () => {});
  });

  describe('error handling', () => {
    it('should display error message', () => {});
    it('should recover from error', () => {});
  });
});
```

### 2. Clear Test Names

```typescript
// ✅ GOOD: Descriptive test names
it('should display error message when API call fails', () => {});
it('should navigate to dashboard after successful login', () => {});

// ❌ BAD: Vague test names
it('works', () => {});
it('test1', () => {});
```

### 3. Setup and Teardown

```typescript
import { beforeEach, afterEach, vi } from 'vitest';

describe('MyComponent', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup after each test
    vi.restoreAllMocks();
  });

  it('should...', () => {});
});
```

### 4. Avoid Testing Implementation Details

```typescript
// ❌ BAD: Testing internal state
expect(wrapper.state('isOpen')).toBe(true);

// ✅ GOOD: Testing observable behavior
expect(screen.getByRole('dialog')).toBeVisible();
```

---

## Common Pitfalls

### 1. Not Waiting for Async Updates

```typescript
// ❌ BAD
render(<AsyncComponent />);
expect(screen.getByText('Data')).toBeInTheDocument();

// ✅ GOOD
render(<AsyncComponent />);
await screen.findByText('Data');
```

### 2. Not Cleaning Up After Tests

```typescript
// ❌ BAD
const mock = vi.fn();
// mock persists across tests

// ✅ GOOD
beforeEach(() => {
  vi.clearAllMocks();
});
```

### 3. Testing Library Internals

```typescript
// ❌ BAD
expect(wrapper.find('.button')).toHaveLength(1);

// ✅ GOOD
expect(screen.getAllByRole('button')).toHaveLength(1);
```

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated:** 2025-01-21  
**Maintained By:** Development Team


