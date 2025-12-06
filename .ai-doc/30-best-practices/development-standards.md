---
title: Development Standards and Best Practices
last_update: 2025-01-27
tags: [standards, coding, typescript, testing, build, ovhcloud, manager]
ai: true
---

# Development Standards and Best Practices

## 🧭 Purpose

This document defines the **coding standards, principles, and best practices** for the OVHcloud Manager ecosystem. It provides guidelines for consistent code quality, maintainability, and collaboration across all development teams.

## ⚙️ Context

These standards apply to:
- **TypeScript/JavaScript** development in the Manager ecosystem
- **Frontend applications** and µApps
- **Shared libraries** and components
- **Testing strategies** and quality assurance
- **Build and deployment** processes

## 🔗 References

- [Frontend React Patterns](./frontend-react-patterns.md)
- [Manager API Overview](../10-architecture/api-overview.md)
- [MUK Components](../20-dependencies/muk.md)
- [TypeScript Cheat Sheet](./typescript-cheatsheet.md)
- [TypeDoc Documentation](https://typedoc.org/guides/doccomments/)

## 📘 µApplication Folder Structure

Standard structure for every µ-application:

```
µ-application-name/
├── public/
│   └── translations/
│       └── namespace-name/
│           ├── Messages_de_DE.json
│           ├── Messages_en_GB.json
│           ├── Messages_es_ES.json
│           ├── Messages_fr_CA.json
│           ├── Messages_fr_FR.json
│           ├── Messages_it_IT.json
│           ├── Messages_pl_PL.json
│           └── Messages_pt_PT.json
├── src/
│   ├── components/          # Reusable components (app-specific)
│   │   └── componentName/
│   │       ├── ComponentName.component.tsx
│   │       ├── componentName.constants.ts
│   │       └── ComponentName.spec.tsx
│   ├── data/                # Backend interaction
│   │   ├── api/             # HTTP calls (axios)
│   │   │   └── apiGroup.ts
│   │   └── hooks/           # Custom hooks (TanStack Query)
│   │       └── apiGroup/
│   │           ├── useApiGroup.tsx
│   │           └── useApiGroup.spec.tsx
│   ├── hooks/               # Custom hooks (app-specific)
│   │   └── hookName/
│   │       ├── useHookName.tsx
│   │       └── useHookName.spec.tsx
│   ├── types/               # TypeScript types/interfaces/enums
│   │   ├── interface-name.interface.ts
│   │   └── type-name.type.ts
│   ├── pages/               # Route pages
│   │   └── pageName/
│   │       ├── children/
│   │       ├── PageName.page.tsx
│   │       └── pageName.constants.ts
│   ├── routes/              # Route configuration
│   │   ├── routes.tsx
│   │   └── routes.constants.ts
│   ├── App.tsx              # App providers (QueryClient, Router)
│   ├── i18n.ts              # i18n initialization
│   ├── index.scss           # Tailwind imports
│   ├── main.tsx             # ShellContext initialization
│   └── queryClient.ts       # React Query client config
├── .eslintrc.cjs
├── .gitignore
└── index.html
```

**Folder Guidelines:**
- **Components**: Reusable within the µ-app only (shared → manager-components)
- **Data**: Backend interaction (api = HTTP calls, hooks = TanStack Query)
- **Hooks**: App-specific custom hooks
- **Types**: TypeScript definitions
- **Pages**: One folder per route (onboarding, listing, dashboard with tabs)

**Typical Pages:**
- **onboarding**: Product information for new users
- **listing**: List resources, order, delete, modify
- **dashboard**: Resource details with tabs and actions

## 📝 Coding Style

### TypeScript Best Practices

For comprehensive TypeScript guidelines, see [TypeScript Cheat Sheet](./typescript-cheatsheet.md).

**Key principles:**
- Always type variables explicitly
- Avoid `any` type - use specific types or `unknown`
- Use strict type checking
- Follow defensive programming patterns

### Static Code Analysis

```bash
# Run static analysis
yarn run lint

# Fix auto-fixable issues
yarn run lint:fix

# Type checking
yarn run type-check
```

## 📖 Documentation Standards

### JSDoc Format

```typescript
/**
 * Authenticates a user with email and password
 * @param email The user's email address
 * @param password The user's password
 * @returns Promise resolving to authentication result
 * @throws AuthenticationError when credentials are invalid
 * @deprecated Use authenticateWithToken instead
 */
public async authenticateUser(email: string, password: string): Promise<AuthResult> {
  // Implementation
}
```

**Documentation Standards:**
- First line: Method description
- `@param`: Parameter descriptions in declaration order
- `@returns`: Return value description
- `@throws`: Exception descriptions
- Optional: `@deprecated`, `@beta`, `@since`

### TypeDoc Generation

```bash
# Install TypeDoc globally
npm i -g typedoc

# Generate documentation
typedoc --mode file --out docs --target ES6 ./src
```

## ⚠️ Error Management

### Promise Error Handling

```typescript
// ✅ CORRECT: Proper promise error handling
const handlePromise = processData(input)
  .then((result: string) => result)
  .catch((error: Error) => {
    addError('Failed to process data'); // Use notifications
    return Promise.reject(error);
  });
```

### Try-Catch Patterns

```typescript
// ✅ CORRECT: Safe JSON parsing
let parsedData: any;
try {
  parsedData = JSON.parse(jsonString);
} catch (error) {
  addError('Failed to parse JSON data');
  parsedData = {}; // Default fallback
}
```

### Notifications (MUK)

**Important:** `useNotifications` and `useLogger` serve different purposes:
- **`useNotifications`**: Display messages to end-users in the UI (success, error, warning, info)
- **`useLogger`**: Technical logging for system logs and debugging (not visible to end-users)

**❌ WRONG: Using console.log/console.error for user-facing messages**
```typescript
try {
  await apiCall();
} catch (error) {
  console.error('API call failed:', error); // ❌ User won't see this
}
```

**✅ CORRECT: Using useNotifications for user-facing messages + useLogger for technical logging**
```typescript
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useLogger } from '@ovh-ux/manager-react-core-application';

function MyComponent() {
  const { addSuccess, addError } = useNotifications();
  const logger = useLogger();
  
  const handleApiCall = async () => {
    try {
      await apiCall();
      addSuccess('Operation completed successfully'); // ✅ User sees this
    } catch (error) {
      // Log technical error for system logs/debugging
      if (logger) {
        logger.error('API call failed:', error); // ✅ Technical logging
      }
      
      // Display user-friendly error message
      addError('Operation failed. Please try again.'); // ✅ User sees this
    }
  };
}
```

**Pattern in pci-project:**
```typescript
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useLogger } from '@ovh-ux/manager-react-core-application';

// In mutation hooks (useMutation from TanStack Query)
function MyComponent() {
  const { addSuccess, addError } = useNotifications();
  const logger = useLogger();
  
  const { mutate } = useMutation({
    mutationFn: apiCall,
    onSuccess: () => {
      addSuccess('Operation completed successfully');
    },
    onError: (error) => {
      // Technical logging (for system logs/debugging)
      if (logger) {
        logger.error('API call failed:', error);
      }
      
      // User-facing notification
      addError('Operation failed. Please try again.');
    },
  });
}
```

**Logger API:**
- `logger.info(message: string, ...args): void` - Info level logging
- `logger.warn(message: string, ...args): void` - Warning level logging
- `logger.error(message: string, ...args): void` - Error level logging
- `logger.debug(message: string, ...args): void` - Debug level logging

**Notification Types:**
- `addSuccess(message)` - Success notifications (user-facing)
- `addError(message)` - Error notifications (user-facing)
- `addWarning(message)` - Warning notifications (user-facing)
- `addInfo(message)` - Information notifications (user-facing)

## 🧪 Unit Testing

### Test Framework (Vitest)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__setup__/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  }
});
```

### Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('UserService', () => {
  let userService: UserService;
  let mockApi: Mocked<ApiClient>;

  beforeEach(() => {
    mockApi = createMockApiClient();
    userService = new UserService(mockApi);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should authenticate user with valid credentials', async () => {
    // Arrange
    const credentials = { email: 'test@example.com', password: 'password' };
    mockApi.post.mockResolvedValue({ token: 'jwt-token', user: {...} });

    // Act
    const result = await userService.authenticateUser(credentials.email, credentials.password);

    // Assert
    expect(result).toEqual(expectedResult);
  });
});
```

### Coverage Requirements

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

```bash
# Run tests with coverage
npm run test:coverage
```

## 📦 Dependency Management

### Package Management

```json
{
  "engines": {
    "node": ">=22.0.0",
    "yarn": ">=1.22.0"
  },
  "dependencies": {
    "react": "^18.2.0"
  }
}
```

```bash
# Check dependencies
yarn audit
yarn outdated

# Update dependencies
npm update
npm audit fix
```

## 🏗️ Build Management

### Build Configuration

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "build:dev": "tsc && vite build --mode development",
    "build:prod": "tsc && vite build --mode production",
    "type-check": "tsc --noEmit",
    "clean": "rimraf dist"
  }
}
```

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns']
        }
      }
    }
  }
});
```

## 📌 Versioning

### Semantic Versioning

```json
{
  "version": "1.2.3",
  "versioning": {
    "major": "Breaking changes",
    "minor": "New features (backward compatible)",
    "patch": "Bug fixes (backward compatible)"
  }
}
```

```bash
# Version bump
npm version patch  # 1.2.3 -> 1.2.4
npm version minor  # 1.2.3 -> 1.3.0
npm version major  # 1.2.3 -> 2.0.0
```

## 🤖 AI Development Guidelines

### Essential Standards

1. **Always use explicit typing**: Avoid `any`, use specific interfaces
2. **Follow folder structure**: Use standard µ-app structure
3. **Document public APIs**: Use JSDoc format with TypeDoc
4. **Handle errors properly**: Use try-catch, proper promise error handling
5. **Write comprehensive tests**: Achieve 80% coverage minimum
6. **Use semantic versioning**: Follow semver for all releases
7. **Use notifications**: Never use console.log/console.error (use useNotifications from MUK)
8. **Optimize builds**: Use proper bundling and chunking strategies
9. **Maintain dependencies**: Keep packages updated and secure

### Code Quality Checklist

- [ ] All variables are explicitly typed
- [ ] Linting passes without errors
- [ ] All public methods have JSDoc documentation
- [ ] Error handling implemented for all async operations
- [ ] **Notifications used instead of console.log/console.error**
- [ ] Unit tests cover all public methods
- [ ] Code coverage meets 80% threshold
- [ ] Dependencies are up to date and secure
- [ ] Build process is optimized
- [ ] Folder structure follows standards

---

## ⚖️ The Standards' Moral

- **Consistent structure** ensures maintainability and readability
- **Proper typing** prevents bugs and improves developer experience
- **Comprehensive testing** ensures code quality and prevents regressions
- **Error handling** prevents silent failures and improves user experience

**👉 Good standards are invisible to users but essential for code quality.**
