# OKMS Instance

## What is an OKMS Instance?

An OKMS instance is a provisioned Key Management Service environment scoped to a single OVHcloud region. It serves as the shared foundation for service keys, KMIP credentials, and secrets.

Each instance exposes:
- A **region** identifier (e.g., `eu-west-rbx`, `eu-west-gra`)
- **API endpoints** for KMIP and REST access specific to that region
- A **key count** — the number of service keys currently managed by the instance
- A **secret count** — the number of secrets currently stored in the instance
- A **creation date**
- A **status** reflecting the instance's lifecycle state

---

## Status Values

| Status | Meaning |
|--------|---------|
| `IN_CREATION` | The instance is being provisioned. No operations are available yet. |
| `OK` | The instance is active and fully operational. |
| `SUSPENDED` | The instance has been suspended (e.g., payment issue). Operations are paused. |
| `EXPIRED` | The instance subscription has expired. The instance is no longer accessible. |

---

## Lifecycle

### Creation

Creating an OKMS instance involves two steps:

1. **Region selection** — the user selects one of the available OVHcloud regions where the instance will be hosted.
2. **Order confirmation** — a modal summarizes the order details. Upon confirmation, the order is submitted and the instance enters `IN_CREATION` status.

Once provisioning completes, the status transitions to `OK` and the instance becomes operational.

### Rename

An OKMS instance can be renamed at any time via an inline edit or rename modal. The new name is a display label and does not affect any technical identifiers or endpoints.

### Terminate

An OKMS instance can be terminated by the user. Termination is a destructive action:
- All service keys, credentials, and secrets within the instance will be permanently deleted.
- A confirmation modal is shown before the action is submitted.
- Termination is typically implemented as scheduling the instance for deletion at the end of the billing period, or immediately depending on the contract.

---

## Displayed Information

The OKMS instance dashboard and list view display the following information:

| Field | Description |
|-------|-------------|
| Name | User-defined display name for the instance |
| Region | The OVHcloud region where the instance is hosted |
| Status | Current lifecycle status (see above) |
| Creation date | Date when the instance was created |
| Key count | Number of service keys managed by the instance |
| Secret count | Number of secrets stored in the instance |
| API endpoints | URLs for accessing the instance's KMIP and REST APIs |
