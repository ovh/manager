# Case Studies

> @ai-purpose: Real-world migration examples with challenges, solutions, and lessons learned

## Available Case Studies

| Case Study | Complexity | Key Lessons |
|------------|------------|-------------|
| [nasha-migration-case-study.md](nasha-migration-case-study.md) | Medium | AAPI vs v6, data transformations, nested resolves |

## How AI Should Use Case Studies

1. **Before starting a migration**: Read relevant case studies for similar modules
2. **When facing a challenge**: Search case studies for similar problems
3. **After completing migration**: Compare approach with case studies

## Common Patterns from Case Studies

### Challenge Types

| Challenge | Frequency | Solution Reference |
|-----------|-----------|-------------------|
| AAPI vs v6 confusion | Very Common | Nasha Case Study - Challenge 1 |
| Missing data transformation | Common | Nasha Case Study - Challenge 2 |
| Nested resolve dependencies | Common | Nasha Case Study - Challenge 3 |
| Filter/pipe migration | Common | Nasha Case Study - Challenge 4 |
| Notification service | Very Common | Nasha Case Study - Challenge 5 |
| Modal parameters | Common | Nasha Case Study - Challenge 6 |

### Quick Solutions

#### AAPI vs v6
```typescript
// Check AngularJS source for API type indicators:

// Direct API method calls:
// .Aapi() → use aapi client
// .v6() → use v6 client

// OvhHttp configuration:
// rootPath: '2api' → use aapi client
// rootPath: 'apiv6' → use v6 client

// $http service configuration:
// serviceType: 'aapi' → use aapi client
// serviceType: 'apiv6' → use v6 client
```

#### Data Transformations
```typescript
// Create usePrepare* hook for each prepare* function
const prepareData = usePrepareData();
const transformed = prepareData(rawApiData);
```

#### Nested Dependencies
```typescript
// Use enabled option
const { data: parent } = useParentQuery();
const { data: child } = useChildQuery({ enabled: !!parent });
```

#### Notifications
```typescript
// Alerter.success → addSuccess
// Alerter.error → addError
const { addSuccess, addError } = useNotifications();
```

## Adding New Case Studies

When completing a migration, document:

1. **Overview** - Module name, source/target paths, complexity
2. **Scope Analysis** - Feature inventory, state count, API count
3. **Challenges** - Problems encountered with wrong/correct approaches
4. **Lessons Learned** - Key takeaways for future migrations
5. **Final Metrics** - Code comparison, parity verification
