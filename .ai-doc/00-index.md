---
title: OVHcloud Manager — Documentation Overview
last_update: 2025-10-13
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
- Document **ODS and MRC component systems** for UI consistency.
- Detail **GitHub workflows** and review processes for collaborative development.
- Clarify **testing strategies** to ensure quality and maintainability.
- Provide **references and templates** for developers and automation tools.

---

## 📂 Structure Overview

| Folder | Description |
|--------|--------------|
| `_doc-template.md` | Template used for new documentation files. |
| `_references.md` | Unified human + machine list of all external documentation and source URLs. |
| `00-index.md` | This file — serves as the main entry point. |
| `10-architecture/` | Explains Manager architecture, APIs, µApp containerization, and related commands. |
| `20-design-system/` | Documents ODS and MRC component libraries and Storybooks. |
| `30-best-practices/` | Contains coding conventions and frontend design patterns. |
| `40-workflow/` | Describes branching, commit, and review processes. |
| `50-testing/` | Defines testing and static analysis strategies. |

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

For the complete list of external documentation, see [`_references.md`](./_references.md).
