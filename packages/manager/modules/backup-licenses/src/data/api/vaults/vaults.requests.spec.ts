import { afterEach, describe, expect, it, vi } from 'vitest';

import { placeVaultOrder } from '@/data/api/order/vaultOrder';

import { orderVault, setVaultOrderChannel } from './vaults.requests';

vi.mock('@/data/api/order/vaultOrder');

const order = { name: 'vault-paygo-01', region: 'eu-west-par' };

const context = { ovhSubsidiary: 'FR', serviceName: 'backuplicenses-service' };

describe('the vault ordering channel', () => {
  afterEach(() => {
    setVaultOrderChannel();
    vi.clearAllMocks();
  });

  it('places a real Agora order by default, so no stub can ship installed', async () => {
    await orderVault(order, context);

    expect(placeVaultOrder).toHaveBeenCalledWith(order, context);
  });

  it('hands the order and its context to a substituted channel instead', async () => {
    const channel = vi.fn().mockResolvedValue(undefined);
    setVaultOrderChannel(channel);

    await orderVault(order, context);

    expect(channel).toHaveBeenCalledWith(order, context);
    expect(placeVaultOrder).not.toHaveBeenCalled();
  });

  it('restores the real channel when the substitution is dropped', async () => {
    setVaultOrderChannel(vi.fn().mockResolvedValue(undefined));
    setVaultOrderChannel();

    await orderVault(order, context);

    expect(placeVaultOrder).toHaveBeenCalledWith(order, context);
  });
});
