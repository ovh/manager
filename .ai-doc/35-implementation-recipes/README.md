# Implementation Recipes

> @ai-purpose: Complete, copy-paste-ready implementations for common features

## Available Recipes

| Recipe | Complexity | Use When |
|--------|------------|----------|
| [search-filter-pagination.md](search-filter-pagination.md) | High | Building data tables with search, filters, and pagination |
| [crud-operations.md](crud-operations.md) | High | Implementing Create/Read/Update/Delete functionality |

## How to Use These Recipes

1. **Identify the feature pattern** you need to implement
2. **Copy the recipe structure** - file organization, hooks, components
3. **Adapt names and types** - replace `Resource` with your entity name
4. **Customize fields** - add/remove form fields as needed
5. **Follow the verification checklist** - ensure all requirements met

## Recipe Structure

Each recipe includes:

```
## Overview
Brief description of what the recipe implements

## Prerequisites
- Dependencies needed
- Setup required

## Step 1-N: Implementation
- Complete code examples
- Type definitions
- Hook implementations
- Component code

## Verification Checklist
- [ ] Feature works correctly
- [ ] Edge cases handled
- [ ] Error states covered

## Common Mistakes to Avoid
- What NOT to do
- Why it's wrong
- Correct alternative
```

## Quick Reference

### When to Use Each Recipe

| Feature | Recipe |
|---------|--------|
| List with search | [search-filter-pagination.md](search-filter-pagination.md) |
| List with filters | [search-filter-pagination.md](search-filter-pagination.md) |
| Paginated table | [search-filter-pagination.md](search-filter-pagination.md) |
| Create form modal | [crud-operations.md](crud-operations.md) |
| Edit form modal | [crud-operations.md](crud-operations.md) |
| Delete confirmation | [crud-operations.md](crud-operations.md) |
| Detail page | [crud-operations.md](crud-operations.md) |

## Adding New Recipes

When adding a new recipe:

1. Create `{feature-name}.md` in this directory
2. Follow the template structure above
3. Include complete, working code examples
4. Add verification checklist
5. Update this README
