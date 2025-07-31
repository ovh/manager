# Condensed Testing Guide - PCI Volume Backup (AI Optimized)

Add this guide to your AI tool to let it know the rules for producing good tests.

## Essential Patterns

### 0. ESLint Configuration for Tests
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
// Add at the top of each test file to avoid any warnings
```

### 0.5. Automatic Cleanup (Centralized)
```typescript
// ✅ AUTOMATIC: Cleanup is configured in setupTests.tsx
// No need to add beforeEach() in each test file!

// ⚠️ EXCEPTION: Keep beforeEach() with specific mocks
beforeEach(() => {
  mockNavigationGetURL.mockResolvedValue('https://billing.ovh.com/payment/method');
});
```

### 1. Standard Test Structure
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { createOptimalWrapper } from '@/test-utils/lightweight-wrappers';

vi.mock('@/data/hooks/useHook', () => ({
  useHook: vi.fn(),
}));

describe('ComponentName', () => {
  const setupMocks = ({ loading = false, withData = false } = {}) => {
    vi.mocked(useHook).mockReturnValue({
      data: withData ? MOCKED_DATA : undefined,
      isLoading: loading,
    } as ReturnType<typeof useHook>);
  };

  it('should render correctly', async () => {
    setupMocks(); // Direct call, no need for beforeEach
    
    await act(async () => {
      render(<Component />, { wrapper: createOptimalWrapper() });
    });
    expect(screen.getByTestId('component')).toBeInTheDocument();
  });
});
```

### 2. Correct Usage of `act()` and `async` Optimization

#### Rule: Use `async` and `act()` ONLY when necessary

**❌ Incorrect - excessive async:**
```typescript
it('should render', async () => {
  await act(async () => {
    render(<Component />);
  });
  expect(screen.getByText('text')).toBeInTheDocument();
});
```

**✅ Correct - async only when necessary:**
```typescript
it('should render', () => {
  render(<Component />);
  expect(screen.getByText('text')).toBeInTheDocument();
});
```

#### When to use `async` and `act()`:

**✅ NECESSARY for:**
- **User interactions**: `fireEvent.click()`, `fireEvent.change()`
- **Asynchronous state updates**: When component updates its state after an action
- **Mocked API calls**: When a mock triggers updates
- **waitFor()**: For asynchronous assertions

**❌ UNNECESSARY for:**
- **Simple render()**: Without user interactions
- **Synchronous assertions**: `screen.getByText()`, `screen.getByTestId()`
- **Static rendering tests**: Element presence verification

#### Optimization examples:

**Before (heavy):**
```typescript
it('should handle click', async () => {
  await act(async () => {
    render(<Component />);
  });
  await act(async () => {
    fireEvent.click(button);
  });
  await waitFor(() => {
    expect(screen.getByText('updated')).toBeInTheDocument();
  });
});
```

**After (optimized):**
```typescript
it('should handle click', async () => {
  render(<Component />);
  await act(async () => {
    fireEvent.click(button);
  });
  await waitFor(() => {
    expect(screen.getByText('updated')).toBeInTheDocument();
  });
});
```

#### Variables declared in `act()`:
**❌ Incorrect:**
```typescript
let container: HTMLElement;
await act(async () => {
  const result = render(<Component />);
  container = result.container;
});
expect(container.firstChild).toBeInTheDocument(); // Error: variable used before assignment
```

**✅ Correct:**
```typescript
await act(async () => {
  const { container } = render(<Component />);
  expect(container.firstChild).toBeInTheDocument();
});
```

#### Performance impact:
- **Excessive async**: Adds unnecessary micro-tasks, slows down tests
- **Optimization**: Faster tests, more readable code
- **General rule**: Start without `async`, add only if necessary
  
  await act(async () => {
    const result = render(<Component />);
    handleValidityChange = result.handleValidityChange;
  });

  await waitFor(() => {
    expect(handleValidityChange!).toHaveBeenCalledWith(true);
  });
});

// ❌ INCORRECT: Assertions in act() - mocks are not called
it('should not do this', async () => {
  await act(async () => {
    const result = render(<Component />);
    expect(result.handleValidityChange).toHaveBeenCalledWith(true); // ❌ Doesn't work
  });
});

// ❌ INCORRECT: Variables without non-null assertion
it('should not do this', async () => {
  let container: HTMLElement;
  
  await act(async () => {
    const result = render(<Component />);
    container = result.container;
  });

  expect(container?.firstChild).toBeTruthy(); // ❌ TypeScript error
});
```

### 3. Optimized Wrappers for Performance ⚡
```typescript
// ✅ RECOMMENDED: Use createOptimalWrapper for faster tests
import { createOptimalWrapper } from '@/test-utils/lightweight-wrappers';

// Simple component test (without routing/shell)
it('should render simple component', async () => {
  await act(async () => {
    render(<SimpleComponent />, { 
      wrapper: createOptimalWrapper({ queries: true }) 
    });
  });
  expect(screen.getByTestId('component')).toBeInTheDocument();
});

// Component test with navigation
it('should render component with routing', async () => {
  await act(async () => {
    render(<PageComponent />, { 
      wrapper: createOptimalWrapper({ routing: true }) 
    });
  });
  expect(screen.getByTestId('page')).toBeInTheDocument();
});

// Component test with shell context
it('should render component with shell', async () => {
  await act(async () => {
    render(<ShellComponent />, { 
      wrapper: createOptimalWrapper({ shell: true }) 
    });
  });
  expect(screen.getByTestId('shell-component')).toBeInTheDocument();
});

// Hook test (without routing)
it('should test hook', async () => {
  let result: any;
  await act(async () => {
    const hookResult = renderHook(() => useCustomHook(), {
      wrapper: createOptimalWrapper({ queries: true, shell: true })
    });
    result = hookResult.result;
  });
  expect(result.current.data).toBeDefined();
});
```

**Optimized Wrappers Benefits:**
- **Performance**: 40-70% reduction in test time
- **Memory**: 50-75% reduction in usage
- **Flexibility**: Choose wrapper based on needs
- **Maintainability**: Clearer and more expressive code

### 4. OVH Helpers
```typescript
import { 
  getOdsButtonByLabel,
  getOdsInputByTestId,
  changeInputValue,
  assertModalVisibility,
} from '@ovh-ux/manager-core-test-utils';

const button = getOdsButtonByLabel('Submit');
const input = getOdsInputByTestId('name-input');
changeInputValue(input, 'Test Value');
assertModalVisibility(true);
```

### 5. ODS Mocks
```typescript
vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual = (await importOriginal()) || {};
  return {
    ...actual,
    OdsButton: ({ label, onClick, isDisabled, ...props }) => (
      <button data-testid="ods-button" onClick={onClick} disabled={isDisabled} {...props}>
        {label}
      </button>
    ),
    OdsInput: ({ name, value, onOdsChange, ...props }) => (
      <input
        data-testid="ods-input"
        name={name}
        value={value}
        onChange={(e) => onOdsChange?.({ detail: { value: e.target.value } })}
        {...props}
      />
    ),
    OdsCheckbox: ({ isChecked, onOdsChange, ...props }) => (
      <input
        type="checkbox"
        data-testid="ods-checkbox"
        checked={isChecked}
        onChange={(e) => onOdsChange?.({ detail: { checked: e.target.checked } })}
        {...props}
      />
    ),
  };
});
```

### 6. Hook Test with Callbacks
```typescript
it('should handle success callback', async () => {
  let successCallback: (() => void) | undefined;

  vi.mocked(useMutation).mockImplementation(({ onSuccess }) => {
    successCallback = onSuccess;
    return { mutate: vi.fn(), isPending: false };
  });

  render(<Component />);
  fireEvent.click(getOdsButtonByLabel('Submit'));

  if (successCallback) successCallback();
  
  expect(addSuccessMessage).toHaveBeenCalled();
  expect(mockNavigate).toHaveBeenCalledWith('..');
});
```

### 7. Loading State Test
```typescript
it('should show loading state', () => {
  setupMocks({ loading: true });
  render(<Component />);
  
  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  expect(screen.queryByTestId('content')).not.toBeInTheDocument();
});
```

### 8. Form Test
```typescript
it('should submit form correctly', async () => {
  const user = userEvent.setup();
  
  await act(async () => {
    render(<Component />);
  });
  
  await act(async () => {
    await user.type(getOdsInputByTestId('name-input'), 'Test Name');
    await user.type(getOdsInputByTestId('email-input'), 'test@example.com');
  });
  
  await act(async () => {
    await user.click(getOdsButtonByLabel('Submit'));
  });
  
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Test Name',
      email: 'test@example.com',
    });
  });
});
```

### 9. Advanced Mocking Techniques

#### **API v6 Mocking with Destructuring**
```typescript
vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

const mockedV6Get = vi.mocked(v6.get);
const mockedV6Delete = vi.mocked(v6.delete);
const mockedV6Post = vi.mocked(v6.post);
const mockedV6Put = vi.mocked(v6.put);
```

#### **Window and Browser APIs Mocking**
```typescript
// Mocking window.top for navigation tests
Object.defineProperty(window, 'top', {
  value: { location: '' },
  writable: true,
});

// Mocking window.open
Object.defineProperty(window, 'open', {
  value: vi.fn(),
  writable: true,
});

// Mocking window.innerWidth for responsive tests
Object.defineProperty(window, 'innerWidth', {
  value: 1024,
  writable: true,
});
```

#### **Module Mocking with Original Import**
```typescript
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});
```

### 10. Advanced Test Helpers

#### **Setup with Flexible Overrides**
```typescript
const setupDefaultMocks = ({
  resourcesV6Overrides = {},
  trustedZoneOverrides = {},
  redirectOverrides = {},
} = {}) => {
  vi.clearAllMocks();

  vi.mocked(useResourcesV6).mockReturnValue(
    createMockUseResourcesV6(resourcesV6Overrides),
  );

  vi.mocked(useTrustedZoneBanner).mockReturnValue({
    isBannerVisible: false,
    isLoading: false,
    ...trustedZoneOverrides,
  });
};
```

#### **Render Helper with Custom Wrapper**
```typescript
const renderHookWithWrapper = () => {
  const Wrapper = createOptimalWrapper({ queries: true, shell: true });
  return renderHook(() => useCustomHook(), {
    wrapper: Wrapper,
  });
};

// Usage
it('should work correctly', () => {
  const { result } = renderHookWithWrapper();
  expect(result.current.data).toBeDefined();
});
```

### 11. Advanced QueryClient Management
```typescript
// ✅ AUTOMATIC: Cleanup is centralized in setupTests.tsx
// No need to add beforeEach() in each test file!

// ⚠️ ATTENTION: If you have specific mocks, keep them in beforeEach
// Example: beforeEach(() => { mockNavigationGetURL.mockResolvedValue('url'); });

// Reset specific queries (if necessary)
queryClient.resetQueries({ queryKey: ['specific-key'] });
```

### 12. Query Keys Tests
```typescript
describe('getCartSummaryQueryKey', () => {
  it('should return correct query key for cartId', () => {
    expect(getCartSummaryQueryKey('cart-1')).toEqual([
      '/order/cart/cart-1/summary',
    ]);
  });
});

describe('getContractAgreementsQueryKey', () => {
  it('should handle null cartId', () => {
    expect(getContractAgreementsQueryKey(null)).toEqual([
      'new-cart',
      null,
      'contract-agreements',
    ]);
  });
});
```

### 13. Simple Utilities Tests
```typescript
describe('camelToSnakeCase', () => {
  it('should convert simple camelCase to snake_case', () => {
    expect(camelToSnakeCase('firstName')).toBe('first_name');
    expect(camelToSnakeCase('lastName')).toBe('last_name');
  });

  it('should handle edge cases with special characters', () => {
    expect(camelToSnakeCase('myVariable-name')).toBe('my_variable-name');
  });

  it('should be consistent with documented examples', () => {
    expect(camelToSnakeCase('myVariableName')).toBe('my_variable_name');
  });
});
```

### 14. Component Mocking with Specific Props
```typescript
// Mocking components with typed props
vi.mock('./Status.component', () => ({
  default: ({ project }: { project: TProjectWithService }) => (
    <div data-testid="status-component">{project.aggregatedStatus}</div>
  ),
}));

// Mocking components with __esModule
vi.mock('@/components/ManagerBannerText', () => ({
  __esModule: true,
  default: () => <div data-testid="manager-banner-text" />,
}));
```

### 15. Advanced Assertions with Helpers
```typescript
import {
  assertElementExists,
  assertElementNotExists,
  assertDatagridRendered,
  assertDatagridLoading,
  assertLoadingState,
  assertNotLoadingState,
  assertNoErrorState,
} from '@/test-utils';

// Usage
it('should render correctly', () => {
  render(<Component />);
  assertElementExists('component-container');
  assertDatagridRendered();
  assertNoErrorState();
});
```

### 16. External Libraries Tests - Important Rules

#### **❌ DO NOT Test External Libraries Behavior**
```typescript
// ❌ INCORRECT: Testing ODS behavior
it('should render OdsButton correctly', () => {
  render(<OdsButton label="Test" />);
  expect(screen.getByRole('button')).toHaveTextContent('Test');
});

// ❌ INCORRECT: Testing MRC behavior
it('should use useResourcesV6 correctly', () => {
  const { result } = renderHook(() => useResourcesV6());
  expect(result.current.isLoading).toBeDefined();
});

// ❌ INCORRECT: Testing pci-common behavior
it('should use useTrustedZoneBanner correctly', () => {
  const { result } = renderHook(() => useTrustedZoneBanner());
  expect(result.current.isBannerVisible).toBeDefined();
});
```

#### **✅ CORRECT: Test Integration and Usage**
```typescript
// ✅ CORRECT: Testing ODS integration
it('should pass correct props to OdsButton', () => {
  render(<MyComponent />);
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('data-testid', 'submit-button');
  expect(button).toHaveTextContent('Submit');
});

// ✅ CORRECT: Testing MRC usage
it('should handle loading state from useResourcesV6', () => {
  vi.mocked(useResourcesV6).mockReturnValue({
    isLoading: true,
    data: undefined,
  });
  render(<MyComponent />);
  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
});

// ✅ CORRECT: Testing pci-common usage
it('should show banner when useTrustedZoneBanner returns true', () => {
  vi.mocked(useTrustedZoneBanner).mockReturnValue({
    isBannerVisible: true,
    isLoading: false,
  });
  render(<MyComponent />);
  expect(screen.getByTestId('trusted-zone-banner')).toBeInTheDocument();
});
```

**Golden Rules:**
- **Do not test** internal behavior of ODS, MRC, pci-common components
- **Test** integration, passed props, and usage in your code
- **Mock** external libraries to control their behavior
- **Focus** on your application's business logic

## Configuration

### Optimized React Wrapper
```typescript
// ✅ RECOMMENDED: Use lightweight-wrappers.tsx
import { createOptimalWrapper } from '@/test-utils/lightweight-wrappers';

// Instead of heavy createWrapper(), use:
const wrapper = createOptimalWrapper({ 
  routing: true,    // If navigation needed
  shell: true,      // If shell context needed
  queries: true     // If QueryClient needed
});
```

### Test Setup
```typescript
import '@testing-library/jest-dom';

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useParams: () => ({ projectId: 'project-id' }),
    useNavigate: vi.fn(),
  };
});
```

## Test Data
```typescript
export const MOCKED_PROJECT_ID = 'project-123';
export const MOCKED_VOLUME_ID = 'volume-id';

export const MOCKED_VOLUME = {
  id: MOCKED_VOLUME_ID,
  name: 'volume-name',
  size: 10,
  status: 'available',
  region: 'EU',
  creationDate: '2024-01-01T00:00:00Z',
};

export const MOCKED_BACKUP = {
  id: 'backup-id',
  name: 'backup-name',
  size: 100,
  volumeId: MOCKED_VOLUME_ID,
  status: 'ok',
  region: 'EU',
  creationDate: '2024-01-01T00:00:00Z',
};
```

## Patterns by Type

### Page Component
```typescript
describe('PageComponent', () => {
  it('should render with data', async () => {
    setupMocks({ withData: true });
    
    await act(async () => {
      render(<PageComponent />, { 
        wrapper: createOptimalWrapper({ routing: true, shell: true }) 
      });
    });
    
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('should redirect when no data', async () => {
    setupMocks({ withData: false });
    
    await act(async () => {
      render(<PageComponent />, { 
        wrapper: createOptimalWrapper({ routing: true }) 
      });
    });
    
    expect(screen.getByTestId('redirected')).toBeInTheDocument();
  });
});
```

### Hook Component
```typescript
describe('useCustomHook', () => {
  it('should return correct data', async () => {
    let result: any;
    
    await act(async () => {
      const hookResult = renderHook(() => useCustomHook(), {
        wrapper: createOptimalWrapper({ queries: true, shell: true }),
      });
      result = hookResult.result;
    });
    
    expect(result.current.data).toBeDefined();
  });
});
```

### Form Component
```typescript
describe('FormComponent', () => {
  it('should validate and submit', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<FormComponent />, { 
        wrapper: createOptimalWrapper({ queries: true }) 
      });
    });
    
    await act(async () => {
      await user.type(getOdsInputByTestId('name'), 'Test');
      await user.click(getOdsButtonByLabel('Submit'));
    });
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});
```

## OVH Helpers

```bash
npm install @ovh-ux/manager-core-test-utils @ovh-ux/manager-tests-setup
```

- `getOdsButtonByLabel(label)`
- `getOdsInputByTestId(testId)`
- `changeInputValue(input, value)`
- `assertModalVisibility(visible)`
- `getOdsSpinnerByTestId(testId)`
- `getOdsSkeletonByTestId(testId)`

## Checklist

- [ ] **Add `/* eslint-disable @typescript-eslint/no-explicit-any */` at the top of the file**
- [ ] **Use `createOptimalWrapper()` instead of `createWrapper()`**
- [ ] **Choose minimal wrapper based on needs (queries/routing/shell)**
- [ ] **Do not test external libraries behavior (ODS, MRC, pci-common)**
- [ ] Import `createOptimalWrapper` from `@/test-utils/lightweight-wrappers`
- [ ] Mock hooks with `vi.mock`
- [ ] Create `setupMocks` function for states
- [ ] Use ODS helpers for interactions
- [ ] **Use `act()` around operations that cause state updates**
- [ ] **Separate assertions from `act()` wrappers**
- [ ] **For variables declared in `act()`, use non-null assertion (`!`) or `waitFor()`**

- [ ] Test loading/success/error states
- [ ] Use `waitFor` for async
- [ ] Test success/error callbacks
- [ ] Verify notifications and navigation
- [ ] Use test data from mocks.ts file
- [ ] **QueryClient cleanup is automatic (setupTests.tsx)**
- [ ] Use reusable assertion helpers

## Resources

- [OVH Design System](https://github.com/ovh/design-system)
- [ODS Storybook](https://ovh.github.io/design-system/latest/)
- [Manager React Components](https://github.com/ovh/manager/tree/master/packages/manager-react-components)
- [Manager PCI Common](https://github.com/ovh/manager/tree/master/packages/manager/modules/manager-pci-common)
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest](https://vitest.dev/)

## AI Tips

1. **Always add `/* eslint-disable @typescript-eslint/no-explicit-any */` at the top of test files**
2. **Always use `createOptimalWrapper()` for faster tests**
3. **Choose minimal wrapper: `{ queries: true }` for hooks, `{ routing: true }` for pages**
4. **Never test external libraries behavior (ODS, MRC, pci-common)**
5. Prefer ODS helpers over manual selectors
6. Test the 3 states: loading, success, error
7. Use `waitFor()` for async operations
8. Mock hooks at the beginning of the file
9. Test success and error callbacks
10. Verify notifications and navigation
11. Use centralized test data
12. **Always wrap operations that cause state updates in `act()`**
13. **Never put assertions in `act()` wrappers**
14. **Import `act` from `@testing-library/react`**
15. **Prefer `lightweight-wrappers.tsx` for 40-70% performance gain**
16. **QueryClient cleanup is automatic (setupTests.tsx)**
17. **Use reusable assertion helpers for consistency**
18. **For variables declared in `act()`, use non-null assertion (`!`) or `waitFor()`** 
