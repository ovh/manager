---
title: Build & Tooling Documentation
last_update: 2025-01-27
tags: [tooling, build, eslint, vite, ci-cd, development]
ai: true
---

# Build & Tooling Documentation

## 🧭 Purpose

This directory contains documentation for **build-time tooling and development infrastructure** used in the OVHcloud Manager ecosystem. These tools run during development and build processes, not at runtime.

For **runtime dependencies** (React libraries, API clients, etc.), see [../20-dependencies/](../20-dependencies/).

## 📦 What's in This Directory

### Build Configuration

- **[manager-vite-config.md](./manager-vite-config.md)** - Vite build and dev server configuration
  - Build optimization
  - Development server setup
  - Plugin configuration
  - Environment-specific settings

### Code Quality & Linting

- **[manager-static-analysis-kit.md](./manager-static-analysis-kit.md)** - ESLint and static analysis
  - ESLint configuration
  - TypeScript analysis
  - React-specific rules
  - Accessibility validation
  - Code quality metrics

### HTTP Infrastructure

- **[request-tagger.md](./request-tagger.md)** - HTTP request tagging (automatic)
  - Request tracing headers
  - Navigation tracking
  - Request correlation
  - **Note**: This is mostly automatic and transparent; rarely needs manual configuration

---

## 🤖 AI Usage Guidelines

### When to Read These Docs

❌ **DON'T** reference these docs when:
- Writing React components
- Implementing features
- Making API calls
- Building UI
- Managing state

✅ **DO** reference these docs when:
- Setting up new project (initial config)
- Configuring build pipeline
- Troubleshooting build issues
- Setting up CI/CD
- Understanding linting rules
- Investigating request tracing issues

### Priority: LOW for Feature Development

These docs are **LOW PRIORITY** for day-to-day coding. Focus on [../20-dependencies/](../20-dependencies/) instead.

---

## 📋 Quick Reference

### I need to...

| Task | Read This | Notes |
|------|-----------|-------|
| Fix ESLint errors | [manager-static-analysis-kit.md](./manager-static-analysis-kit.md) | Understand linting rules |
| Configure build | [manager-vite-config.md](./manager-vite-config.md) | Vite settings |
| Debug request headers | [request-tagger.md](./request-tagger.md) | HTTP tracing |
| Setup new project | All 3 docs | Initial setup only |
| **Write React code** | **[../20-dependencies/](../20-dependencies/)** | Use dependencies docs instead |

---

## 🔗 Related Documentation

### For Coding
- [Dependencies Index](../20-dependencies/README.md) - Runtime dependencies
- [Best Practices](../30-best-practices/) - Coding standards
- [React Patterns](../30-best-practices/frontend-react-patterns.md)

### For Architecture
- [Architecture Overview](../10-architecture/)
- [React uApp Blueprint](../10-architecture/react-uapp-blueprint.md)

### For Setup
- [Quick Start Guide](../90-quickstart/)
- [Manager React Core Application](../20-dependencies/manager-react-core-application.md)

---

## ⚖️ The Tooling's Moral

- **Build tools** run at build-time, not runtime
- **Most tooling is pre-configured** - rarely needs changes
- **Focus on coding** with runtime dependencies
- **Reference tooling docs** only when needed for setup/debugging

**👉 Good separation keeps coding docs focused and relevant.**
