---
title: OVHcloud Manager — Documentation Overview
last_update: 2025-01-27
tags: [overview, architecture, best-practices, ovhcloud, manager]
ai: true
---

# OVHcloud Manager — Documentation Overview

This documentation set provides a **structured and unified knowledge base** for the OVHcloud Manager ecosystem.
It is designed to be easily readable by humans and consumable by AI systems to support automation, migration, and continuous improvement processes.

---

## 🧭 Purpose

The goal of this documentation is to:
- Describe the **technical architecture** and µApp containerization model used in the Manager.
- Define **frontend coding standards** and reusable design patterns.
- Document **MUK component system** for UI consistency.
- Detail **GitHub workflows** and review processes for collaborative development.
- Clarify **testing strategies** to ensure quality and maintainability.
- Provide **references and templates** for developers and automation tools.
- Support **AI-assisted migration** from AngularJS to React with comprehensive patterns and guidelines.

---

## 📂 Structure Overview

| Folder | Description |
|--------|--------------|
| `_doc-template.md` | Template used for new documentation files. |
| `_references.md` | Unified human + machine list of all external documentation and source URLs. |
| `00-index.md` | This file — serves as the main entry point. |
| `10-architecture/` | Explains Manager architecture, APIs, µApp containerization, module integration, and related commands. Includes [`react-uapp-blueprint.md`](./10-architecture/react-uapp-blueprint.md), [`react-tracking.md`](./10-architecture/react-tracking.md), [`feature-flipping.md`](./10-architecture/feature-flipping.md), [`common-translations.md`](./10-architecture/common-translations.md), [`app-folder-structure.md`](./10-architecture/app-folder-structure.md), [`uapp-containerization.md`](./10-architecture/uapp-containerization.md), [`api-overview.md`](./10-architecture/api-overview.md). |
| `20-dependencies/` | Documents MUK component library, module integrations, and external dependencies. Includes Manager packages (`manager-core-api.md`, `manager-react-shell-client.md`, `manager-react-core-application.md`, `manager-core-utils.md`, `manager-config.md`, `manager-static-analysis-kit.md`, `manager-vite-config.md`, `request-tagger.md`, `shell.md`), external libraries (`react-router-dom.md`, `tanstack-react-query.md`, `react-i18next.md`, `tailwind-css.md`), MUK components (`muk.md`), and module integrations (`logs-to-customer-module.md`). |
| `30-best-practices/` | Contains coding conventions, frontend design patterns, React best practices, and accessibility testing. Includes [`development-standards.md`](./30-best-practices/development-standards.md), [`frontend-design-patterns.md`](./30-best-practices/frontend-design-patterns.md), [`frontend-react-patterns.md`](./30-best-practices/frontend-react-patterns.md), [`react-best-practices.md`](./30-best-practices/react-best-practices.md), [`typescript-cheatsheet.md`](./30-best-practices/typescript-cheatsheet.md), [`html-accessibility-testing.md`](./30-best-practices/html-accessibility-testing.md), [`routing-best-practices.md`](./30-best-practices/routing-best-practices.md), [`navigation-links-guide.md`](./30-best-practices/navigation-links-guide.md), [`muk-modals-guide.md`](./30-best-practices/muk-modals-guide.md). |
| `40-workflow/` | Describes branching, commit, and review processes. Includes [`branching-and-commits.md`](./40-workflow/branching-and-commits.md), [`review-and-improvement.md`](./40-workflow/review-and-improvement.md). |
| `50-migration-angular/` | Contains comprehensive AngularJS to React migration guides, templates, and validation frameworks. Includes [`us-migration-guide.md`](./50-migration-angular/us-migration-guide.md), [`migration-patterns.md`](./50-migration-angular/migration-patterns.md), [`parity-validation-guide.md`](./50-migration-angular/parity-validation-guide.md), [`migration-templates.md`](./50-migration-angular/migration-templates.md), [`README.md`](./50-migration-angular/README.md). |

---

## 🧩 Usage Guidelines

- Each `.md` file is **self-contained** with its own frontmatter metadata.
- External references should point to entries listed in `_references.md`.
- Follow naming conventions and folder structure to ensure consistency.
- Use `_doc-template.md` for new documents to ensure proper formatting.
- Keep examples concise and reusable.

---

## 🧠 AI Integration

This documentation supports **AI-assisted automation** and contextual ingestion:
- Files are atomic and semantically organized.
- Metadata fields (`title`, `tags`, `ai`) allow AI tools to filter and prioritize information.
- YAML and Markdown formats are minimal and standardized for reliable parsing.

---

## 🔗 References


## 📚 Quick Reference

|| Folder | Description |
||--------|--------------|
|| `90-quickstart/` | Quick reference guides, checklists, and templates for common tasks like migrations. Includes [`migration-checklist.md`](./90-quickstart/migration-checklist.md), [`prompt-template.md`](./90-quickstart/prompt-template.md), [`pre-migration-analysis.md`](./90-quickstart/pre-migration-analysis.md) (NEW: 5-minute source code analysis checklist). |
