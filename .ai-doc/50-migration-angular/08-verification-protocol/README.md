# Verification Protocol

> @ai-purpose: Mandatory verification steps before declaring migration complete

## Files

| File | Purpose |
|------|---------|
| [mandatory-verification-steps.yaml](mandatory-verification-steps.yaml) | Complete verification checklist with actions and criteria |

## How AI Must Use This

**NEVER declare a migration complete without running through this protocol.**

### Quick Verification Workflow

```
1. PRE-FLIGHT
   ├── Source code accessible? ✓
   ├── React compiles? ✓
   └── Tests pass? ✓

2. ROUTE VERIFICATION
   ├── Count routes (AngularJS vs React)
   ├── Compare URL patterns
   └── Check parameters

3. API VERIFICATION
   ├── Count API calls
   ├── Compare endpoints
   ├── Check methods (GET/POST/PUT/DELETE)
   └── Verify data transformations

4. COMPONENT VERIFICATION
   ├── Compare datagrid columns
   ├── Compare action menus
   ├── Compare form fields
   └── Compare modals

5. FEATURE VERIFICATION
   ├── Test navigation flows
   ├── Test CRUD operations
   ├── Test error handling
   └── Test loading states

6. TRANSLATION VERIFICATION
   ├── All keys exist?
   ├── No hardcoded strings?
   └── Multiple locales?

7. CODE QUALITY
   ├── TypeScript passes?
   ├── ESLint passes?
   └── No code smells?

8. GENERATE REPORT
```

## Summary Tables

### Verification Categories

| Category | Severity | Checks |
|----------|----------|--------|
| Routes | Critical | 4 |
| API | Critical | 5 |
| Components | High | 5 |
| Features | Critical | 4 |
| Translations | Critical | 3 |
| Tracking | Medium | 2 |
| Code Quality | Critical | 4 |

### Critical Checks (Must Pass)

| Check | Description |
|-------|-------------|
| Route count | Same number of routes |
| Route URLs | Same URL patterns |
| API endpoints | Same API endpoints |
| API methods | Same HTTP methods |
| Form fields | Same form inputs |
| CRUD operations | All work correctly |
| TypeScript | Compiles without errors |

## Report Template

After verification, generate a report using the template in the YAML file:

```markdown
# Migration Verification Report

**Source**: packages/manager/modules/nasha
**Target**: packages/manager/apps/bmc-nasha
**Date**: 2025-01-27

## Summary

| Category | Status | Issues |
|----------|--------|--------|
| Routes | ✅ | 0 |
| API | ✅ | 0 |
| Components | ⚠️ | 1 |
| Features | ✅ | 0 |
| Translations | ✅ | 0 |
| Quality | ✅ | 0 |

## Conclusion

Migration is: **COMPLETE** with 1 minor issue
```
