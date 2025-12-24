---
title: TypeScript Cheat Sheet
last_update: 2025-01-27
tags: [typescript, types, react, best-practices, development, ovhcloud, manager]
ai: true
---

# TypeScript Cheat Sheet

## 🧭 Purpose

This comprehensive TypeScript cheat sheet provides a compact overview from foundations to advanced patterns, with React-oriented examples and best practices. It serves as a quick reference for developers working in the OVHcloud Manager ecosystem to write type-safe, maintainable code.

The guide emphasizes defensive programming strategies and proper type usage to prevent runtime errors and improve code quality.

## ⚙️ Context

TypeScript is a **compile-time static analyzer** that:
- Infers types and narrows them through control flow (`typeof`, `in`, `instanceof`, discriminants)
- Flags impossible states before runtime
- Does not change values at runtime—only the compiler's understanding of them

This cheat sheet is designed for developers working with:
- **React applications** in the Manager ecosystem
- **TypeScript projects** with strict type checking
- **Modern development practices** with defensive programming

## 🔗 References

- [Development Standards](../30-best-practices/development-standards.md)
- [Frontend React Patterns](../30-best-practices/frontend-react-patterns.md)
- [MUK Components](../20-dependencies/muk.md)
- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## 📘 Guidelines / Implementation

### 🌱 Foundations

#### Basic Types

```typescript
// ✅ CORRECT: Explicit typing
let username: string = "Héla";
let isAdmin: boolean = true;
let userCount: number = 42;
let userIds: number[] = [1, 2, 3];
let userMap: Record<string, number> = { "user1": 1, "user2": 2 };

// ❌ WRONG: Avoid 'any' type
let data: any = fetchData();

// ✅ CORRECT: Use specific types
let data: UserData = fetchData();
```

#### Union Types

```typescript
// ✅ CORRECT: Union types for multiple possible values
let status: "loading" | "success" | "error";
let theme: "light" | "dark" | "auto";
let size: "small" | "medium" | "large";

// ✅ CORRECT: Union with null/undefined
let user: User | null = null;
let optionalValue: string | undefined = undefined;
```

#### Type Aliases & Interfaces

```typescript
// ✅ CORRECT: Type aliases for unions and primitives
type ID = string | number;
type Status = "pending" | "approved" | "rejected";
type EventHandler<T> = (event: T) => void;

// ✅ CORRECT: Interfaces for object shapes
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional property
  readonly createdAt: Date; // Readonly property
}

// ✅ CORRECT: Interface extension
interface AdminUser extends User {
  permissions: string[];
  isSuperAdmin: boolean;
}
```

#### React Props

```typescript
// ✅ CORRECT: Typed React component props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  children?: React.ReactNode;
}

function Button({ label, onClick, variant = "primary", disabled = false }: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}

// ✅ CORRECT: Generic component props
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}
```

### 🏷️ Type Assertions (as): What, Why, and Safer Options

#### What is a Type Assertion?

A type assertion tells the compiler: "treat this value as type X." It has **no runtime effect** and performs **no check**.

```typescript
// ❌ RISKY: Type assertion without verification
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
myCanvas.getContext("2d"); // Might explode at runtime if element is not canvas

// ❌ VERY RISKY: Double assertion (stealth escape hatch)
const s = (unknownInput as unknown as string); // Bypasses all type checking
```

#### Why `as` Can Be a "Hidden any"

Overusing `as` can paper over uncertainty and silence the checker:

```typescript
// ❌ WRONG: Skipping null checks
const element = document.getElementById("input") as HTMLInputElement;
element.value; // Might throw if element is null

// ❌ WRONG: Trusting unvalidated JSON
const user = JSON.parse(jsonString) as User; // No validation

// ❌ WRONG: Forcing DOM types
const button = event.target as HTMLButtonElement; // Might not be a button
```

#### Safer Patterns (Use These First)

##### 1) Prove it at Runtime (Narrowing)

```typescript
// ✅ CORRECT: Runtime verification with narrowing
const el = document.getElementById("main_canvas");
if (el instanceof HTMLCanvasElement) {
  el.getContext("2d"); // Safe, no assertion needed
}

// ✅ CORRECT: Type guards
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && 
         obj !== null && 
         'id' in obj && 
         'name' in obj;
}

if (isUser(data)) {
  console.log(data.name); // Safe, data is narrowed to User
}
```

##### 2) Prefer Correctly Typed APIs

```typescript
// ✅ CORRECT: Generic querySelector
const canvas = document.querySelector<HTMLCanvasElement>("#main_canvas");
if (!canvas) throw new Error("Canvas not found");
canvas.getContext("2d"); // Safe

// ✅ CORRECT: Proper event typing
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  const button = event.currentTarget; // Correctly typed
  button.disabled = true;
}
```

##### 3) Validate → Then Trust (Zod/Valibot/io-ts)

```typescript
import { z } from 'zod';

// ✅ CORRECT: Runtime validation with Zod
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional()
});

const user = UserSchema.parse(jsonData); // user is correctly typed and validated

// ✅ CORRECT: Safe parsing with error handling
try {
  const user = UserSchema.parse(jsonData);
  // user is now safely typed as User
} catch (error) {
  console.error('Invalid user data:', error);
}
```

##### 4) `satisfies` to Check Shape Without Lying

```typescript
// ✅ CORRECT: satisfies for shape checking
const config = {
  mode: "dark",
  debug: false,
  apiUrl: "https://api.example.com"
} as const satisfies {
  mode: "dark" | "light";
  debug: boolean;
  apiUrl: string;
};

// ✅ CORRECT: satisfies with type inference
const theme = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d"
  },
  spacing: {
    small: "8px",
    medium: "16px"
  }
} satisfies Record<string, Record<string, string>>;
```

##### 5) Assertion Functions (Make Assertions Explicit)

```typescript
// ✅ CORRECT: Assertion function
function assertCanvas(x: Element | null): asserts x is HTMLCanvasElement {
  if (!(x instanceof HTMLCanvasElement)) {
    throw new Error("Element is not a canvas");
  }
}

const node = document.getElementById("main_canvas");
assertCanvas(node); // Throws if not canvas
node.getContext("2d"); // Safe after assertion

// ✅ CORRECT: Assertion function for non-null
function assertNonNull<T>(value: T | null | undefined): asserts value is T {
  if (value == null) {
    throw new Error("Value is null or undefined");
  }
}

const element = document.getElementById("input");
assertNonNull(element);
element.value; // Safe, element is not null
```

#### When `as` Is Acceptable (Rare, Deliberate)

```typescript
// ✅ ACCEPTABLE: as const to preserve literal types
const colors = ["red", "green", "blue"] as const;
type Color = typeof colors[number]; // "red" | "green" | "blue"

// ✅ ACCEPTABLE: Branding after validation
type UserId = string & { readonly __brand: 'UserId' };
function createUserId(id: string): UserId {
  if (!id) throw new Error("Invalid user ID");
  return id as UserId;
}

// ✅ ACCEPTABLE: Interop edges (keep local and documented)
// @ts-ignore - Third-party library type mismatch, verified at runtime
const result = legacyLibrary.method(data) as ExpectedType;
```

### 🌿 Power Usage

#### Generics

```typescript
// ✅ CORRECT: Generic functions
function identity<T>(value: T): T {
  return value;
}

function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

// ✅ CORRECT: Generic constraints
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): T {
  console.log(item.length);
  return item;
}

// ✅ CORRECT: Generic with default
function createStore<T = Record<string, any>>(initialData: T): Store<T> {
  return new Store(initialData);
}
```

#### Generic Components

```typescript
// ✅ CORRECT: Generic React components
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

function List<T>({ items, renderItem, keyExtractor, emptyMessage }: ListProps<T>) {
  if (items.length === 0) {
    return <div>{emptyMessage || "No items"}</div>;
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

// Usage
<List
  items={users}
  renderItem={(user) => <UserCard user={user} />}
  keyExtractor={(user) => user.id}
  emptyMessage="No users found"
/>
```

#### Utility Types

```typescript
// ✅ CORRECT: Built-in utility types
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

// Partial<T> - Make all properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; isActive?: boolean; }

// Pick<T, K> - Pick specific properties
type UserBasicInfo = Pick<User, 'id' | 'name' | 'email'>;
// { id: number; name: string; email: string; }

// Omit<T, K> - Exclude specific properties
type UserWithoutId = Omit<User, 'id'>;
// { name: string; email: string; age: number; isActive: boolean; }

// Record<K, V> - Create object type with specific keys and values
type UserRoles = Record<string, string[]>;
// { [key: string]: string[]; }

// ✅ CORRECT: Custom utility types
type NonNullable<T> = T extends null | undefined ? never : T;
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

#### Discriminated Unions

```typescript
// ✅ CORRECT: Discriminated unions instead of boolean flags
type LoadingState = 
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; error: string };

function handleState(state: LoadingState) {
  switch (state.status) {
    case "idle":
      return "Ready to load";
    case "loading":
      return "Loading...";
    case "success":
      return `Loaded ${state.data.length} users`; // state.data is available
    case "error":
      return `Error: ${state.error}`; // state.error is available
  }
}

// ✅ CORRECT: Shape discriminated union
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rectangle"; width: number; height: number };

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius * shape.radius;
    case "square":
      return shape.side * shape.side;
    case "rectangle":
      return shape.width * shape.height;
  }
}
```

#### React Hooks with Types

```typescript
// ✅ CORRECT: Typed custom hooks
function useToggle(initial: boolean = false): [boolean, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}

// ✅ CORRECT: Generic hook
function useApi<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: string | null;
} {
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

  return { data, loading, error };
}

// ✅ CORRECT: Hook with ref
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

### 🌳 Advanced

#### Mapped Types

```typescript
// ✅ CORRECT: Built-in mapped types
type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;

// ✅ CORRECT: Custom mapped types
type Optional<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// ✅ CORRECT: Key remapping (TypeScript 4.1+)
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getId: () => number; getName: () => string; getEmail: () => string; ... }
```

#### Conditional Types & Infer

```typescript
// ✅ CORRECT: Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;
type IsArray<T> = T extends any[] ? true : false;

// ✅ CORRECT: Infer keyword
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// ✅ CORRECT: Flatten array type
type Flatten<T> = T extends (infer U)[] ? U : T;

// ✅ CORRECT: Extract promise type
type Awaited<T> = T extends Promise<infer U> ? U : T;
```

#### Template Literal Types

```typescript
// ✅ CORRECT: Template literal types
type Theme = "light" | "dark";
type ThemeClass = `theme-${Theme}`; // "theme-light" | "theme-dark"

type EventName = "click" | "hover" | "focus";
type HandlerName = `on${Capitalize<EventName>}`; // "onClick" | "onHover" | "onFocus"

// ✅ CORRECT: Advanced template literals
type Path<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ? K | `${K}.${Path<T[K], Exclude<keyof T[K], keyof any[]>>}`
      : K | `${K}.${Path<T[K]>}`
    : K
  : never;
```

#### Polymorphic Components

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

#### Type-Safe State Machines

```typescript
// ✅ CORRECT: Type-safe state machine
type State = 
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: Error };

type Action = 
  | { type: "FETCH" }
  | { type: "SUCCESS"; data: string }
  | { type: "ERROR"; error: Error }
  | { type: "RESET" };

function stateMachine(state: State, action: Action): State {
  switch (state.status) {
    case "idle":
      if (action.type === "FETCH") {
        return { status: "loading" };
      }
      return state;
    
    case "loading":
      if (action.type === "SUCCESS") {
        return { status: "success", data: action.data };
      }
      if (action.type === "ERROR") {
        return { status: "error", error: action.error };
      }
      return state;
    
    case "success":
    case "error":
      if (action.type === "RESET") {
        return { status: "idle" };
      }
      return state;
    
    default:
      return state;
  }
}
```

### ✅ Best Practices & Recommendations

#### Essential Rules

1. **Use the Static Kit** and keep all rules enabled by default
2. **❌ Never use `any`** → ✅ prefer generics or `unknown` with validation
3. **Prefer `type` for unions**, `interface` for objects
4. **Leverage utility types**: `Partial`, `Pick`, `Omit`, `Record`
5. **Use discriminated unions** instead of boolean flags
6. **Favor immutability**: `readonly`, `Readonly<T>`
7. **Keep types small & composable** (preferably in their own folder)
8. **Always type React props, state, and hooks**
9. **Enable strict mode** in `tsconfig.json` from the start
10. **Use lint** (static kit) with TypeScript rules enabled
11. **Avoid `as`** unless you just proved the type at runtime
12. **JS with defensive programming** is always preferable to TS with `any`

#### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

#### Code Organization

```typescript
// ✅ CORRECT: Separate types file
// types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export type UserRole = "admin" | "user" | "guest";

// ✅ CORRECT: Component with imported types
import { User, UserRole } from "../types/user";

interface UserCardProps {
  user: User;
  role: UserRole;
}
```

---

## 🤖 AI Development Guidelines

### Essential TypeScript Rules for AI Code Generation

1. **Always use explicit typing**: Never use `any`, prefer specific types or `unknown`
2. **Enable strict mode**: Use strict TypeScript configuration
3. **Use type guards**: Implement runtime validation with type narrowing
4. **Prefer interfaces for objects**: Use `interface` for object shapes, `type` for unions
5. **Leverage utility types**: Use `Partial`, `Pick`, `Omit`, `Record` for transformations
6. **Use discriminated unions**: Replace boolean flags with discriminated unions
7. **Implement proper error handling**: Use `Result` types or proper exception handling
8. **Type React components**: Always type props, state, and hooks
9. **Use generics appropriately**: Create reusable, type-safe components and functions
10. **Avoid type assertions**: Prefer type guards, validation, and proper typing

### Type Safety Checklist

- [ ] All variables are explicitly typed (no `any`)
- [ ] Strict TypeScript configuration is enabled
- [ ] All React props and state are typed
- [ ] Custom hooks have proper return types
- [ ] Error handling uses proper types
- [ ] API responses are validated and typed
- [ ] Utility types are used for transformations
- [ ] Discriminated unions replace boolean flags
- [ ] Type guards are used for runtime validation
- [ ] Generic components are properly constrained

### Common Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Using 'any'
const data: any = fetchData();

// ❌ WRONG: Type assertions without validation
const user = JSON.parse(json) as User;

// ❌ WRONG: Boolean flags instead of discriminated unions
interface State {
  loading: boolean;
  error: boolean;
  data: string | null;
}

// ❌ WRONG: Untyped React components
function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Recommended Patterns

```typescript
// ✅ CORRECT: Proper typing
const data: UserData = fetchData();

// ✅ CORRECT: Validation with type guards
const user = isUser(JSON.parse(json)) ? JSON.parse(json) : null;

// ✅ CORRECT: Discriminated unions
type State = 
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: string };

// ✅ CORRECT: Typed React components
interface ButtonProps {
  label: string;
  onClick: () => void;
}
function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

---

## ⚖️ Moral of the Blueprint

- **Labels keep rooms clear** (types)
- **Utilities help rearrange furniture quickly** (utility types)
- **Advanced types are hidden wiring** that makes everything flexible and safe

**👉 Clean, typed code = a house that grows without collapsing.**

TypeScript, as a static type checker, together with a linter, forms a strong defensive layer against runtime bugs — ensuring our code stays readable, reliable, and maintainable. These two tools are mandatory foundations: we cannot start development without them.

**⚠️ JavaScript with defensive programming strategy is always preferable to TypeScript with `any`. Typing everything poorly is worse than not typing at all (huge technical debts and runtime issues).**
