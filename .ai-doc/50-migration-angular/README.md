---
title: Migration AngularJS → React
last_update: 2025-01-27
tags: [migration, index, angularjs, react, ovhcloud, manager]
ai: true
---

# Migration AngularJS → React

## 🧭 Purpose

This directory contains **specialized guides** for migrating AngularJS modules to React in the OVHcloud Manager ecosystem. Each guide serves a specific purpose in the migration process.

## ⚙️ Context

**Core Principle**: **Right guide for the right need** - each guide serves a specific purpose in the migration process.

## 🚀 Quick Start

### For US Migration (Recommended)
1. **Read**: [us-migration-guide.md](./us-migration-guide.md) - **Strategy US par US**
2. **Implement**: [migration-patterns.md](./migration-patterns.md) - **AngularJS→React patterns**
3. **Code**: [30-best-practices/](../30-best-practices/) - **React patterns génériques**
4. **Validate**: [parity-validation-guide.md](./parity-validation-guide.md) - **Validation 100%**
5. **Document**: [migration-templates.md](./migration-templates.md) - **Templates PLAN.md, DoD**

### For Quick Pattern Lookup
1. **Start**: [migration-patterns.md](./migration-patterns.md) - **Patterns spécifiques**
2. **Code**: [30-best-practices/](../30-best-practices/) - **Patterns React**
3. **Validate**: [parity-validation-guide.md](./parity-validation-guide.md) - **Validation**

## 📘 Migration Guides

### 🎯 **Primary Guide**

#### **[us-migration-guide.md](./us-migration-guide.md)** - **Guide Principal**
- **Purpose**: Stratégie US par US avec 100% parity
- **When to use**: Pour toute migration AngularJS → React
- **Key features**:
  - Workflow 3 phases: Discovery → Migration → Validation
  - Checklist par US avec 100% parity
  - Anti-patterns et best practices
  - Références vers patterns et validation
- **Best for**: **Migration complète avec stratégie US**

### 🏗️ **Supporting Guides**

#### **[migration-patterns.md](./migration-patterns.md)** - **Patterns Migration**
- **Purpose**: Patterns spécifiques AngularJS → React
- **When to use**: Pendant l'implémentation
- **Key features**:
  - Mappings AngularJS → React (Controller→Hook, Service→Hook)
  - Patterns essentiels (List, Detail, Form)
  - Tableau de référence rapide
  - Anti-patterns migration
- **Best for**: **Implémentation des patterns de migration**

#### **[parity-validation-guide.md](./parity-validation-guide.md)** - **Validation Framework**
- **Purpose**: Framework de validation 100% parity
- **When to use**: Pour valider chaque US migré
- **Key features**:
  - Checklists visuelles, fonctionnelles, techniques
  - Patterns de tests de parity
  - Validation performance et accessibilité
  - Tests E2E par US
- **Best for**: **Validation complète de parity**

#### **[migration-templates.md](./migration-templates.md)** - **Templates**
- **Purpose**: Templates pour documentation migration
- **When to use**: Pour documenter la migration
- **Key features**:
  - Template PLAN.md
  - Template MIGRATION_NOTES.md
  - Template Definition of Done
  - Templates de validation
- **Best for**: **Documentation de migration**

## 📋 Guide Selection Matrix

| Need | Primary Guide | Supporting Guides |
|------|---------------|-------------------|
| **US Migration** | us-migration-guide.md | migration-patterns.md + parity-validation-guide.md |
| **Patterns Lookup** | migration-patterns.md | 30-best-practices/ |
| **Validation** | parity-validation-guide.md | us-migration-guide.md |
| **Documentation** | migration-templates.md | us-migration-guide.md |
| **React Patterns** | 30-best-practices/ | migration-patterns.md |

## 🚀 Migration Workflow

### Step 1: **Planning**
- Use [us-migration-guide.md](./us-migration-guide.md) for US analysis
- Use [migration-templates.md](./migration-templates.md) for PLAN.md

### Step 2: **Implementation**
- Use [migration-patterns.md](./migration-patterns.md) for AngularJS→React patterns
- Use [30-best-practices/](../30-best-practices/) for React patterns
- Use [Development Standards](../30-best-practices/development-standards.md) for quality

### Step 3: **Validation**
- Use [parity-validation-guide.md](./parity-validation-guide.md) for validation
- Use [us-migration-guide.md](./us-migration-guide.md) for US validation

## 📚 Additional Resources

### **Architecture & Dependencies**
- [Manager Architecture Overview](../10-architecture/api-overview.md)
- [React uApp Blueprint](../10-architecture/react-uapp-blueprint.md)
- [MUK Components](../20-dependencies/muk.md)

### **Patterns & Standards**
- [Development Standards](../30-best-practices/development-standards.md)
- [React Patterns](../30-best-practices/frontend-react-patterns.md)
- [TypeScript Cheat Sheet](../30-best-practices/typescript-cheatsheet.md)
- [HTML Accessibility Testing](../30-best-practices/html-accessibility-testing.md)

## 🎯 Best Practices

### **Guide Usage**
- **Start with us-migration-guide.md** for complete migration strategy
- **Use migration-patterns.md** for AngularJS→React specific patterns
- **Use 30-best-practices/** for React patterns génériques
- **Always validate** with parity-validation-guide.md
- **Document everything** with migration-templates.md

### **Migration Strategy**
- **US-first approach**: One user story at a time
- **100% parity**: Visual, functional, and technical
- **Incremental validation**: Validate each US before next
- **Complete documentation**: PLAN.md, MIGRATION_NOTES.md, DoD

## 🚫 Anti-Patterns to Avoid

```markdown
# ❌ WRONG: Using wrong guide
# Don't use migration-patterns.md for complete migration strategy

# ✅ CORRECT: Use appropriate guide
# Use us-migration-guide.md for complete migration strategy

# ❌ WRONG: Skipping validation
# Don't skip parity-validation-guide.md

# ✅ CORRECT: Always validate
# Use parity-validation-guide.md for all migrations
```

## ✅ Recommended Patterns

```markdown
# ✅ CORRECT: US-first approach
# 1. us-migration-guide.md for strategy
# 2. migration-patterns.md for patterns
# 3. parity-validation-guide.md for validation

# ✅ CORRECT: Quality-first approach
# 1. 30-best-practices/ for React patterns
# 2. migration-patterns.md for migration patterns
# 3. parity-validation-guide.md for validation
```

---

## 🤖 AI Development Guidelines

### Essential Guide Selection Rules for AI Code Generation

1. **Start with us-migration-guide.md** for complete migration strategy
2. **Use migration-patterns.md** for AngularJS→React specific patterns
3. **Use 30-best-practices/** for React patterns génériques
4. **Always validate** with parity-validation-guide.md
5. **Document everything** with migration-templates.md
6. **Follow US-first approach** for user story migrations
7. **Ensure 100% parity** for all migrations
8. **Use incremental validation** throughout migration

### Guide Selection Checklist

- [ ] Right guide selected for specific need
- [ ] Supporting guides identified
- [ ] Workflow followed correctly
- [ ] Validation planned
- [ ] Quality standards applied
- [ ] Documentation updated
- [ ] Team knowledge shared

---

## ⚖️ The Migration Index's Moral

- **Right guide for the right need** ensures efficient migration
- **US-first approach** guarantees complete functionality
- **100% parity** ensures identical user experience
- **Complete documentation** enables team knowledge sharing

**👉 Good guide selection is the foundation of successful migration.**
