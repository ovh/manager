---
title: Development Commands Reference
last_update: 2025-01-23
tags: [development, commands, yarn, workspace, ovhcloud, manager]
ai: true
---

# Development Commands Reference

## 🚨 Common Mistake

```bash
# ❌ DON'T: Navigate to app directory
cd packages/manager/apps/bmc-nasha && yarn start

# ✅ DO: Use workspace filters from project root
yarn --filter="@ovh-ux/manager-bmc-nasha-app" start
```

---

## 🚀 Essential Commands

### Development
```bash
# Start app
yarn --filter="@ovh-ux/manager-bmc-nasha-app" start

# Build app
yarn --filter="@ovh-ux/manager-bmc-nasha-app" build

# Test app
yarn --filter="@ovh-ux/manager-bmc-nasha-app" test
yarn --filter="@ovh-ux/manager-bmc-nasha-app" test:coverage
```

### Linting
```bash
# Lint specific app
yarn --filter="@ovh-ux/manager-bmc-nasha-app" lint:modern:fix

# Lint all apps
yarn pm:lint:fix
```

### Workspace Management
```bash
# Add dependency
yarn workspace @ovh-ux/manager-bmc-nasha-app add <package>

# List workspaces
yarn workspaces list
```

---

## 📝 Commit Conventions

```bash
# Migration commits
feat(<scope>): migrate <component> from AngularJS
fix(<scope>): fix <feature> parity with AngularJS
test(<scope>): add tests for migrated <component>

# Examples
feat(bmc-nasha): migrate listing page from AngularJS
fix(listing): fix column visibility parity
test(hooks): add unit tests for listing hooks
```

---

## 🔗 Related Documentation

- [Branching and Commits](./branching-and-commits.md)
- [US Migration Guide](../50-migration-angular/us-migration-guide.md)
