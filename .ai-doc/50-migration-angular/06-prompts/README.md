---
title: AI-Optimized Migration Prompts
last_update: 2025-01-27
tags: [prompts, ai, migration, automation]
ai: true
---

# AI-Optimized Migration Prompts

## 🧭 Purpose

This directory contains **copy-paste ready prompts** optimized for AI assistants to execute migration tasks. Each prompt is self-contained with clear inputs, actions, and expected outputs.

## 📋 Prompt Catalog

### Automated Migration (Full Flow)

| Prompt File | Purpose | When to Use |
|-------------|---------|-------------|
| [01-analyze-and-structure.prompt.md](./01-analyze-and-structure.prompt.md) | Analyze source & generate structure | Start of automated migration |
| [02-implement-features.prompt.md](./02-implement-features.prompt.md) | Implement all features | After structure is ready |
| [03-validate-migration.prompt.md](./03-validate-migration.prompt.md) | Validate 100% parity | After implementation |

### Manual US-by-US Migration

| Prompt File | Purpose | When to Use |
|-------------|---------|-------------|
| [10-identify-user-stories.prompt.md](./10-identify-user-stories.prompt.md) | Extract user stories from source | Start of manual migration |
| [11-implement-single-us.prompt.md](./11-implement-single-us.prompt.md) | Implement one user story | For each US |
| [12-validate-single-us.prompt.md](./12-validate-single-us.prompt.md) | Validate one US | After each US implementation |

### Pattern Lookup & Reference

| Prompt File | Purpose | When to Use |
|-------------|---------|-------------|
| [20-lookup-routing-pattern.prompt.md](./20-lookup-routing-pattern.prompt.md) | Find routing patterns | Need routing help |
| [21-lookup-api-pattern.prompt.md](./21-lookup-api-pattern.prompt.md) | Find API patterns | Need API help |
| [22-lookup-component-pattern.prompt.md](./22-lookup-component-pattern.prompt.md) | Find UI component patterns | Need UI help |

## 🚀 How to Use These Prompts

### For Users

1. **Choose the right prompt** based on your need (see tables above)
2. **Copy the entire prompt** from the markdown file
3. **Replace placeholders** like `{module-name}` with actual values
4. **Paste to AI assistant** and let it execute
5. **Review output** and proceed to next prompt if applicable

### For AI Assistants

Each prompt file contains:
- **Clear objective** - What to accomplish
- **Required inputs** - What files/data are needed
- **Step-by-step actions** - Exact steps to execute
- **Expected outputs** - What files/data to produce
- **References** - Links to detailed documentation
- **Validation criteria** - How to verify success

## 📐 Prompt Structure

All prompts follow this structure:

```markdown
# [Prompt Name]

## Objective
[Single sentence describing the goal]

## Context
[Brief context about this step in the workflow]

## Prerequisites
- [ ] Prerequisite 1
- [ ] Prerequisite 2

## Inputs
- Input file 1 (@path/to/file)
- Input file 2 (@path/to/file)

## Actions
1. Step 1 with clear instruction
2. Step 2 with clear instruction
3. ...

## Expected Outputs
- Output file 1 (path/to/output)
- Output file 2 (path/to/output)

## Validation
- [ ] Check 1
- [ ] Check 2

## References
- [Doc 1](../path/to/doc)
- [Doc 2](../path/to/doc)

## Next Steps
After completion, proceed to: [Next Prompt](./next-prompt.md)
```

## 🎯 Prompt Selection Guide

### Scenario 1: Full Automated Migration

```
User says: "Migrate module X to React automatically"

Prompts to use (in order):
1. 01-analyze-and-structure.prompt.md
2. 02-implement-features.prompt.md
3. 03-validate-migration.prompt.md
```

### Scenario 2: Manual US-by-US

```
User says: "Help me migrate user story by user story"

Prompts to use (in order):
1. 10-identify-user-stories.prompt.md
2. For each US:
   - 11-implement-single-us.prompt.md
   - 12-validate-single-us.prompt.md
```

### Scenario 3: Pattern Lookup

```
User says: "How do I migrate routing?" or "What's the pattern for X?"

Prompts to use (single):
- 20-lookup-routing-pattern.prompt.md (for routing)
- 21-lookup-api-pattern.prompt.md (for API)
- 22-lookup-component-pattern.prompt.md (for UI)
```

## 🤖 AI Usage Guidelines

### When Executing Prompts

1. **Read the entire prompt** before starting
2. **Verify all prerequisites** are met
3. **Check all inputs exist** and are readable
4. **Execute actions sequentially** as listed
5. **Produce all expected outputs**
6. **Validate before marking complete**
7. **Reference docs** when unclear

### Error Handling

If a prompt fails:
1. Check prerequisites again
2. Verify inputs are correct
3. Check references for clarification
4. Report specific error to user
5. Don't proceed to next prompt

### Output Quality

All outputs must:
- Be complete (no TODOs unless specified)
- Follow project conventions
- Use correct imports
- Include proper types
- Have no syntax errors
- Pass validation checks

---

## ⚖️ The Prompts' Moral

- **Copy-paste ready** reduces ambiguity
- **Clear structure** ensures consistency
- **Explicit validation** catches errors early
- **Sequential flow** prevents confusion

**👉 Good prompts make AI execution predictable and reliable.**
