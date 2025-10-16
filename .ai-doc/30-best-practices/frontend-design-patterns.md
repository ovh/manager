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

This guide covers patterns specifically relevant to:
- **React applications** in the Manager ecosystem
- **TypeScript development** with type safety
- **Frontend architecture** and component design
- **State management** and data flow

## 🔗 References

- [Development Standards](../30-best-practices/development-standards.md)
- [TypeScript Cheat Sheet](../30-best-practices/typescript-cheatsheet.md)
- [MRC Components](../20-dependencies/mrc-components.md)
- [ODS Components](../20-dependencies/ods-components.md)
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
Patterns reduce one pain while introducing another — balance is key:
- **Flexibility vs Complexity**: More flexible patterns are often more complex
- **Performance vs Maintainability**: Optimized code may be harder to maintain
- **Reusability vs Specificity**: Generic solutions may not fit specific needs perfectly

#### Shared Language
Saying "Factory" or "Observer" creates instant understanding across teams:
- **Consistent naming** for pattern implementations
- **Documentation** of pattern usage and rationale
- **Code reviews** that reference established patterns

### 🏡 Creational Patterns – How We Build the Furniture

#### 🛠 Factory – The Workshop

**Purpose**: Centralizes object creation and provides a consistent interface for creating related objects.

```typescript
// ✅ CORRECT: Factory pattern for notifications
interface Notification {
  send(message: string): Promise<void>;
}

class EmailNotification implements Notification {
  async send(message: string): Promise<void> {
    // Email sending logic
  }
}

class SMSNotification implements Notification {
  async send(message: string): Promise<void> {
    // SMS sending logic
  }
}

class PushNotification implements Notification {
  async send(message: string): Promise<void> {
    // Push notification logic
  }
}

// Factory function
export function createNotification(type: "email" | "sms" | "push"): Notification {
  switch (type) {
    case "email":
      return new EmailNotification();
    case "sms":
      return new SMSNotification();
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

**✅ Strengths**:
- Easy to extend with new types
- Centralized creation logic
- Consistent interface

**❌ Limitations**:
- Indirection overhead
- Can become complex with many types

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

**✅ Strengths**:
- Flexible configuration
- Fluent interface
- Validation at build time

**❌ Limitations**:
- Verbose implementation
- More complex than direct construction

**Best Use**: Complex objects with many optional parameters

#### 🌡 Singleton – The Thermostat

**Purpose**: Ensures a class has only one instance and provides global access to it.

```typescript
// ✅ CORRECT: Singleton pattern for authentication manager
class AuthManager {
  private static instance: AuthManager;
  private user: User | null = null;
  private token: string | null = null;

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  async login(credentials: LoginCredentials): Promise<void> {
    const response = await api.login(credentials);
    this.token = response.token;
    this.user = response.user;
  }

  logout(): void {
    this.token = null;
    this.user = null;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  getCurrentUser(): User | null {
    return this.user;
  }
}

// Usage
const authManager = AuthManager.getInstance();
await authManager.login({ email: "user@example.com", password: "password" });
```

**✅ Strengths**:
- Global coordination
- Single source of truth
- Lazy initialization

**❌ Limitations**:
- Hidden dependencies
- Harder to test
- Global state issues

**Best Use**: Shared state that needs global coordination (auth, config, logging)

### 🏡 Structural Patterns – How We Arrange the Furniture

#### 🔌 Adapter – Power Plug

**Purpose**: Makes incompatible interfaces work together.

```typescript
// ✅ CORRECT: Adapter pattern for legacy API integration
interface LegacyUser {
  uid: string;
  fullName: string;
  emailAddress: string;
}

interface ModernUser {
  id: string;
  name: string;
  email: string;
}

class LegacyUserAdapter {
  static adapt(legacyUser: LegacyUser): ModernUser {
    return {
      id: legacyUser.uid,
      name: legacyUser.fullName,
      email: legacyUser.emailAddress
    };
  }

  static adaptArray(legacyUsers: LegacyUser[]): ModernUser[] {
    return legacyUsers.map(this.adapt);
  }
}

// Usage with React hook
function useLegacyUserAdapter() {
  const [users, setUsers] = useState<ModernUser[]>([]);

  useEffect(() => {
    legacyAPI.getUsers().then((legacyUsers: LegacyUser[]) => {
      const modernUsers = LegacyUserAdapter.adaptArray(legacyUsers);
      setUsers(modernUsers);
    });
  }, []);

  return users;
}
```

**✅ Strengths**:
- Compatibility with existing systems
- Clean separation of concerns
- Easy to maintain

**❌ Limitations**:
- Extra layer of abstraction
- Potential performance overhead

**Best Use**: Integrating with external APIs or legacy systems

#### 🛋 Decorator – Couch with Cushions

**Purpose**: Adds new functionality to objects dynamically without altering their structure.

```typescript
// ✅ CORRECT: Decorator pattern for React components
interface ComponentProps {
  title: string;
  content: string;
}

// Base component
function BaseCard({ title, content }: ComponentProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

// Decorator HOCs
function withLogger<T extends ComponentProps>(Component: React.ComponentType<T>) {
  return function LoggedComponent(props: T) {
    console.log(`Rendering ${Component.name} with props:`, props);
    return <Component {...props} />;
  };
}

function withErrorBoundary<T extends ComponentProps>(Component: React.ComponentType<T>) {
  return function ErrorBoundedComponent(props: T) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

function withAnalytics<T extends ComponentProps>(Component: React.ComponentType<T>) {
  return function AnalyticsComponent(props: T) {
    useEffect(() => {
      analytics.track('component_view', { component: Component.name });
    }, []);

    return <Component {...props} />;
  };
}

// Usage - composing decorators
const EnhancedCard = withAnalytics(
  withErrorBoundary(
    withLogger(BaseCard)
  )
);

// Usage in JSX
<EnhancedCard title="Welcome" content="Hello World!" />
```

**✅ Strengths**:
- Extensible without modifying base classes
- Composable functionality
- Follows open/closed principle

**❌ Limitations**:
- Can lead to nesting hell
- Debugging can be complex
- Performance overhead

**Best Use**: Adding cross-cutting concerns to components (logging, analytics, error handling)

#### 🎛 Facade – Remote Control Panel

**Purpose**: Provides a simplified interface to a complex subsystem.

```typescript
// ✅ CORRECT: Facade pattern for routing operations
import { useNavigate, useLocation, useParams } from 'react-router-dom';

interface RoutingFacade {
  goHome: () => void;
  goUser: (id: string) => void;
  goSettings: () => void;
  goBack: () => void;
  getCurrentPath: () => string;
  getUserId: () => string | undefined;
}

function useRoutingFacade(): RoutingFacade {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ userId: string }>();

  return {
    goHome: () => navigate('/'),
    goUser: (id: string) => navigate(`/users/${id}`),
    goSettings: () => navigate('/settings'),
    goBack: () => navigate(-1),
    getCurrentPath: () => location.pathname,
    getUserId: () => params.userId
  };
}

// Usage in components
function UserProfile() {
  const routing = useRoutingFacade();
  const userId = routing.getUserId();

  const handleEditUser = () => {
    routing.goUser(userId!);
  };

  return (
    <div>
      <h1>User Profile</h1>
      <button onClick={handleEditUser}>Edit User</button>
      <button onClick={routing.goBack}>Back</button>
    </div>
  );
}
```

**✅ Strengths**:
- Simple API for complex operations
- Hides implementation details
- Easy to use and understand

**❌ Limitations**:
- Can hide important details
- May become a god object
- Less flexible than direct access

**Best Use**: Simplifying complex subsystems (routing, API calls, state management)

#### 🚪 Proxy – Doorman

**Purpose**: Controls access to objects and adds additional functionality like caching or validation.

```typescript
// ✅ CORRECT: Proxy pattern for API caching
interface ApiResponse<T> {
  data: T;
  timestamp: number;
}

class ApiProxy {
  private cache = new Map<string, ApiResponse<any>>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async fetch<T>(url: string): Promise<T> {
    const cached = this.cache.get(url);
    
    if (cached && this.isCacheValid(cached)) {
      console.log(`Cache hit for ${url}`);
      return cached.data;
    }

    console.log(`Fetching ${url} from API`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.cache.set(url, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error(`API error for ${url}:`, error);
      throw error;
    }
  }

  private isCacheValid(response: ApiResponse<any>): boolean {
    return Date.now() - response.timestamp < this.CACHE_DURATION;
  }

  clearCache(): void {
    this.cache.clear();
  }

  invalidateCache(url: string): void {
    this.cache.delete(url);
  }
}

// Usage
const apiProxy = new ApiProxy();

// React hook using the proxy
function useApiData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiProxy.fetch<T>(url)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```

**✅ Strengths**:
- Caching and performance optimization
- Access control and validation
- Lazy loading capabilities

**❌ Limitations**:
- Additional indirection
- Can hide important behavior
- Memory overhead for caching

**Best Use**: API calls, expensive operations, access control

### 🏡 Behavioral Patterns – How People Live in the House

#### 🔄 Observer – Doorbell

**Purpose**: Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified.

```typescript
// ✅ CORRECT: Observer pattern for event management
interface Observer<T> {
  update(data: T): void;
}

interface Subject<T> {
  subscribe(observer: Observer<T>): void;
  unsubscribe(observer: Observer<T>): void;
  notify(data: T): void;
}

class EventManager<T> implements Subject<T> {
  private observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(data: T): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Usage in React
class UserNotificationService {
  private eventManager = new EventManager<string>();

  subscribe(callback: (message: string) => void) {
    const observer: Observer<string> = {
      update: callback
    };
    this.eventManager.subscribe(observer);
    return () => this.eventManager.unsubscribe(observer);
  }

  notify(message: string) {
    this.eventManager.notify(message);
  }
}

// React hook
function useNotifications() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const service = useMemo(() => new UserNotificationService(), []);

  useEffect(() => {
    const unsubscribe = service.subscribe((message) => {
      setNotifications(prev => [...prev, message]);
    });

    return unsubscribe;
  }, [service]);

  return { notifications, notify: service.notify.bind(service) };
}
```

#### 🎯 Strategy – Recipes

**Purpose**: Defines a family of algorithms, encapsulates each one, and makes them interchangeable.

```typescript
// ✅ CORRECT: Strategy pattern for different sorting algorithms
interface SortStrategy<T> {
  sort(items: T[]): T[];
}

class QuickSort<T> implements SortStrategy<T> {
  sort(items: T[]): T[] {
    // Quick sort implementation
    return [...items].sort();
  }
}

class MergeSort<T> implements SortStrategy<T> {
  sort(items: T[]): T[] {
    // Merge sort implementation
    return [...items].sort();
  }
}

class BubbleSort<T> implements SortStrategy<T> {
  sort(items: T[]): T[] {
    // Bubble sort implementation
    return [...items].sort();
  }
}

class SortContext<T> {
  private strategy: SortStrategy<T>;

  constructor(strategy: SortStrategy<T>) {
    this.strategy = strategy;
  }

  setStrategy(strategy: SortStrategy<T>): void {
    this.strategy = strategy;
  }

  sort(items: T[]): T[] {
    return this.strategy.sort(items);
  }
}

// Usage in React
function SortableList<T>({ items, sortType }: { items: T[]; sortType: 'quick' | 'merge' | 'bubble' }) {
  const [sortedItems, setSortedItems] = useState<T[]>(items);

  useEffect(() => {
    let strategy: SortStrategy<T>;
    
    switch (sortType) {
      case 'quick':
        strategy = new QuickSort<T>();
        break;
      case 'merge':
        strategy = new MergeSort<T>();
        break;
      case 'bubble':
        strategy = new BubbleSort<T>();
        break;
      default:
        strategy = new QuickSort<T>();
    }

    const context = new SortContext(strategy);
    setSortedItems(context.sort(items));
  }, [items, sortType]);

  return (
    <ul>
      {sortedItems.map((item, index) => (
        <li key={index}>{String(item)}</li>
      ))}
    </ul>
  );
}
```

#### 🏠 Mediator – House Manager

**Purpose**: Defines how a set of objects interact, promoting loose coupling by keeping objects from referring to each other explicitly.

```typescript
// ✅ CORRECT: Mediator pattern for component communication
interface Mediator {
  notify(sender: string, event: string, data?: any): void;
}

interface Colleague {
  setMediator(mediator: Mediator): void;
  getName(): string;
}

class ComponentMediator implements Mediator {
  private colleagues: Map<string, Colleague> = new Map();

  register(colleague: Colleague): void {
    colleague.setMediator(this);
    this.colleagues.set(colleague.getName(), colleague);
  }

  notify(sender: string, event: string, data?: any): void {
    this.colleagues.forEach((colleague, name) => {
      if (name !== sender) {
        colleague.receive(sender, event, data);
      }
    });
  }
}

// Usage in React components
class SearchComponent implements Colleague {
  private mediator?: Mediator;

  setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }

  getName(): string {
    return 'search';
  }

  onSearch(query: string): void {
    this.mediator?.notify('search', 'search', { query });
  }

  receive(sender: string, event: string, data?: any): void {
    if (event === 'clear') {
      // Clear search input
    }
  }
}

class FilterComponent implements Colleague {
  private mediator?: Mediator;

  setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }

  getName(): string {
    return 'filter';
  }

  onFilterChange(filter: string): void {
    this.mediator?.notify('filter', 'filter', { filter });
  }

  receive(sender: string, event: string, data?: any): void {
    if (event === 'search') {
      // Update filter based on search
    }
  }
}
```

### 📊 Trade-off Matrix (Room Edition)

| Pattern | Room Metaphor | Strengths | Limitations | Best Use |
|---------|---------------|-----------|-------------|----------|
| **Factory** | Workshop | Centralized creation | Indirection overhead | Similar objects |
| **Builder** | Kitchen | Flexible configs | Verbose | Complex objects |
| **Singleton** | Thermostat | Global coordination | Hard to test | Shared state |
| **Adapter** | Power plug | Compatibility | Wrapper cost | External APIs |
| **Decorator** | Cushions | Extensible | Wrapper hell | UI features |
| **Facade** | Remote control | Simplicity | Hides details | Complex subsystems |
| **Proxy** | Doorman | Control, caching | Indirection | APIs, security |
| **Observer** | Doorbell | Reactive updates | Event storms | Event-driven UIs |
| **Strategy** | Recipes | Swappable logic | More classes | Flexible algorithms |
| **Mediator** | House manager | Decouples components | Central bottleneck | Complex workflows |

### React-Specific Patterns

#### Custom Hooks Pattern

```typescript
// ✅ CORRECT: Custom hook for data fetching
function useApiData<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, options);
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
  }, [url, options]);

  return { data, loading, error };
}
```

#### Compound Components Pattern

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

---

## 🤖 AI Development Guidelines

### Essential Pattern Selection Rules

1. **Choose patterns based on problem complexity**: Simple problems don't need complex patterns
2. **Consider team familiarity**: Use patterns the team understands
3. **Evaluate trade-offs**: Every pattern has benefits and costs
4. **Start simple**: Begin with basic patterns and evolve as needed
5. **Document pattern usage**: Explain why a pattern was chosen
6. **Test pattern implementations**: Ensure patterns don't hide bugs
7. **Avoid over-engineering**: Don't use patterns just because they exist
8. **Consider performance**: Some patterns have runtime overhead
9. **Plan for evolution**: Choose patterns that can grow with requirements
10. **Maintain consistency**: Use the same patterns for similar problems

### Pattern Implementation Checklist

- [ ] Pattern choice is justified by the problem
- [ ] Trade-offs are understood and acceptable
- [ ] Implementation follows established conventions
- [ ] Pattern is properly documented
- [ ] Tests cover pattern behavior
- [ ] Performance impact is considered
- [ ] Pattern can evolve with requirements
- [ ] Team understands the pattern
- [ ] Pattern is consistent with existing code
- [ ] Pattern doesn't over-complicate the solution

### Common Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Overusing Singleton
class DatabaseConnection {
  private static instance: DatabaseConnection;
  // ... singleton implementation
}

// ❌ WRONG: Deep decorator nesting
const Component = withA(withB(withC(withD(BaseComponent))));

// ❌ WRONG: God object facade
class ApplicationFacade {
  // 50+ methods doing everything
}

// ❌ WRONG: Strategy pattern for simple cases
interface SimpleStrategy {
  process(data: string): string;
}
// When a simple function would suffice
```

### Recommended Pattern Combinations

```typescript
// ✅ CORRECT: Factory + Strategy
class NotificationFactory {
  static create(type: NotificationType): NotificationStrategy {
    switch (type) {
      case 'email': return new EmailStrategy();
      case 'sms': return new SMSStrategy();
      default: throw new Error('Unknown type');
    }
  }
}

// ✅ CORRECT: Observer + Mediator
class EventMediator {
  private observers = new Map<string, Observer[]>();
  
  subscribe(event: string, observer: Observer): void {
    // Implementation
  }
  
  notify(event: string, data: any): void {
    // Implementation
  }
}

// ✅ CORRECT: Proxy + Factory
class ApiProxyFactory {
  static create(type: 'cached' | 'direct'): ApiProxy {
    return type === 'cached' ? new CachedApiProxy() : new DirectApiProxy();
  }
}
```

---

## ⚖️ The Interior Designer's Moral

- **A Factory (Workshop)** builds your chairs
- **A Proxy (Doorman)** protects your lobby  
- **A Memento (Photo Album)** lets you rewind your remodel

**👉 Don't fill every room with furniture. Choose the right piece for the right place.**

Design patterns are tools in your toolkit, not solutions to every problem. Use them judiciously, understand their trade-offs, and always prioritize clarity and maintainability over cleverness.
