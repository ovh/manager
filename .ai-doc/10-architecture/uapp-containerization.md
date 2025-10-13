---
title: µApp Architecture and Containerization
last_update: 2025-10-13
tags: [micro-frontend, architecture, shell, container, ovhcloud]
ai: true
---

# µApp Architecture and Containerization

## Concept
Manager uses a **micro‑frontend** architecture made of multiple µ‑applications working together.

### Types of µ‑Apps
- **Primary App (Container):** core user/security/navigation logic.
- **Secondary App:** loaded via iframe inside container, independent runtime.
- **Independent App:** standalone entry point (e.g., signup).

### Communication
Handled via `window.postMessage` through `@ovh-ux/shell` plugins.

```ts
import { initShellClient } from '@ovh-ux/shell';
const shell = initShellClient();
```

### Routing
Container and Shell sync iframe and browser URLs automatically.
