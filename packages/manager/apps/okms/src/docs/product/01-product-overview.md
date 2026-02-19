# Product Overview

## What is OKMS?

OKMS (OVHcloud Key Management Service) is a cloud-hosted cryptographic service that allows users to create and manage:

- **Service keys** — cryptographic keys (symmetric and asymmetric) used for encryption, signing, and key wrapping operations.
- **Credentials** — mTLS client certificates used to access the OKMS KMIP endpoint from external systems.
- **Secrets** — versioned key-value JSON data stored securely within an OKMS instance.

The service is designed for teams that need centralized key management, secret storage, and access control without managing their own HSM (Hardware Security Module) infrastructure.

---

## Two Functional Modules

### Key Management Service (KMS)

The KMS module provides access to the core cryptographic infrastructure:

- **OKMS instances** — provisioned KMS environments per region.
- **Service keys** — cryptographic keys bound to an instance.
- **Credentials** — mTLS certificates for KMIP access, with associated IAM identities.

### Secret Manager

The Secret Manager module provides a versioned secret store built on top of an OKMS instance:

- **Secrets** — named, hierarchical JSON payloads with version history.
- **Version management** — each secret can have multiple versions in `ACTIVE`, `DEACTIVATED`, or `DELETED` states.
- **Instance-level configuration** — default policies for versioning, check-and-set, and auto-deactivation.

---

## Shared Concept: The OKMS Instance

Both modules share the same underlying **OKMS instance** as their operating context. An instance:

- Is scoped to a single OVHcloud region.
- Exposes API endpoints specific to that region.
- Holds service keys, credentials, and secrets together.
- Tracks counts of keys and secrets for at-a-glance visibility.
