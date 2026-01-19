# Migration Diffs - Visual Side-by-Side Comparisons

This directory contains structured side-by-side comparisons of AngularJS → React code transformations.

## Purpose

- **AI assistants**: Use as reference patterns for code generation
- **Developers**: Understand exact transformations visually
- **Reviewers**: Verify migration correctness

## Files

| File | Pattern Category |
|------|-----------------|
| [routing-diffs.md](routing-diffs.md) | Routes, states, navigation |
| [api-diffs.md](api-diffs.md) | API calls, data fetching |
| [component-diffs.md](component-diffs.md) | UI components (Datagrid, Forms, Modals) |
| [state-diffs.md](state-diffs.md) | Controllers, services, state management |

## Format

Each diff follows this structure:

```markdown
## Pattern Name

### AngularJS
\`\`\`javascript
// Original code
\`\`\`

### React Equivalent
\`\`\`typescript
// Migrated code
\`\`\`

### Transformation Rules
1. Rule 1
2. Rule 2

### Notes
- Important considerations
```

## Quick Navigation

| Need to migrate... | See file |
|-------------------|----------|
| `$stateProvider.state()` | routing-diffs.md |
| `resolve` functions | routing-diffs.md |
| `redirectTo` | routing-diffs.md |
| `OvhApi*.Aapi()` | api-diffs.md |
| `iceberg().query()` | api-diffs.md |
| `$http.get/post` | api-diffs.md |
| `oui-datagrid` | component-diffs.md |
| `oui-field` / forms | component-diffs.md |
| Modal patterns | component-diffs.md |
| Controller | state-diffs.md |
| `$scope` | state-diffs.md |
| Service | state-diffs.md |

## Related Documentation

- [AngularJS React Mapping Guide](../angularjs-react-mapping-guide.md)
- [Migration Patterns](../migration-patterns.md)
- [Code Templates](../code-templates.md)
