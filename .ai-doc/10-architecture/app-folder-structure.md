---
title: Application Folder Structure
last_update: 2025-10-13
tags: [structure, folder, react, ovhcloud, manager]
ai: true
---

# Application Folder Structure

## Overview
µ‑apps must share a unified folder structure for maintainability.

```
µ-application-name/
├── public/translations/
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── App.tsx
│   ├── i18n.ts
│   ├── index.scss
│   ├── main.tsx
│   └── queryClient.ts
└── index.html
```

Each section (components, data, hooks, pages, routes) follows strict conventions described in OVHcloud Manager docs.
