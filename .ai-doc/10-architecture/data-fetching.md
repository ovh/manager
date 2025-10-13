---
title: Data Fetching and Updating in Manager
last_update: 2025-10-13
tags: [data, fetching, axios, react-query, ovhcloud, manager]
ai: true
---

# Data Fetching and Updating in Manager

## Overview
In Manager, backend interaction happens in two steps:
1. Create a function using `axios`.
2. Wrap it in a custom React hook using **Tanstack Query**.

### HTTP Requests with @ovh-ux/manager-core-api

```ts
import { apiClient, v6, v2, aapi, fetchIcebergV6, fetchIcebergV2 } from '@ovh-ux/manager-core-api';
v6.get('/me');
v2.get('/iam/policy');
aapi.get('/feature/availability');
```

### Example: IAM Policies
(omitted for brevity — contains `useQuery`, `useMutation`, and CRUD hooks).

### Polling Example
Use `refetchInterval` in `useQuery` to auto-refresh async resource creation (e.g., Public Cloud instances).

```ts
refetchInterval: (instances = []) =>
  instanceId &&
  instances.find(({ id }) => id === instanceId)?.status !== 'ACTIVE'
    ? 5000 : false
```
