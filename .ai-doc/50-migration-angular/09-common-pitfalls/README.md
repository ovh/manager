# Common Pitfalls Catalog

This directory contains a consolidated catalog of common mistakes and anti-patterns discovered during AngularJS → React migrations.

## Purpose

- **AI assistants**: Proactively check for these patterns during migration
- **Developers**: Learn from past mistakes before starting migration
- **Reviewers**: Use as a checklist during code review

## Files

| File | Description |
|------|-------------|
| [pitfalls-catalog.yaml](pitfalls-catalog.yaml) | Machine-readable catalog of all pitfalls |

## Quick Reference

### Most Critical Pitfalls

1. **Missing Loading States** - `useQuery` without `isLoading` check
2. **Wrong Query Invalidation** - Mutation without `invalidateQueries`
3. **Hardcoded Translations** - Text instead of `t()` calls
4. **Missing Error Handling** - No `isError` state handling
5. **Wrong API Pattern** - Using wrong API client (v6 vs aapi)

### How AI Should Use This

```typescript
// Before completing migration, check:
const pitfalls = loadYAML('pitfalls-catalog.yaml');

for (const pitfall of pitfalls.critical) {
  const matches = code.match(pitfall.detection_regex);
  if (matches) {
    warn(`Pitfall detected: ${pitfall.id}`);
    suggest(pitfall.fix_example);
  }
}
```

## Adding New Pitfalls

When a new pitfall is discovered during migration:

1. Add entry to `pitfalls-catalog.yaml`
2. Include detection regex
3. Provide fix example
4. Reference documentation
5. Log in `12-feedback/improvement-log.md`

## Related Documentation

- [Parity Validation Guide](../parity-validation-guide.md)
- [Perfect Parity Examples](../07-parity-examples/perfect-parity-examples.md)
- [Verification Protocol](../08-verification-protocol/)
