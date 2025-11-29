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

### For Automated Migration (Recommended for AI) ⭐ NEW
0. **Analyze**: [90-quickstart/pre-migration-analysis.md](../90-quickstart/pre-migration-analysis.md) - **Automated detection patterns**
1. **Follow**: [automated-migration-guide.md](./automated-migration-guide.md) - **2-prompt migration workflow**
2. **Reference**: [angularjs-react-mapping-guide.md](./angularjs-react-mapping-guide.md) - **Concrete mappings**
3. **Use**: [code-templates.md](./code-templates.md) - **Ready-to-use templates**
4. **Validate**: [parity-validation-guide.md](./parity-validation-guide.md) - **Validation 100%**

### For US Migration (Manual)
0. **Analyze**: [90-quickstart/pre-migration-analysis.md](../90-quickstart/pre-migration-analysis.md) - **5-min source code analysis**
1. **Read**: [us-migration-guide.md](./us-migration-guide.md) - **Strategy US par US** (includes Phase 1: Discovery with source analysis)
2. **Implement**: [migration-patterns.md](./migration-patterns.md) - **AngularJS→React patterns** (includes source code detection patterns)
3. **Code**: [30-best-practices/](../30-best-practices/) - **React patterns génériques**
4. **Validate**: [parity-validation-guide.md](./parity-validation-guide.md) - **Validation 100%**
5. **Document**: [migration-templates.md](./migration-templates.md) - **Templates PLAN.md, DoD**

### For Quick Pattern Lookup
1. **Start**: [migration-patterns.md](./migration-patterns.md) - **Patterns spécifiques**
2. **Map**: [angularjs-react-mapping-guide.md](./angularjs-react-mapping-guide.md) - **Concrete mappings** ⭐ NEW
3. **Template**: [code-templates.md](./code-templates.md) - **Code templates** ⭐ NEW
4. **Code**: [30-best-practices/](../30-best-practices/) - **Patterns React**
5. **Validate**: [parity-validation-guide.md](./parity-validation-guide.md) - **Validation**

### UI Policy (Mandatory)
- UI must be implemented with MUK exclusively (design tokens, components, themes).
- ODS/MRC usage is forbidden when a MUK equivalent exists.
- Exceptional fallback: if MUK does not provide the required component/feature, document the justification and create a follow‑up ticket “Replace fallback with MUK when available”.

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

#### **[automated-migration-guide.md](./automated-migration-guide.md)** - **Guide Migration Automatisée** ⭐ NEW
- **Purpose**: Migration automatisée en 2 prompts
- **When to use**: Pour migration rapide avec AI
- **Key features**:
  - Phase 1: Analyse automatique + génération de structure
  - Phase 2: Implémentation des fonctionnalités + validation
  - Patterns de détection automatique
  - Templates de génération de code
- **Best for**: **Migration automatisée avec prompts AI**

### 🏗️ **Supporting Guides**

#### **[angularjs-react-mapping-guide.md](./angularjs-react-mapping-guide.md)** - **Guide de Mapping** ⭐ NEW
- **Purpose**: Mappings concrets AngularJS → React avec exemples réels
- **When to use**: Pour comprendre les mappings spécifiques
- **Key features**:
  - Mappings complets avec code source (nasha → bmc-nasha)
  - Routing, Resolve, Templates, API mappings
  - Exemples réels de production
  - Tableau de référence rapide
- **Best for**: **Comprendre les mappings concrets**

#### **[migration-patterns.md](./migration-patterns.md)** - **Patterns Migration**
- **Purpose**: Patterns spécifiques AngularJS → React
- **When to use**: Pendant l'implémentation
- **Key features**:
  - Mappings AngularJS → React (Controller→Hook, Service→Hook)
  - Patterns essentiels (List, Detail, Form)
  - **Pattern Detection Rules** (automated) ⭐ NEW
  - **Resolve Function Mapping Patterns** ⭐ NEW
  - **Edge Cases & Special Patterns** ⭐ NEW
  - **AAPI & Iceberg Integration Patterns** ⭐ NEW
  - Tableau de référence rapide
  - Anti-patterns migration
- **Best for**: **Implémentation des patterns de migration**

#### **[code-templates.md](./code-templates.md)** - **Templates de Code** ⭐ NEW
- **Purpose**: Templates de code prêts à l'emploi basés sur bmc-nasha
- **When to use**: Pour générer rapidement la structure de base
- **Key features**:
  - Templates complets (Routes, Hooks, Pages, Components)
  - Basés sur code réel de bmc-nasha
  - Prêts à adapter avec placeholders
  - Structure complète de fichiers
- **Best for**: **Génération rapide de code de base**

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
| **Automated Migration (AI)** | automated-migration-guide.md ⭐ NEW | angularjs-react-mapping-guide.md + code-templates.md |
| **US Migration** | us-migration-guide.md | migration-patterns.md + parity-validation-guide.md |
| **Concrete Mappings** | angularjs-react-mapping-guide.md ⭐ NEW | migration-patterns.md |
| **Code Templates** | code-templates.md ⭐ NEW | angularjs-react-mapping-guide.md |
| **Patterns Lookup** | migration-patterns.md | angularjs-react-mapping-guide.md + 30-best-practices/ |
| **Visual Diffs** | 10-migration-diffs/ ⭐ NEW | angularjs-react-mapping-guide.md |
| **Pitfalls Check** | 09-common-pitfalls/ ⭐ NEW | parity-validation-guide.md |
| **Validation** | parity-validation-guide.md | us-migration-guide.md |
| **Documentation** | migration-templates.md | us-migration-guide.md |
| **React Patterns** | 30-best-practices/ | migration-patterns.md |

## 🚀 Migration Workflow

### Step 0: **Pre-Analysis** (5 minutes)
- Use [90-quickstart/pre-migration-analysis.md](../90-quickstart/pre-migration-analysis.md) for quick source code analysis
- Detect all UI components, features, and API endpoints
- Document missing features that must be implemented

### Step 1: **Planning**
- Use [us-migration-guide.md](./us-migration-guide.md) Phase 1: Discovery for detailed US analysis
- Use [migration-templates.md](./migration-templates.md) for PLAN.md
- Include detected features checklist in planning

### Step 2: **Implementation**
- Use [migration-patterns.md](./migration-patterns.md) for AngularJS→React patterns with MUK components
- Use [20-dependencies/muk-components-reference.md](../20-dependencies/muk-components-reference.md) for OUI→MUK mapping (MUK‑first)
- Use [30-best-practices/](../30-best-practices/) for React patterns
- Use [Development Standards](../30-best-practices/development-standards.md) for quality

### Step 3: **Validation**
- Use [parity-validation-guide.md](./parity-validation-guide.md) for validation
- Use [us-migration-guide.md](./us-migration-guide.md) for US validation
- Verify all detected features are implemented

## 🧠 AI-Optimized Resources (Phase 3) ⭐ NEW

### **Navigation & Discovery**
- [00-semantic-index.yaml](./00-semantic-index.yaml) - **Semantic index for AI navigation** - Quick concept-to-doc mapping
- [01-workflows/decision-tree-v2.json](./01-workflows/decision-tree-v2.json) - **Enhanced decision tree** - Contextual conditions for smarter decisions

### **Pattern Detection & Validation**
- [02-patterns/](./02-patterns/) - **Machine-readable patterns** - Regex patterns for AngularJS detection
- [02-patterns/validate-patterns.ts](./02-patterns/validate-patterns.ts) - **Pattern validation script** - Test regex patterns

### **Error Prevention**
- [09-common-pitfalls/](./09-common-pitfalls/) - **Common pitfalls catalog** - Avoid frequent mistakes
- [09-common-pitfalls/pitfalls-catalog.yaml](./09-common-pitfalls/pitfalls-catalog.yaml) - **Pitfalls with detection regex**

### **Visual Diffs**
- [10-migration-diffs/](./10-migration-diffs/) - **Side-by-side comparisons** - AngularJS → React transformations
  - [routing-diffs.md](./10-migration-diffs/routing-diffs.md) - Routes, states, navigation
  - [api-diffs.md](./10-migration-diffs/api-diffs.md) - API calls, data fetching
  - [component-diffs.md](./10-migration-diffs/component-diffs.md) - UI components
  - [state-diffs.md](./10-migration-diffs/state-diffs.md) - Controllers, services

### **Workflow State**
- [06-prompts/state-schema.yaml](./06-prompts/state-schema.yaml) - **Migration state schema** - Track progress across prompts

### **Continuous Improvement**
- [12-feedback/](./12-feedback/) - **Feedback loop** - Log improvements and pending updates

## 📚 Additional Resources

### **Architecture & Dependencies**
- [Manager Architecture Overview](../10-architecture/api-overview.md)
- [React uApp Blueprint](../10-architecture/react-uapp-blueprint.md)
- [MUK Components](../20-dependencies/muk.md) — primary UI stack

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

### **i18n/Translations Policy (AngularJS → React)**
- **Carry over translation values verbatim**: All translation strings (values) from the legacy AngularJS module must be reused as-is in the new µapp.
- **Keys may be renamed**: You can rationalize and rename translation keys/namespaces to match the new nomenclature, but this must not alter the displayed strings.
- **Document key mapping**: When keys are renamed, document the legacy→new mapping and keep it in `MIGRATION_NOTES.md`.
- **Parity validation**: Validation must assert that all rendered texts match legacy values exactly; key names are not tested, only the resulting texts.

### **Assets/Images Policy (AngularJS → React)**
- **Carry over image assets verbatim**: All used images from the legacy AngularJS module must be reused as-is (same pixels/content) in the new µapp.
- **Paths/names may change**: You may reorganize folders or rename files to fit the new structure, but image content must remain identical.
- **Document asset mapping**: When paths or filenames change, document the legacy→new mapping in `MIGRATION_NOTES.md`.
- **Parity validation**: Validation must assert that rendered images are visually identical (same asset) and appear in the same contexts; file paths are not tested, only the rendered result.

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

1. **Always start with pre-migration-analysis** (90-quickstart/pre-migration-analysis.md) - **Automated detection patterns** ⭐ UPDATED
2. **For automated migration**: Use [automated-migration-guide.md](./automated-migration-guide.md) - **2-prompt workflow** ⭐ NEW
3. **For concrete mappings**: Use [angularjs-react-mapping-guide.md](./angularjs-react-mapping-guide.md) - **Real examples** ⭐ NEW
4. **For code generation**: Use [code-templates.md](./code-templates.md) - **Ready-to-use templates** ⭐ NEW
5. **For manual migration**: Analyze AngularJS source systematically using us-migration-guide.md Phase 1: Discovery
6. **Detect UI patterns** using migration-patterns.md **Pattern Detection Rules** ⭐ UPDATED
7. **Map OUI→MUK components** using migration-patterns.md **Template Component Mapping** ⭐ UPDATED
8. **Use migration-patterns.md** for AngularJS→React specific patterns and **Edge Cases** ⭐ UPDATED
9. **Use 30-best-practices/** for React patterns génériques
10. **Always validate** with parity-validation-guide.md
11. **Document everything** with migration-templates.md
12. **Follow US-first approach** for user story migrations
13. **Ensure 100% parity** for all migrations including ALL detected features

### Guide Selection Checklist

- [ ] **Pre-analysis completed** (90-quickstart/pre-migration-analysis.md)
- [ ] **All UI features detected** from AngularJS templates
- [ ] **OUI components mapped** to MUK equivalents
- [ ] **Missing features documented** (Roadmap, Filter, etc.)
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
