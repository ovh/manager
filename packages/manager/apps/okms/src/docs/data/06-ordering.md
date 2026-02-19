# Ordering Data

This document covers the data layer for creating and checking out OKMS instance orders.

**Module:** Key Management Service (`src/modules/key-management-service/data/`)

---

## Overview

OKMS instance ordering uses the OVHcloud cart system provided by `@ovh-ux/manager-module-order`. The flow is:

1. **Create a cart** with a pre-configured OKMS item (region, plan, pricing)
2. **Checkout the cart** to place the order with automatic payment

No direct API endpoints are called in this module — instead, the hooks delegate to the `@ovh-ux/manager-module-order` library which handles the underlying `/order/cart` API calls.

---

## React Query Hooks

### Mutations

| Hook | Parameters | Operation | Returns |
|------|------------|-----------|---------|
| `useCreateCart` | `ovhSubsidiary: string, regionId: string` | Create an OKMS cart via `createCart()` | `CreateCartResult` |
| `useCheckoutOrder` | `options?` | Checkout a cart via `postOrderCartCartIdCheckout()` | `ApiResponse<Order>` |

**Sources:** `data/hooks/useCreateCart.ts`, `data/hooks/useCheckoutOrder.ts`

---

## Cart Configuration

`useCreateCart` creates a cart with the following fixed configuration:

```typescript
{
  ovhSubsidiary,
  items: [
    {
      itemEndpoint: 'okms',
      options: {
        duration: 'P1M',
        planCode: 'okms',
        pricingMode: 'default',
        quantity: 1,
      },
      configurations: [{ label: 'region', value: regionId }],
    },
  ],
}
```

- **Plan code:** `okms`
- **Duration:** `P1M` (1 month)
- **Pricing mode:** `default`
- **Quantity:** `1`
- **Configuration:** region selection

## Checkout Configuration

`useCheckoutOrder` calls `postOrderCartCartIdCheckout` with:

```typescript
{
  cartId,
  autoPayWithPreferredPaymentMethod: true,
  waiveRetractationPeriod: true,
}
```

- **Auto-pay:** uses the preferred payment method
- **Waive retractation:** skips the cooling-off period

---

## Types

### From `@ovh-ux/manager-module-order`

| Type | Description |
|------|-------------|
| `CreateCartResult` | Result of cart creation (cart ID + items) |
| `Order` | Order object returned after checkout |

### From `@ovh-ux/manager-core-api`

| Type | Description |
|------|-------------|
| `ApiError` | Error type used by `useCreateCart` |
| `ApiResponse<T>` | Wrapper for API responses used by `useCheckoutOrder` |

### From `@/common/types/api.type.ts`

| Type | Description |
|------|-------------|
| `ErrorResponse` | Error type used by `useCheckoutOrder` |

---

## Related: Order Catalog

The order catalog data used to display pricing and plan information before ordering is documented in [01-okms.md](./01-okms.md) under the `useOrderCatalogOkms` hook.
