---
title: Dependencies Documentation Index
last_update: 2025-01-27
tags: [index, dependencies, react, ovhcloud, manager]
ai: true
---

# Dependencies Documentation Index

## 🧭 Purpose

This directory contains documentation for **runtime dependencies** used when coding React applications in the OVHcloud Manager ecosystem. These are the libraries and packages you'll actively use while writing application code.

For **build-time tooling** (ESLint, Vite, etc.), see [../25-tooling/](../25-tooling/).

## 📋 Documentation Categories

### 🎯 Core React Libraries (Essential)

**Use these when coding React components and features.**

| Documentation | Purpose | When to Use |
|---------------|---------|-------------|
| [react-router-dom.md](./react-router-dom.md) | Navigation & Routing | Defining routes, navigation, URL params |
| [tanstack-react-query.md](./tanstack-react-query.md) | Data Fetching & State | API calls, caching, mutations |
| [react-i18next.md](./react-i18next.md) | Internationalization | Translations, multi-language support |
| [react-hook-form.md](./react-hook-form.md) | Form Management | Forms, validation, user input |

### 🎨 UI & Styling (Essential)

**Use these for building user interfaces.**

| Documentation | Purpose | When to Use |
|---------------|---------|-------------|
| [muk.md](./muk.md) | MUK Components (Primary UI) | Building UI with Manager UI Kit |
| [ods-components.md](./ods-components.md) | ODS Components (Fallback) | When MUK doesn't have component |
| [tailwind-css.md](./tailwind-css.md) | CSS Framework | Styling, layout, responsive design |

### 🔌 OVHcloud Manager Integration (Essential)

**Use these for Manager-specific features.**

| Documentation | Purpose | When to Use |
|---------------|---------|-------------|
| [manager-core-api.md](./manager-core-api.md) | API Client | Making API calls (v6, v2, AAPI, Iceberg) |
| [manager-react-shell-client.md](./manager-react-shell-client.md) | Shell Integration | Tracking, navigation, shell features |
| [shell.md](./shell.md) | Shell Container | Understanding shell context |

### ⚙️ Configuration & Utils (Setup & Helpers)

**Use these for initial setup and utility functions.**

| Documentation | Purpose | When to Use |
|---------------|---------|-------------|
| [manager-config.md](./manager-config.md) | Environment Config | Accessing config, environment vars |
| [manager-core-utils.md](./manager-core-utils.md) | Utility Functions | Helper functions, formatters |
| [manager-react-core-application.md](./manager-react-core-application.md) | App Bootstrap | Initial app setup, providers |

---

## 🤖 AI Usage Guidelines

### When Coding Features

1. **Start with**: Core React Libraries (routing, data fetching, forms)
2. **For UI**: MUK first, ODS fallback, Tailwind for custom styling
3. **For API**: manager-core-api
4. **For i18n**: react-i18next
5. **For tracking**: manager-react-shell-client

### When Setting Up New App

1. **Read**: manager-react-core-application.md
2. **Configure**: manager-config.md
3. **Bootstrap**: Follow app setup patterns

### When to Use 25-tooling/

Only reference [../25-tooling/](../25-tooling/) when:
- Setting up build configuration
- Configuring ESLint/linting
- Understanding HTTP request tagging (automatic, rarely needs manual config)
- **NOT** when writing application code

---

## 📚 Quick Reference by Task

### Task: Create a new page with data fetching

**Read these docs:**
1. [react-router-dom.md](./react-router-dom.md) - Define route
2. [tanstack-react-query.md](./tanstack-react-query.md) - Fetch data
3. [manager-core-api.md](./manager-core-api.md) - API calls
4. [muk.md](./muk.md) - UI components
5. [manager-react-shell-client.md](./manager-react-shell-client.md) - Tracking

### Task: Create a form

**Read these docs:**
1. [react-hook-form.md](./react-hook-form.md) - Form management
2. [muk.md](./muk.md) or [ods-components.md](./ods-components.md) - Form components
3. [tanstack-react-query.md](./tanstack-react-query.md) - Submit mutation
4. [manager-core-api.md](./manager-core-api.md) - API endpoint

### Task: Add translations

**Read these docs:**
1. [react-i18next.md](./react-i18next.md) - Translation setup
2. [manager-config.md](./manager-config.md) - Language config

### Task: Style components

**Read these docs:**
1. [tailwind-css.md](./tailwind-css.md) - Utility classes
2. [muk.md](./muk.md) - MUK design system

### Task: Navigate between pages

**Read these docs:**
1. [react-router-dom.md](./react-router-dom.md) - Navigation
2. [manager-react-shell-client.md](./manager-react-shell-client.md) - Shell navigation

---

## 🚫 What's NOT in This Directory

### Build & Tooling (See [../25-tooling/](../25-tooling/))

- ESLint configuration → [../25-tooling/manager-static-analysis-kit.md](../25-tooling/manager-static-analysis-kit.md)
- Vite build config → [../25-tooling/manager-vite-config.md](../25-tooling/manager-vite-config.md)
- HTTP request tagging → [../25-tooling/request-tagger.md](../25-tooling/request-tagger.md)

### Architecture & Patterns (See [../10-architecture/](../10-architecture/))

- App architecture
- API overview
- React uApp blueprint

### Best Practices (See [../30-best-practices/](../30-best-practices/))

- Development standards
- React patterns
- TypeScript guidelines
- Accessibility testing

### Migration Guides (See [../50-migration-angular/](../50-migration-angular/))

- AngularJS to React migration
- Migration patterns
- Parity validation

---

## ⚖️ The Dependencies Index's Moral

- **Runtime dependencies** are for coding
- **Build-time tooling** is separate (25-tooling/)
- **Focus on what you need** for the task at hand
- **Start simple** with core libraries, add complexity as needed

**👉 Good organization helps AI find the right docs fast.**
