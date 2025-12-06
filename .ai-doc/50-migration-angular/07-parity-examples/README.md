# Perfect Parity Examples

> @ai-purpose: Reference examples for iso-functional migrations

## Files

| File | Purpose |
|------|---------|
| [perfect-parity-examples.md](perfect-parity-examples.md) | Complete before/after examples with checklists |

## Quick Summary

### What "Perfect Parity" Means

1. **Same functionality** - Every feature in AngularJS exists in React
2. **Same behavior** - Loading states, errors, notifications work identically
3. **Same data** - API calls return and display the same data
4. **Same UX** - User workflow is unchanged

### Examples Covered

| Pattern | AngularJS | React |
|---------|-----------|-------|
| Route with resolve | `$stateProvider.state` + `resolve` | `useParams` + `useQuery` |
| Form submission | Controller + `$promise` | `useForm` + `useMutation` |
| Datagrid with actions | `oui-datagrid` + `oui-action-menu` | `Datagrid` + `ActionMenu` |

### Common Violations

1. **Missing loading state** → Add `isLoading` check
2. **Wrong API pattern** → Match v6/AAPI/Iceberg
3. **Missing data transformation** → Keep `prepare*` functions
4. **Missing notification** → Add `addSuccess`/`addError`
5. **Missing query invalidation** → Add `onSuccess` handler
6. **Wrong navigation** → Use `navigate()` not `window.location`
7. **Missing translation** → Use `t()` for all strings
8. **Different page size** → Match exact pagination config
