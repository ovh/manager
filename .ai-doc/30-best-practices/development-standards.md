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
- [MRC Components](../20-design-system/mrc-components.md)
- [ODS Components](../20-design-system/ods-components.md)
- [TypeDoc Documentation](https://typedoc.org/guides/doccomments/)
- [TSLint Configuration](https://stash.ovh.net/projects/NETAUTO/repos/coding-style/browse)

## 📘 Guidelines / Implementation

### Project Directory Structure

```
├── jest.config.js              # Jest testing configuration
├── Makefile                    # Build automation
├── __mocks__                   # Jest mocks
│   ├── fileMock.js
│   └── ...
├── package.json                # Dependencies and scripts
├── package-lock.json           # Lock file for npm
├── README.md                   # Project documentation
├── __setup__                   # Jest setup files
├── src/                        # Source code
│   ├── @types/                 # Custom TypeScript types
│   ├── models/                 # Data models
│   ├── services/               # Business logic services
│   ├── styles/                 # CSS/SCSS files
│   └── main.ts                 # Application entry point
├── __tests__/                  # Jest test files
│   └── services/
├── tsconfig.json               # TypeScript configuration
├── tslint.json                 # TSLint configuration
└── yarn.lock                   # Lock file for yarn
```

### Coding Style

#### TypeScript Best Practices

For comprehensive TypeScript guidelines, patterns, and best practices, refer to the [TypeScript Cheat Sheet](./typescript-cheatsheet.md).

**Key principles**:
- Always type variables explicitly
- Avoid `any` type - use specific types or interfaces
- Use strict type checking configuration
- Follow defensive programming patterns

#### Linter Configuration

**TSLint Rules**: Available in the [OVH Stash repository](https://stash.ovh.net/projects/NETAUTO/repos/coding-style/browse)

**IDE Plugins**:
- **VSCode**: [TypeScript TSLint Plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)
- **PyCharm**: [TSLint Integration](https://www.jetbrains.com/help/pycharm/using-tslint-code-quality-tool.html)
- **IntelliJ**: [TSLint Integration](https://www.jetbrains.com/help/idea/using-tslint-code-quality-tool.html)

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
import { useNotifications } from '@ovh-ux/manager-react-components';

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
