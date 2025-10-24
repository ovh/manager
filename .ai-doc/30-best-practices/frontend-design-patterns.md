---
title: Frontend Design Patterns
last_update: 2025-01-27
tags: [patterns, design, frontend, architecture, react, typescript, ovhcloud, manager]
ai: true
---

# Frontend Design Patterns

## 🧭 Purpose

This document defines the **frontend design patterns** used in the OVHcloud Manager ecosystem. If architecture is about organizing the house itself (walls, rooms, layout), then design patterns are about how we arrange the furniture, lighting, and flows inside each room.

These patterns provide a shared language for teams, optimize trade-offs between different approaches, and ensure consistency across the Manager applications.

## ⚙️ Context

Design patterns are essential for:
- **Maintainable code** that can evolve over time
- **Team collaboration** with shared understanding
- **Problem-solving** with proven solutions
- **Code reusability** across different components
- **Testing and debugging** with predictable structures

## 🔗 References

- [Development Standards](./development-standards.md)
- [TypeScript Cheat Sheet](./typescript-cheatsheet.md)
- [MUK Components](../20-dependencies/muk.md)
- [Manager API Overview](../10-architecture/api-overview.md)

## 📘 Guidelines / Implementation

### 🌐 Universal Laws of Design Patterns

#### Context Matters
The right furniture (pattern) depends on the room (problem). Choose patterns based on:
- **Problem complexity** and requirements
- **Team expertise** and familiarity
- **Performance constraints** and trade-offs
- **Maintenance needs** and long-term goals

#### Optimize Trade-offs
Every pattern has trade-offs. Consider:
- **Complexity vs. Flexibility**: More complex patterns offer more flexibility
- **Performance vs. Maintainability**: Some patterns optimize for one over the other
- **Learning Curve vs. Long-term Benefits**: Initial complexity for future gains

### 🏗️ Creational Patterns

#### 🏭 Factory – Smart Object Creation

**Purpose**: Creates objects without specifying their exact class.

```typescript
// ✅ CORRECT: Factory pattern for notification creation
interface Notification {
  send(message: string): Promise<void>;
}

class EmailNotification implements Notification {
  async send(message: string): Promise<void> {
    // Email sending logic
  }
}

class PushNotification implements Notification {
  async send(message: string): Promise<void> {
    // Push notification logic
  }
}

function createNotification(type: "email" | "push"): Notification {
  switch (type) {
    case "email":
      return new EmailNotification();
    case "push":
      return new PushNotification();
    default:
      throw new Error(`Unknown notification type: ${type}`);
  }
}

// Usage
const notification = createNotification("email");
await notification.send("Welcome to OVHcloud!");
```

**✅ Strengths**: Easy to extend, centralized creation logic
**❌ Limitations**: Indirection overhead, can become complex
**Best Use**: Creating similar objects with different implementations

#### 🍳 Builder – Custom Kitchen Assembly

**Purpose**: Builds complex objects step by step with a fluent interface.

```typescript
// ✅ CORRECT: Builder pattern for dashboard configuration
interface DashboardConfig {
  theme: "light" | "dark";
  widgets: string[];
  layout: "grid" | "list";
  refreshInterval: number;
}

class DashboardBuilder {
  private config: Partial<DashboardConfig> = {};

  setTheme(theme: "light" | "dark"): this {
    this.config.theme = theme;
    return this;
  }

  addWidget(widget: string): this {
    this.config.widgets = [...(this.config.widgets || []), widget];
    return this;
  }

  setLayout(layout: "grid" | "list"): this {
    this.config.layout = layout;
    return this;
  }

  setRefreshInterval(interval: number): this {
    this.config.refreshInterval = interval;
    return this;
  }

  build(): DashboardConfig {
    return {
      theme: this.config.theme || "light",
      widgets: this.config.widgets || [],
      layout: this.config.layout || "grid",
      refreshInterval: this.config.refreshInterval || 30000
    };
  }
}

// Usage
const dashboard = new DashboardBuilder()
  .setTheme("dark")
  .addWidget("chart")
  .addWidget("metrics")
  .setLayout("grid")
  .setRefreshInterval(60000)
  .build();
```

**✅ Strengths**: Flexible configuration, fluent interface
**❌ Limitations**: Verbose implementation, more complex than direct construction
**Best Use**: Complex objects with many optional parameters

#### 🌡 Singleton – The Thermostat

**Purpose**: Ensures a class has only one instance and provides global access to it.

```typescript
// ✅ CORRECT: Singleton pattern for authentication manager
class AuthManager {
  private static instance: AuthManager;
  private user: User | null = null;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  setUser(user: User, token: string): void {
    this.user = user;
    this.token = token;
  }

  getUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  logout(): void {
    this.user = null;
    this.token = null;
  }
}

// Usage
const authManager = AuthManager.getInstance();
authManager.setUser(user, token);
```

**✅ Strengths**: Global access, single instance
**❌ Limitations**: Global state, testing difficulties, tight coupling
**Best Use**: Shared resources like configuration, logging, or authentication

### 🏗️ Structural Patterns

#### 🎭 Adapter – Universal Plug Converter

**Purpose**: Allows incompatible interfaces to work together.

```typescript
// ✅ CORRECT: Adapter pattern for different API formats
interface LegacyUser {
  id: number;
  fullName: string;
  emailAddress: string;
}

interface ModernUser {
  id: string;
  name: string;
  email: string;
}

class UserAdapter {
  static adaptLegacyToModern(legacyUser: LegacyUser): ModernUser {
    return {
      id: legacyUser.id.toString(),
      name: legacyUser.fullName,
      email: legacyUser.emailAddress
    };
  }

  static adaptModernToLegacy(modernUser: ModernUser): LegacyUser {
    return {
      id: parseInt(modernUser.id),
      fullName: modernUser.name,
      emailAddress: modernUser.email
    };
  }
}

// Usage
const legacyUser: LegacyUser = { id: 1, fullName: "John Doe", emailAddress: "john@example.com" };
const modernUser = UserAdapter.adaptLegacyToModern(legacyUser);
```

**✅ Strengths**: Enables integration, maintains existing code
**❌ Limitations**: Additional complexity, potential performance overhead
**Best Use**: Integrating legacy systems or third-party libraries

#### 🎨 Decorator – Adding Features Like Accessories

**Purpose**: Adds new functionality to objects without altering their structure.

```typescript
// ✅ CORRECT: Decorator pattern for enhanced API calls
interface ApiCall {
  execute(): Promise<any>;
}

class BasicApiCall implements ApiCall {
  constructor(private url: string) {}

  async execute(): Promise<any> {
    const response = await fetch(this.url);
    return response.json();
  }
}

class LoggingApiCall implements ApiCall {
  constructor(private apiCall: ApiCall) {}

  async execute(): Promise<any> {
    console.log("API call started");
    const result = await this.apiCall.execute();
    console.log("API call completed", result);
    return result;
  }
}

class CachingApiCall implements ApiCall {
  private cache = new Map<string, any>();

  constructor(private apiCall: ApiCall) {}

  async execute(): Promise<any> {
    const cacheKey = "api_call";
    if (this.cache.has(cacheKey)) {
      console.log("Returning cached result");
      return this.cache.get(cacheKey);
    }

    const result = await this.apiCall.execute();
    this.cache.set(cacheKey, result);
    return result;
  }
}

// Usage
const basicCall = new BasicApiCall("/api/users");
const loggedCall = new LoggingApiCall(basicCall);
const cachedCall = new CachingApiCall(loggedCall);
const result = await cachedCall.execute();
```

**✅ Strengths**: Flexible feature addition, composition over inheritance
**❌ Limitations**: Can create complex object hierarchies
**Best Use**: Adding cross-cutting concerns like logging, caching, or validation

### 🎯 Behavioral Patterns

#### 🎪 Observer – Event Notification System

**Purpose**: Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified.

```typescript
// ✅ CORRECT: Observer pattern for user authentication state
interface Observer {
  update(data: any): void;
}

class AuthStateManager {
  private observers: Observer[] = [];
  private isAuthenticated: boolean = false;
  private user: User | null = null;

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  private notifyObservers(): void {
    this.observers.forEach(observer => {
      observer.update({
        isAuthenticated: this.isAuthenticated,
        user: this.user
      });
    });
  }

  setAuthState(isAuthenticated: boolean, user: User | null): void {
    this.isAuthenticated = isAuthenticated;
    this.user = user;
    this.notifyObservers();
  }
}

class NavigationComponent implements Observer {
  update(data: { isAuthenticated: boolean; user: User | null }): void {
    if (data.isAuthenticated) {
      this.showUserMenu(data.user);
    } else {
      this.showLoginButton();
    }
  }

  private showUserMenu(user: User | null): void {
    // Show user menu logic
  }

  private showLoginButton(): void {
    // Show login button logic
  }
}

// Usage
const authManager = new AuthStateManager();
const navigation = new NavigationComponent();
authManager.addObserver(navigation);
authManager.setAuthState(true, user);
```

**✅ Strengths**: Loose coupling, dynamic relationships
**❌ Limitations**: Memory leaks if not properly managed, complex debugging
**Best Use**: Event-driven systems, model-view architectures

#### 🎯 Strategy – Algorithm Selection

**Purpose**: Defines a family of algorithms, encapsulates each one, and makes them interchangeable.

```typescript
// ✅ CORRECT: Strategy pattern for different sorting algorithms
interface SortingStrategy {
  sort(data: number[]): number[];
}

class BubbleSortStrategy implements SortingStrategy {
  sort(data: number[]): number[] {
    // Bubble sort implementation
    const result = [...data];
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result.length - i - 1; j++) {
        if (result[j] > result[j + 1]) {
          [result[j], result[j + 1]] = [result[j + 1], result[j]];
        }
      }
    }
    return result;
  }
}

class QuickSortStrategy implements SortingStrategy {
  sort(data: number[]): number[] {
    // Quick sort implementation
    if (data.length <= 1) return data;
    
    const pivot = data[Math.floor(data.length / 2)];
    const left = data.filter(x => x < pivot);
    const right = data.filter(x => x > pivot);
    const middle = data.filter(x => x === pivot);
    
    return [...this.sort(left), ...middle, ...this.sort(right)];
  }
}

class DataProcessor {
  constructor(private sortingStrategy: SortingStrategy) {}

  setSortingStrategy(strategy: SortingStrategy): void {
    this.sortingStrategy = strategy;
  }

  processData(data: number[]): number[] {
    return this.sortingStrategy.sort(data);
  }
}

// Usage
const processor = new DataProcessor(new BubbleSortStrategy());
const sortedData = processor.processData([3, 1, 4, 1, 5, 9, 2, 6]);

// Switch strategy at runtime
processor.setSortingStrategy(new QuickSortStrategy());
const quickSortedData = processor.processData([3, 1, 4, 1, 5, 9, 2, 6]);
```

**✅ Strengths**: Algorithm flexibility, easy to extend
**❌ Limitations**: Increased number of classes, client must know strategies
**Best Use**: When you have multiple ways to perform a task

### 🎨 React-Specific Patterns

#### 🧩 Component Composition

**Purpose**: Build complex UIs by combining simple components.

```typescript
// ✅ CORRECT: Component composition pattern
interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

function Card({ children, title, className }: CardProps) {
  return (
    <div className={`card ${className || ''}`}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
    </div>
  );
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>;
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="card-footer">{children}</div>;
}

// Usage
function UserProfile({ user }: { user: User }) {
  return (
    <Card title="User Profile">
      <CardHeader>
        <img src={user.avatar} alt={user.name} />
      </CardHeader>
      <CardBody>
        <h4>{user.name}</h4>
        <p>{user.email}</p>
      </CardBody>
      <CardFooter>
        <button>Edit Profile</button>
      </CardFooter>
    </Card>
  );
}
```

**✅ Strengths**: Reusable components, flexible composition
**❌ Limitations**: Can become complex with many nested components
**Best Use**: Building complex UIs with reusable parts

#### 🎣 Custom Hooks

**Purpose**: Extract component logic into reusable functions.

```typescript
// ✅ CORRECT: Custom hook for API data fetching
function useApiData<T>(url: string) {
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

// Usage
function UserList() {
  const { data: users, loading, error } = useApiData<User[]>('/api/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!users) return <div>No users found</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**✅ Strengths**: Logic reuse, separation of concerns
**❌ Limitations**: Can become complex, requires understanding of React hooks
**Best Use**: Extracting reusable logic from components

### 🎯 Pattern Selection Guide

#### When to Use Each Pattern

| Pattern | Best For | Avoid When |
|---------|----------|------------|
| **Factory** | Creating similar objects with different implementations | Simple object creation |
| **Builder** | Complex objects with many optional parameters | Simple objects with few parameters |
| **Singleton** | Shared resources (config, auth, logging) | General object creation |
| **Adapter** | Integrating incompatible interfaces | When interfaces can be unified |
| **Decorator** | Adding cross-cutting concerns | Simple feature addition |
| **Observer** | Event-driven systems | Simple state management |
| **Strategy** | Multiple algorithms for the same task | Single algorithm approach |
| **Composition** | Building complex UIs | Simple, single-purpose components |
| **Custom Hooks** | Reusable component logic | Simple, component-specific logic |

### 🚨 Anti-Patterns to Avoid

#### 1. God Object
```typescript
// ❌ WRONG: God object with too many responsibilities
class UserManager {
  // User management
  createUser() {}
  updateUser() {}
  deleteUser() {}
  
  // Email management
  sendEmail() {}
  validateEmail() {}
  
  // File management
  uploadFile() {}
  downloadFile() {}
  
  // Database management
  connectToDatabase() {}
  executeQuery() {}
}

// ✅ CORRECT: Separated concerns
class UserService {
  createUser() {}
  updateUser() {}
  deleteUser() {}
}

class EmailService {
  sendEmail() {}
  validateEmail() {}
}

class FileService {
  uploadFile() {}
  downloadFile() {}
}
```

#### 2. Premature Optimization
```typescript
// ❌ WRONG: Complex pattern for simple problem
class SimpleDataProcessor {
  private strategy: SortingStrategy;
  private observer: Observer;
  private decorator: ApiCall;
  
  processData(data: number[]): number[] {
    // Over-engineered solution
  }
}

// ✅ CORRECT: Simple solution for simple problem
function processData(data: number[]): number[] {
  return data.sort((a, b) => a - b);
}
```

### 📚 Best Practices

#### 1. Start Simple
- Begin with the simplest solution that works
- Add patterns only when complexity demands it
- Refactor when you see repeated code

#### 2. Document Patterns
- Explain why a pattern was chosen
- Document the trade-offs made
- Provide usage examples

#### 3. Test Patterns
- Write tests for pattern implementations
- Test pattern interactions
- Verify pattern behavior

#### 4. Review and Refactor
- Regularly review pattern usage
- Refactor when patterns become outdated
- Remove unused patterns

### 📖 References

- [Design Patterns: Elements of Reusable Object-Oriented Software](https://en.wikipedia.org/wiki/Design_Patterns)
- [React Patterns](https://reactpatterns.com/)
- [TypeScript Design Patterns](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [Frontend Architecture Patterns](https://martinfowler.com/articles/micro-frontends.html)
