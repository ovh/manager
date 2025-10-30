---
title: Development Standards and Best Practices
last_update: 2025-01-27
tags: [standards, coding, typescript, testing, build, ovhcloud, manager]
ai: true
---

# Development Standards and Best Practices

## 🧭 Purpose

This document defines the **coding standards, principles, and best practices** for the OVHcloud Manager ecosystem. It provides guidelines for consistent code quality, maintainability, and collaboration across all development teams.

These standards ensure code consistency, improve readability, and facilitate maintenance while following industry-accepted practices and avoiding reinvention of existing solutions.

## ⚙️ Context

These standards apply to:
- **TypeScript/JavaScript** development in the Manager ecosystem
- **Frontend applications** and µApps
- **Shared libraries** and components
- **Testing strategies** and quality assurance
- **Build and deployment** processes

The standards are designed to be flexible enough to adapt to different language paradigms while maintaining consistency across the ecosystem.

## 🔗 References

- [Frontend React Patterns](../30-best-practices/frontend-react-patterns.md)
- [Manager API Overview](../10-architecture/api-overview.md)
- [MUK Components](../20-dependencies/muk.md)
- [TypeDoc Documentation](https://typedoc.org/guides/doccomments/)
- [TSLint Configuration](STASH_OVH/NETAUTO/repos/coding-style/browse)

## 📘 Guidelines / Implementation

### µApplication Folder Structure

Since we expect to create a number of µ-applications, it is important to structure the applications in a similar manner to have better readability and maintainability.

Here's the standard structure that every µ-application must follow:

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
│   ├── components/
│   │   └── componentName/
│   │       ├── ComponentName.component.tsx
│   │       ├── componentName.constants.ts
│   │       └── ComponentName.spec.tsx
│   ├── data/
│   │   ├── api/
│   │   │   └── apiGroup.ts
│   │   └── hooks/
│   │       └── apiGroup/
│   │           ├── useApiGroup.tsx
│   │           └── useApiGroup.spec.tsx
│   ├── hooks/
│   │   └── hookName/
│   │       ├── useHookName.tsx
│   │       └── useHookName.spec.tsx
│   ├── types/
│   │   ├── interface-name.interface.ts
│   │   └── type-name.type.ts
│   ├── pages/
│   │   └── pageName/
│   │       ├── children/
│   │       │   ├── Children.page.tsx
│   │       │   └── children.constants.ts
│   │       ├── PageName.page.tsx
│   │       └── pageName.constants.ts
│   ├── routes/
│   │   ├── routes.tsx
│   │   └── routes.constants.ts
│   ├── App.tsx
│   ├── i18n.ts
│   ├── index.scss
│   ├── main.tsx
│   └── queryClient.ts
├── .eslintrc.cjs
├── .gitignore
└── index.html
```

#### Folder Structure Guidelines

**Components**
React components which are used in more than one page, can be added in the components folder. Be sure to add the components that are reusable only in the context of the particular µ-application where it is defined. If the component can be shared among more than one application, consider defining the component in other reusable folders like manager-components.

> **Info**: Each component must be defined inside a sub-folder with name of the sub-folder being the name of the component. This leads to group the related files like spec, constants and component definition files in single place.

**Data**
All the code related to backend interaction must go in the data folders. Furthermore, the code to interact with backend are divided into 2 sub-groups:

- **api folder** contains the definition of functions to make the HTTP calls using the axios library.
- **hooks folder** contains the creation of custom hooks using the capabilities of data-fetching library tanstack-query. The custom hooks utilise the functions defined in the api folder and serves data to the components.

For detailed implementation on backend interaction, check out [Data Fetching Patterns](../10-architecture/data-fetching.md).

**Hooks**
This folder is dedicated to defining the custom hooks that are reusable in the context of the application where it is defined. Similar to components, if the custom hook can be reused in more than 1 application, consider defining the hooks in other reusable folders like manager-components.

> **Info**: Each hook must be defined inside a sub-folder with name of the sub-folder being the name of the hook. This ensures to group the related files like spec, constants and hook definition files in single place.

**Types**
Utilise this folder to define the required interfaces/types/enums.

**Pages**
Each folder inside the pages folder represents the route on the application. Every folder contains the definition of component associated (with extension being .page.tsx) to the route and the sub-folders indicating all the children of the associated routes. Also, each tab and modal must be associated to a separate route and defined as a page.

A typical µ-application contains the following pages:

- **Onboarding page** to provide some useful information about the product if user does not already have any resource of the product on OVHcloud.
- **Listing page** to list the resources user has on OVHcloud. User will have the ability to order new resources, delete or modify the existing resources and other product specific actions.
- **Details section** for each resource which can contain:
  - **Dashboard** to display the important details related to the product. User has the ability to perform actions related to the product like updating the display name, deleting the resource and so on.
  - **Multiple tabs** specific to the product and user will have the ability to perform product specific operations on each tab. Each tab can also serve as listing page of multiple resources and subsequently have detailed page for each item on the listing page.

> **Info**: As you may have noticed, deleting a resource is possible from listing page as well as the resource dashboard. Such common component definition can be done in components folder and define 2 pages as a children of listing and dashboard page.

**Example pages folder structure:**
```
pages/
├── onboarding/
├── listing/
│   ├── add/
│   ├── delete/
│   └── update/
└── dashboard/
    ├── general-information/
    │   ├── delete/
    │   └── update/
    └── items/
        ├── item/
        │   └── dashboard/
        │       └── general-information/
        │           ├── deleteItem/
        │           └── updateItem/
        ├── addItem/
        ├── deleteItem/
        └── updateItem/
```

**Routes**
Typically contains the routes.tsx and routes.constants.ts file to define all the routes of the application.

> **Info**: Each different view must be associated to a route. Generally, every page or tab has it's own route and all the actions which user can perform like add/edit/delete will be the child routes. Every modal must also be associated with a route.

**Example routes configuration:**
```typescript
export const ROUTE_PATHS = {
  root: '/µ-application-name',
  onboarding: '/onboarding',
  listing: '/µ-application-name',
  listingAdd: '/add',
  listingDelete: '/delete/:resource-id',
  listingUpdate: '/update/:resource-id',
  dashboard: '/:resource-id',
  dashboardDelete: '/delete',
  dashboardUpdate: '/update',
  items: '/items',
  itemsAdd: '/add',
  itemsDelete: '/delete',
  itemsUpdate: '/update',
  item: '/:item-id',
  itemDelete: '/delete',
  itemUpdate: '/update',
};

import { Route } from 'react-router-dom';
import { ROUTE_PATHS } from '@/src/routes/routes.constants';

export (
  <Route
    path={ROUTE_PATHS.root}
    Component={LayoutComponent}
    errorElement={
      <ErrorBoundary redirectionApp="vrack-services" />
    }
  >
    <Route path={ROUTE_PATHS.listing}>
      <Route path={ROUTE_PATHS.listingAdd}>
      <Route path={ROUTE_PATHS.listingDelete}>
      <Route path={ROUTE_PATHS.listingUpdate}>
    </Route>
    <Route path={ROUTE_PATHS.dashboard}>
      <Route path={ROUTE_PATHS.dashboard}>
        <Route path={ ROUTE_PATHS.item} />
        <Route path={ROUTE_PATHS.dashboardUpdate} />
      </Route>
      <Route path={ROUTE_PATHS.items}>
        <Route path={ROUTE_PATHS.item}>
          <Route path={ROUTE_PATHS.itemDelete} />
          <Route path={ROUTE_PATHS.itemUpdate} />
        </Route>
        <Route path={ROUTE_PATHS.itemsAdd} />
        <Route path={ROUTE_PATHS.itemsDelete} />
        <Route path={ROUTE_PATHS.itemsUpdate} />
      </Route>
    </Route>
    <Route path={ROUTE_PATHS.onboarding} />
  </Route>
)
```

**App.tsx**
App component is used to create and register the application level providers like QueryClientProvider, RouterProvider. Also, set-up the MUK at this component.

**i18n.ts**
To initialise the i18n for localising the application.

**index.scss**
Generally used to import the tailwind utilities and components.

**main.tsx**
The root component which will be loaded in the index.html. This component is used to:
- initialise the ShellContext for the µ-app.
- define the callback function to be called on locale change which happens in the container µ-app.

**queryClient.ts**
Define and export the React Query Client and also take the opportunity to override the defaults at the application level.

### Coding Style

#### TypeScript Best Practices

For comprehensive TypeScript guidelines, patterns, and best practices, refer to the [TypeScript Cheat Sheet](./typescript-cheatsheet.md).

**Key principles**:
- Always type variables explicitly
- Avoid `any` type - use specific types or interfaces
- Use strict type checking configuration
- Follow defensive programming patterns

**Installation and Usage**:
```bash
npm i --save-dev tslint tslint-config-standard
./node_modules/tslint/bin/tslint --config tslint.json 'src/**/*.ts'
```

#### Static Code Analysis

```bash
# Run static analysis
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Type checking
npm run type-check
```

### Coding Principles

#### Code Comments

##### Classes Documentation
```typescript
/**
 * User management service for handling user operations
 * Provides methods for user creation, updates, and authentication
 */
export class UserService {
  // Implementation
}
```

##### Methods Documentation
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

**Documentation Standards**:
- **First line**: Method description
- **@param**: Parameter descriptions in declaration order
- **@returns**: Return value description
- **@throws**: Exception descriptions
- **Optional tags**: `@deprecated`, `@beta`, `@since`

#### Documentation Generation

**TypeDoc Configuration**:
```bash
# Install TypeDoc globally
npm i -g typedoc

# Generate documentation
typedoc --mode file --out docs --target ES6 ./src
```

**Documentation Structure**:
- Generate from doc-blocks using TypeDoc
- Follow [TypeDoc guidelines](https://typedoc.org/guides/doccomments/)
- Include examples in complex methods
- Document public APIs thoroughly

#### Error Management

##### Promise Error Handling
```typescript
// ✅ CORRECT: Proper promise error handling
const processData = (data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!data) {
      reject(new Error('Data is required'));
      return;
    }
    resolve(processDataInternal(data));
  });
};

// ✅ CORRECT: Always handle rejections and return values
const handlePromise = processData(input)
  .then((result: string) => {
    return result; // Always return success
  })
  .catch((error: Error) => {
    // Use notifications instead of console.error
    addError('Failed to process data');
    return Promise.reject(error); // Always transfer rejection
  });

// ✅ CORRECT: Chainable promise handling
handlePromise
  .then((data) => processNextStep(data))
  .catch((error) => handleError(error))
  .finally(() => cleanup());
```

##### Observable Error Handling
```typescript
import { Observable, Observer } from 'rxjs';

// ✅ CORRECT: Observable with proper error handling
function createDataStream(): Observable<string> {
  return new Observable((observer: Observer<string>) => {
    try {
      // Emit data
      observer.next('Hello');
      observer.next('World');
      
      // Complete or error
      observer.complete();
    } catch (error) {
      observer.error(error);
    }
  });
}

// ✅ CORRECT: Proper subscription handling
const subscription = createDataStream().subscribe(
  (data: string) => {
    // Handle data
  },
  (error: Error) => {
    // Use notifications instead of console.error
    addError('Data stream error');
  },
  () => {
    // Stream completed
  }
);

// Always unsubscribe to prevent memory leaks
subscription.unsubscribe();
```

##### JSON Parsing
```typescript
// ✅ CORRECT: Safe JSON parsing with try-catch
let parsedData: any;
try {
  parsedData = JSON.parse(jsonString);
} catch (error) {
  // Use notifications instead of console.error
  addError('Failed to parse JSON data');
  parsedData = {}; // Default fallback
}

// ✅ CORRECT: JSON parsing in Promise
const parseJsonSafely = (jsonString: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const result = JSON.parse(jsonString);
      resolve(result);
    } catch (error) {
      reject(new Error(`JSON parsing failed: ${error.message}`));
    }
  });
};
```

### Standards and Libraries

#### Configuration Management

```typescript
// ✅ CORRECT: Environment-based configuration
interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
}

const config: AppConfig = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  environment: (process.env.NODE_ENV as any) || 'development',
  debug: process.env.DEBUG === 'true'
};
```

#### Observability

##### Metrics
```typescript
// ✅ CORRECT: Application metrics
import { Counter, Histogram } from 'prom-client';

const requestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const requestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route']
});
```

##### Logging
```typescript
// ✅ CORRECT: Structured logging
import { Logger } from 'winston';

const logger = new Logger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

// Usage
logger.info('User authenticated', { userId: '123', method: 'oauth' });
logger.error('Database connection failed', { error: error.message });
```

##### Tracing
```typescript
// ✅ CORRECT: Distributed tracing
import { trace, context } from '@opentelemetry/api';

const tracer = trace.getTracer('app-tracer');

const processRequest = async (request: Request) => {
  const span = tracer.startSpan('process-request');
  
  try {
    span.setAttributes({
      'request.method': request.method,
      'request.url': request.url
    });
    
    const result = await handleRequest(request);
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    throw error;
  } finally {
    span.end();
  }
};
```

#### API Standards

```typescript
// ✅ CORRECT: RESTful API design
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  errors?: string[];
}

// ✅ CORRECT: Consistent error handling
class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ✅ CORRECT: API endpoint structure
export class UserApi {
  async getUser(id: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.userService.findById(id);
      return {
        data: user,
        status: 'success'
      };
    } catch (error) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }
  }
}
```

### Unit Testing

#### Test Framework

**Jest Configuration**:
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/__setup__/jest.setup.ts'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

**Test Structure**:
```typescript
// ✅ CORRECT: Test file structure
describe('UserService', () => {
  let userService: UserService;
  let mockApi: jest.Mocked<ApiClient>;

  beforeEach(() => {
    mockApi = createMockApiClient();
    userService = new UserService(mockApi);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateUser', () => {
    it('should authenticate user with valid credentials', async () => {
      // Arrange
      const credentials = { email: 'test@example.com', password: 'password' };
      const expectedResult = { token: 'jwt-token', user: { id: '1', email: 'test@example.com' } };
      mockApi.post.mockResolvedValue(expectedResult);

      // Act
      const result = await userService.authenticateUser(credentials.email, credentials.password);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', credentials);
    });

    it('should throw error for invalid credentials', async () => {
      // Arrange
      const credentials = { email: 'test@example.com', password: 'wrong' };
      mockApi.post.mockRejectedValue(new Error('Invalid credentials'));

      // Act & Assert
      await expect(userService.authenticateUser(credentials.email, credentials.password))
        .rejects.toThrow('Invalid credentials');
    });
  });
});
```

#### Code Coverage

**Coverage Requirements**:
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

**Coverage Commands**:
```bash
# Run tests with coverage
npm run test:coverage

# Generate coverage report
npm run coverage:report

# Check coverage thresholds
npm run coverage:check
```

### Dependency Management

#### Package Management
```json
{
  "scripts": {
    "deps:check": "npm audit",
    "deps:update": "npm update",
    "deps:audit-fix": "npm audit fix",
    "deps:outdated": "npm outdated"
  }
}
```

#### Version Management
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "typescript": "~4.9.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "jest": "^29.0.0"
  }
}
```

### Build Management

#### Build Configuration
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "build:dev": "tsc && vite build --mode development",
    "build:prod": "tsc && vite build --mode production",
    "build:analyze": "tsc && vite build --mode analyze",
    "clean": "rimraf dist",
    "type-check": "tsc --noEmit"
  }
}
```

#### Build Optimization
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

### Versioning

#### Semantic Versioning
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

#### Release Process
```bash
# Version bump
npm version patch  # 1.2.3 -> 1.2.4
npm version minor  # 1.2.3 -> 1.3.0
npm version major  # 1.2.3 -> 2.0.0

# Release
npm run build
npm run test
npm publish
```

---

## 🤖 AI Development Guidelines

### Essential Standards for AI Code Generation

1. **Always use explicit typing**: Avoid `any` type, use specific interfaces
2. **Follow TSLint rules**: Use the OVH coding style configuration
3. **Document all public APIs**: Use JSDoc format with TypeDoc
4. **Handle errors properly**: Use try-catch, proper promise/observable error handling
5. **Write comprehensive tests**: Achieve 80% coverage minimum
6. **Use semantic versioning**: Follow semver for all releases
7. **Implement observability**: Include metrics, logging, and tracing
8. **Follow RESTful API design**: Use consistent response formats
9. **Optimize builds**: Use proper bundling and chunking strategies
10. **Maintain dependencies**: Keep packages updated and secure

### Error Handling and Notifications

#### Use Notifications Instead of Console Logs

**❌ WRONG: Using console.log/console.error**
```typescript
try {
  await apiCall();
} catch (error) {
  console.error('API call failed:', error);
}
```

**✅ CORRECT: Using useNotifications hook**
```typescript
import { useNotifications } from '@ovh-ux/muk';

function MyComponent() {
  const { addSuccess, addError } = useNotifications();

  const handleApiCall = async () => {
    try {
      await apiCall();
      addSuccess('Operation completed successfully');
    } catch (error) {
      addError('Operation failed. Please try again.');
    }
  };
}
```

#### Notification Types
- `addSuccess(message)` - Success notifications
- `addError(message)` - Error notifications  
- `addWarning(message)` - Warning notifications
- `addInfo(message)` - Information notifications

### Code Quality Checklist

- [ ] All variables are explicitly typed
- [ ] TSLint passes without errors
- [ ] All public methods have JSDoc documentation
- [ ] Error handling is implemented for all async operations
- [ ] **Notifications are used instead of console.log/console.error**
- [ ] Unit tests cover all public methods
- [ ] Code coverage meets 80% threshold
- [ ] Dependencies are up to date and secure
- [ ] Build process is optimized
- [ ] Observability is implemented (metrics, logs, traces)
- [ ] API follows RESTful conventions
