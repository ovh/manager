# AI Documentation Index

> @ai-purpose: Main index for AI-optimized documentation to enable expert-level migrations

## Directory Structure

```
.ai-doc/
├── 10-architecture/          # Codebase architecture and patterns
├── 15-expert-decisions/      # Decision matrices for technical choices
├── 20-dependencies/          # Runtime dependencies (React Query, MUK, etc.)
├── 25-tooling/               # Build-time tools (Vite, ESLint, etc.)
├── 30-best-practices/        # Code quality and smell detection
├── 35-implementation-recipes/ # Complete feature recipes
├── 50-migration-angular/     # AngularJS → React migration guides
│   ├── 01-workflows/         # Decision trees and prompts
│   ├── 02-patterns/          # Pattern detection (YAML)
│   ├── 05-validation/        # Parity checklists
│   ├── 06-prompts/           # Structured AI prompts
│   ├── 07-parity-examples/   # Before/after examples
│   └── 08-verification-protocol/ # Mandatory verification steps
└── 60-case-studies/          # Real migration examples
```

## Quick Navigation by Task

### I want to...

| Task | Go to |
|------|-------|
| **Start a new migration** | [50-migration-angular/01-workflows/](50-migration-angular/01-workflows/) |
| **Choose the right pattern** | [15-expert-decisions/](15-expert-decisions/) |
| **Implement a complex feature** | [35-implementation-recipes/](35-implementation-recipes/) |
| **Check my code quality** | [30-best-practices/](30-best-practices/) |
| **Verify migration is complete** | [50-migration-angular/08-verification-protocol/](50-migration-angular/08-verification-protocol/) |
| **Learn from real examples** | [60-case-studies/](60-case-studies/) |

### For specific patterns...

| Pattern | Location |
|---------|----------|
| State management (useState vs useQuery) | [15-expert-decisions/expert-decision-matrix.yaml](15-expert-decisions/expert-decision-matrix.yaml) |
| API calls (v6 vs AAPI vs Iceberg) | [15-expert-decisions/expert-decision-matrix.yaml](15-expert-decisions/expert-decision-matrix.yaml) |
| Form handling | [20-dependencies/react-hook-form.md](20-dependencies/react-hook-form.md) |
| Datagrid with search/filter/pagination | [35-implementation-recipes/search-filter-pagination.md](35-implementation-recipes/search-filter-pagination.md) |
| CRUD operations | [35-implementation-recipes/crud-operations.md](35-implementation-recipes/crud-operations.md) |
| AngularJS → React mapping | [50-migration-angular/02-patterns/](50-migration-angular/02-patterns/) |

## Migration Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MIGRATION WORKFLOW                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. ANALYZE                                                             │
│     └─> 50-migration-angular/06-prompts/01-analyze-and-structure.md     │
│                                                                         │
│  2. DECIDE                                                              │
│     └─> 15-expert-decisions/expert-decision-matrix.yaml                 │
│                                                                         │
│  3. IMPLEMENT                                                           │
│     ├─> 35-implementation-recipes/ (for complex features)               │
│     ├─> 50-migration-angular/07-parity-examples/ (for reference)        │
│     └─> 50-migration-angular/06-prompts/02-implement-features.md        │
│                                                                         │
│  4. CHECK                                                               │
│     └─> 30-best-practices/code-smell-detector.yaml                      │
│                                                                         │
│  5. VERIFY                                                              │
│     └─> 50-migration-angular/08-verification-protocol/                  │
│                                                                         │
│  6. LEARN                                                               │
│     └─> 60-case-studies/ (problems & solutions)                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Key Files Summary

| File | Purpose | Priority |
|------|---------|----------|
| `15-expert-decisions/expert-decision-matrix.yaml` | Technical decision trees | 🔥 CRITICAL |
| `30-best-practices/code-smell-detector.yaml` | Anti-pattern detection | 🔥 CRITICAL |
| `50-migration-angular/07-parity-examples/perfect-parity-examples.md` | Before/after examples | 🔥 CRITICAL |
| `50-migration-angular/08-verification-protocol/mandatory-verification-steps.yaml` | Verification checklist | 🔥 CRITICAL |
| `35-implementation-recipes/crud-operations.md` | CRUD recipe | ⚡ HIGH |
| `35-implementation-recipes/search-filter-pagination.md` | Data table recipe | ⚡ HIGH |
| `60-case-studies/nasha-migration-case-study.md` | Real example | ⚡ HIGH |

## How to Use This Documentation

### As an AI Assistant

1. **Before migration**: Read expert-decision-matrix.yaml and relevant case study
2. **During implementation**: Consult recipes and parity examples
3. **After coding**: Run code smell detector checks
4. **Before completion**: Follow verification protocol completely

### Golden Rules

1. **Never guess API patterns** - Check if original used AAPI or v6
2. **Never skip data transformations** - Migrate all prepare* functions
3. **Never change pagination** - Keep exact same page sizes
4. **Never forget notifications** - Users expect feedback on actions
5. **Always verify** - Run full verification protocol before declaring done
