# observability — OVHcloud Manager Application

> Universe: **Manager / Manager**

## Overview

This application is a single-page React app integrated into the OVHcloud Manager ecosystem.  

---
## 🚀 Development

From the root:

```bash
# Install dependencies
yarn install

# Start dev server (Vite)
yarn start

# Build for production
yarn build

# Lint
yarn lint:modern
yarn lint:modern:fix

# Test
yarn test
yarn test:coverage
```

The app uses **hash-based routing**. Open the dev server URL printed by Vite (default `http://localhost:5173/`) and navigate under:
```
#/[flavor-aware root from Routes.utils.ts]
```
---

## 📚 Useful Links

- Manager React Shell Client: https://github.com/ovh/manager
- React Router Docs: https://reactrouter.com/
- Iceberg API Guide: https://github.com/ovh/manager-core-api
- OVHcloud Public API Explorer: https://api.ovh.com/

---

**Generated with ❤️ by OVHcloud Manager App Generator**
