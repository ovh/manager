# Service Keys

## What are Service Keys?

Service keys are cryptographic keys managed within an OKMS instance. They are used to perform cryptographic operations such as encryption, decryption, signing, verification, and key wrapping. Service keys are bound to the OKMS instance that created them and cannot be transferred between instances.

Each service key has a **type** and **parameters** that determine which operations it supports, and a **status** reflecting its current lifecycle state.

---

## Key Types

| Type | Description |
|------|-------------|
| `oct` | Octet sequence — a symmetric AES key used for encryption/decryption and key wrapping. |
| `RSA` | RSA asymmetric key pair used for encryption/decryption, signing/verification, and key wrapping. |
| `EC` | Elliptic curve asymmetric key pair used for signing and verification. |

---

## Key Parameters

Parameters vary by key type:

### Key Size (`keySize`)
Applicable to `oct` and `RSA` keys only.

| Key Type | Available sizes |
|----------|----------------|
| `oct` | 128 bits, 192 bits, 256 bits |
| `RSA` | 2048 bits, 3072 bits, 4096 bits |

### Key Curve (`keyCurve`)
Applicable to `EC` keys only.

| Curve | Standard name |
|-------|--------------|
| P-256 | NIST P-256 (secp256r1) |
| P-384 | NIST P-384 (secp384r1) |
| P-521 | NIST P-521 (secp521r1) |

---

## Key Operations

Key operations define what cryptographic actions a service key is permitted to perform. They are configured at creation time as a set of checkboxes.

| Operation | Description |
|-----------|-------------|
| `encrypt` | Encrypt data using this key |
| `decrypt` | Decrypt data using this key |
| `sign` | Sign data using this key |
| `verify` | Verify signatures using this key |
| `wrapKey` | Wrap (encrypt) another key using this key |
| `unwrapKey` | Unwrap (decrypt) a wrapped key using this key |

The **default set of operations** is pre-populated based on the selected key type, as defined by the OKMS reference API. Users can customize the selection before submitting.

---

## Status Values

| Status | Meaning |
|--------|---------|
| `PRE_ACTIVE` | The key has been created but is not yet active. Not usable for cryptographic operations. |
| `ACTIVE` | The key is active and available for cryptographic operations. |
| `DEACTIVATED` | The key has been intentionally deactivated. Operations are no longer permitted. |
| `COMPROMISED` | The key is suspected or confirmed to be compromised. Should not be used. |
| `DESTROYED` | The key material has been permanently deleted. |
| `DESTROYED_COMPROMISED` | The key was compromised and has since been destroyed. |

---

## Creation Form

Service key creation follows a multi-step wizard.

### Step 1 — Protection Level

The user selects the protection level for the key. This determines how the key material is stored and protected within the OKMS infrastructure (e.g., software vs. hardware protection).

### Step 2 — General Information

| Field | Rules |
|-------|-------|
| `name` | Required. 1–32 characters. ASCII printable characters only. |

### Step 3 — Key Type & Parameters

| Field | Rules |
|-------|-------|
| `keyType` | Required. One of: `oct`, `RSA`, `EC`. Presented as radio buttons. |
| `keySize` | Required when `keyType` is `oct` or `RSA`. Select from available sizes for the chosen type. Not applicable for `EC`. |
| `keyCurve` | Required when `keyType` is `EC`. Select from P-256, P-384, P-521. Not applicable for `oct` or `RSA`. |

When the key type changes, the size/curve fields reset to appropriate defaults.

### Step 4 — Key Operations

A set of checkboxes for the permitted operations: `encrypt`, `decrypt`, `sign`, `verify`, `wrapKey`, `unwrapKey`.

The default selection is pre-populated based on the chosen `keyType` using the OKMS reference API defaults. The user may modify this selection before submitting.

---

## Actions

### Rename

An existing service key can be renamed via a modal dialog. The new name must satisfy the same constraints as the creation name field (1–32 characters, ASCII printable).

### Deactivate

A key in `ACTIVE` status can be deactivated. Deactivation is performed through a modal that requires the user to select a **deactivation reason**.

#### Deactivation Reasons

| Reason | Description |
|--------|-------------|
| `UNSPECIFIED` | No specific reason given. |
| `KEY_COMPROMISE` | The key material is believed to have been compromised. |
| `CA_COMPROMISE` | The issuing CA (if applicable) has been compromised. |
| `AFFILIATION_CHANGED` | The entity associated with the key has changed affiliation. |
| `SUPERSEDED` | The key has been replaced by a newer key. |
| `CESSATION_OF_OPERATION` | The key is no longer needed for its intended purpose. |
| `PRIVILEGE_WITHDRAWN` | The privileges associated with the key have been revoked. |

Once deactivated, the key transitions to `DEACTIVATED` status and can no longer be used for cryptographic operations.
