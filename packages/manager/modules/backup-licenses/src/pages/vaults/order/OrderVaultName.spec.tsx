import { waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { labels } from '@/test-utils/i18ntest.utils';

import {
  LOCATIONS,
  SERVICE_NAME,
  blurName,
  chooseRegion,
  clickSubmit,
  fillValidOrder,
  isDisabled,
  isEnabled,
  mockedGetLocations,
  mockedOrderVault,
  nameFieldError,
  regionSelect,
  renderOrderModal,
  resolveServiceName,
  submitButton,
  typeName,
} from './_test/order.harness';

vi.mock('@/data/api/locations/locations.requests');
vi.mock('@/data/api/tenants/tenants.requests');
vi.mock('@/data/api/vaults/vaults.requests', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/data/api/vaults/vaults.requests')>()),
  orderVault: vi.fn(),
}));

const order = labels.vaults.order;

beforeEach(() => {
  vi.clearAllMocks();
  mockedGetLocations.mockResolvedValue(LOCATIONS);
  mockedOrderVault.mockResolvedValue(undefined);
  resolveServiceName();
});

describe('vault name rule — min 1, max 50, alphanumeric and hyphens', () => {
  const accepted = [
    'a',
    'vault-01',
    'Vault-01',
    '-vault',
    'vault-',
    'a'.repeat(50),
    '  vault-01  ',
  ];
  const rejected = [
    'a'.repeat(51),
    'my_vault',
    "my-vault's-01",
    'vault.01',
    'vault 01',
    // Padding buys no room: the rule reads the trimmed name, so 51 characters stay 51.
    `  ${'a'.repeat(51)}  `,
  ];

  it.each(accepted)('accepts %s', async (name) => {
    await renderOrderModal();
    await waitFor(() => expect(regionSelect()).toBeTruthy());

    typeName(name);
    chooseRegion();

    await waitFor(() => expect(isEnabled(submitButton())).toBe(true));
  });

  it.each(rejected)('refuses %s', async (name) => {
    await renderOrderModal();
    await waitFor(() => expect(regionSelect()).toBeTruthy());

    typeName(name);
    chooseRegion();
    blurName();

    await waitFor(() => expect(nameFieldError()).toBe(order.error.name_format));
    expect(isDisabled(submitButton())).toBe(true);
  });

  it('refuses an empty name and says what is missing, once the field has been visited', async () => {
    await renderOrderModal();
    await waitFor(() => expect(regionSelect()).toBeTruthy());

    typeName('vault-01');
    typeName('');
    blurName();

    await waitFor(() => expect(nameFieldError()).toBe(order.error.name_required));
  });

  it('treats a name made of spaces as no name at all', async () => {
    await renderOrderModal();
    await waitFor(() => expect(regionSelect()).toBeTruthy());

    typeName('   ');
    chooseRegion();
    blurName();

    await waitFor(() => expect(nameFieldError()).toBe(order.error.name_required));
    expect(isDisabled(submitButton())).toBe(true);
  });

  it('orders the trimmed name, so no padding reaches a name nothing can rename', async () => {
    await renderOrderModal();
    await fillValidOrder('  vault-01  ');

    await clickSubmit();

    await waitFor(() =>
      expect(mockedOrderVault).toHaveBeenCalledWith(
        { name: 'vault-01', region: LOCATIONS[0].name },
        expect.objectContaining({ serviceName: SERVICE_NAME }),
      ),
    );
  });

  it('holds its judgement while the customer is still typing', async () => {
    await renderOrderModal();
    await waitFor(() => expect(regionSelect()).toBeTruthy());

    typeName('vault_');

    await waitFor(() => expect(isDisabled(submitButton())).toBe(true));
    expect(nameFieldError()).toBeNull();
  });
});
