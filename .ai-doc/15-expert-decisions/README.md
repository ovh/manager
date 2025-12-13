# Expert Decision Matrix

This directory contains decision matrices that guide AI to make correct technical decisions like an expert developer.

## Files

| File | Purpose |
|------|---------|
| [expert-decision-matrix.yaml](expert-decision-matrix.yaml) | Complete decision trees for state management, API calls, components, error handling, loading states, and file structure |

## How to Use

**Consult BEFORE implementing any feature.** The decision matrix answers:

1. **"Should I use useState, useContext, or React Query?"** → See `state_management`
2. **"Should I use v6, AAPI, or Iceberg?"** → See `api_calls`
3. **"Should I use a Modal or Drawer?"** → See `component_decisions`
4. **"How do I handle this error?"** → See `error_handling`
5. **"What loading state should I show?"** → See `loading_states`
6. **"Where should I put this code?"** → See `file_structure`

## Quick Reference

### State Management

| Data Type | Use This | Never Use |
|-----------|----------|-----------|
| API/Server data | React Query (`useQuery`) | useState, Context |
| Local UI state (1 component) | `useState` | Context, React Query |
| Shared UI state (2+ components) | Context or URL state | - |
| Form state (2+ fields) | React Hook Form | useState |

### API Calls

| Operation | Pattern |
|-----------|---------|
| Fetch single resource | `useQuery` with v6 |
| Fetch small list (<100) | `useQuery` with v6 + Promise.all |
| Fetch large list (100+) | `useQuery` with Iceberg |
| Fetch aggregated data | `useQuery` with AAPI or Iceberg (depends on endpoint support - user decision) |
| Create resource | `useMutation` with POST |
| Update resource | `useMutation` with PUT |
| Delete resource | `useMutation` with DELETE |

### Components

| Need | Use |
|------|-----|
| List with columns | Datagrid from MUK |
| Key-value display | Tile from MUK |
| Simple action | Modal |
| Complex form | Drawer |
| Section navigation | OdsTabs |

## Integration with Migration

When migrating from AngularJS:

1. **Identify what the AngularJS code does** (read data, write data, show UI)
2. **Consult this matrix** to choose the correct React pattern
3. **Use the provided code patterns** as templates

Example:
```
AngularJS: OvhApiDedicatedNasha.Aapi().get({serviceName}).$promise
↓ Consult api_calls.read_aggregated
↓ Decision: use React Query with AAPI
React: useQuery with aapi.get(`/nasha/${serviceName}/dashboard`)
```
