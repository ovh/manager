# Credentials

## What are Credentials?

Credentials are mTLS (mutual TLS) client certificates that grant access to an OKMS instance's **KMIP endpoint**. External systems (applications, services, infrastructure tools) use these certificates to authenticate themselves when communicating with the OKMS KMIP API.

Each credential is tied to one OKMS instance and has:
- A **name** and optional **description**
- A **validity period** (expiration date)
- A **certificate type** (ECDSA or RSA)
- A set of **associated IAM identities** (users, groups, service accounts) that are authorized to use the credential

---

## Status Values

| Status | Meaning |
|--------|---------|
| `CREATING` | The credential is being generated. Not yet usable. |
| `READY` | The credential is active and available for use. |
| `EXPIRED` | The credential's validity period has passed. No longer usable. |
| `DELETING` | The credential is being removed. |
| `ERROR` | An error occurred during creation or processing. |

---

## Certificate Types

| Type | Notes |
|------|-------|
| `ECDSA` | Elliptic curve certificate. Recommended for most use cases — smaller key size, strong security. |
| `RSA` | RSA certificate. Broader compatibility with older KMIP clients. |

Certificate type is only selectable when using the OVH-generated creation method (see below).

---

## Creation Wizard

Credential creation follows a 3-step wizard.

### Step 1 — General Information

| Field | Rules |
|-------|-------|
| `name` | Required. 1–50 characters. ASCII printable characters only (character range `[ -~]`). |
| `description` | Optional. Maximum 200 characters. ASCII printable characters only. |
| `validity` | Required. 1–365 days from the creation date. |
| Creation method | Toggle between **OVH-generated** and **Custom CSR**. |

#### Validity Presets

The validity field offers quick-select presets alongside a custom date picker:
- 1 day
- 1 week
- 1 month
- 3 months
- 6 months
- 1 year
- Custom (date picker allowing any value within the 1–365 day range)

#### Creation Methods

**OVH-generated**

The platform generates both the certificate and the private key on behalf of the user.

- `certificateType`: Required. Select `ECDSA` (recommended) or `RSA`.
- The generated certificate and private key are displayed **once** at the end of the wizard (Step 3). They are not stored or retrievable afterward.

**Custom CSR**

The user provides their own Certificate Signing Request (CSR). The platform signs it and returns only the signed certificate.

- `csr`: Required. The raw PEM-encoded CSR text.
- `certificateType` is not selectable — it is inferred from the CSR.
- No private key is displayed at the end of the wizard, as the user retains their own private key.

---

### Step 2 — Add Identities

This step associates IAM identities with the credential. These identities define who is authorized to use the credential to access the KMIP endpoint.

Identity types that can be added:

| Identity type | Description |
|---------------|-------------|
| IAM users | Individual OVHcloud sub-users |
| IAM groups | Groups of IAM users |
| Service accounts | OAuth clients or OVHcloud service accounts |

**Constraints:**
- Maximum **25 identities** in total across all types.
- Identities can be added, searched, and removed within this step.
- At least one identity is recommended, though the step may be optional depending on the use case.

---

### Step 3 — Confirmation

The final step summarizes the credential and, if the creation method was **OVH-generated**, displays:
- The signed **certificate** (PEM format)
- The **private key** (PEM format)

> **Important:** The private key is shown only once and cannot be retrieved again. Users must download or copy it before closing the wizard.

For **Custom CSR** creation, only the signed certificate is shown (no private key).

---

## Credential List Actions

### Delete Credential

A credential can be deleted from:
- The credential list (row-level action)
- The credential dashboard

Deletion is confirmed via a modal dialog. Once deleted, the credential transitions to `DELETING` status and is permanently removed.

---

## Credential Identities Tab

Within a credential's detail view, an **Identities** tab shows all IAM entities associated with the credential, organized by type:

| Section | Content |
|---------|---------|
| Users | IAM users linked to the credential |
| Groups | IAM groups linked to the credential |
| Service accounts | OAuth clients / service accounts linked to the credential |
| OVH accounts | OVHcloud root account associations (if applicable) |

Identities can be added or removed from this tab after the credential has been created.
