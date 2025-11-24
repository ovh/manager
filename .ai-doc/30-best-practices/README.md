# Best Practices

This directory contains code quality guidelines and automated checks for the Manager codebase.

## Files

| File | Purpose |
|------|---------|
| [code-smell-detector.yaml](code-smell-detector.yaml) | Patterns to detect anti-patterns and common mistakes |

## Code Smell Detector

### Severity Levels

| Level | Action Required |
|-------|-----------------|
| **CRITICAL** | Must fix before merge |
| **HIGH** | Should fix before merge |
| **MEDIUM** | Fix when convenient |
| **LOW** | Nice to fix |

### Quick Reference

#### Critical Smells (Must Fix)

| Smell | Detection | Fix |
|-------|-----------|-----|
| useState for server data | `useState` + `fetch` | Use `useQuery` |
| Missing loading state | `useQuery` without `isLoading` | Add loading check |
| Missing error handling | `useQuery` without `error` | Add error handling |
| Hardcoded strings | UI text without `t()` | Use translations |
| Wrong API pattern | v6 for AAPI endpoints | Match API client |
| Missing query invalidation | `useMutation` without `invalidateQueries` | Add onSuccess |
| Uncontrolled ODS input | `<OdsInput>` without Controller | Wrap with Controller |

#### High Priority Smells

| Smell | Detection | Fix |
|-------|-----------|-----|
| Inline object in JSX | `columns={[...]}` | Use useMemo |
| Missing key prop | `.map()` without key | Add unique key |
| Window location | `window.location.href` | Use navigate() |
| Missing success notification | mutation without addSuccess | Add notification |

#### Migration-Specific Smells

| Smell | Detection | Fix |
|-------|-----------|-----|
| AngularJS leftover | `$scope`, `$state`, `OvhApi` | Remove all references |
| Different page size | pageSize != original | Match exact size |
| Missing feature | Fewer routes/actions | Implement all features |
| Missing data transformation | No prepare* hooks | Create usePrepare* |

## How AI Should Use This

1. **After writing code**: Scan for patterns in the YAML file
2. **Before declaring complete**: Run all critical smell checks
3. **In code review**: Flag any detected smells
