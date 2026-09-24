import { describe, expect, it, vi } from 'vitest';

import { Product } from '@/api';

import { V8_TO_V6_ORDER_ROUTES, resolveOrderUrl, resolveOrderUrls } from './order-url';

// The value returned by 2api /catalog for Enterprise File Storage (NETAPP).
const NETAPP_ORDER = 'https://manager.eu.ovhcloud.com/#/bare-metal/storage/efs/new';
const NETAPP_V6_ORDER = 'https://manager.eu.ovhcloud.com/#/dedicated/netapp/new';

const getURL = vi.fn(async (application: string, path: string) =>
  application === 'dedicated' ? `https://manager.eu.ovhcloud.com/#/dedicated${path.slice(1)}` : '',
);

describe('resolveOrderUrl', () => {
  it('rebuilds a mapped v8 route on its v6 application', async () => {
    await expect(resolveOrderUrl(NETAPP_ORDER, getURL)).resolves.toBe(NETAPP_V6_ORDER);
    expect(getURL).toHaveBeenCalledWith('dedicated', '#/netapp/new', {});
  });

  it('tolerates a trailing slash in the v8 route', async () => {
    await expect(resolveOrderUrl(`${NETAPP_ORDER}/`, getURL)).resolves.toBe(NETAPP_V6_ORDER);
  });

  it('matches regardless of the manager host', async () => {
    await expect(
      resolveOrderUrl('https://my-branch.eu.dtci.ovhcloud.tools/#/bare-metal/storage/efs/new', getURL),
    ).resolves.toBe(NETAPP_V6_ORDER);
  });

  it('leaves an unmapped manager route untouched', async () => {
    const order = 'https://manager.eu.ovhcloud.com/#/dedicated/server/new';
    await expect(resolveOrderUrl(order, getURL)).resolves.toBe(order);
  });

  it('leaves an external order URL untouched', async () => {
    const order = 'https://www.ovhcloud.com/fr/public-cloud/block-storage';
    await expect(resolveOrderUrl(order, getURL)).resolves.toBe(order);
  });

  it('leaves a non-URL order value untouched', async () => {
    await expect(resolveOrderUrl('', getURL)).resolves.toBe('');
  });

  it('keeps the order URL when the shell cannot build the v6 one', async () => {
    const failingGetURL = vi.fn().mockRejectedValue(new Error('unknown application'));
    await expect(resolveOrderUrl(NETAPP_ORDER, failingGetURL)).resolves.toBe(NETAPP_ORDER);
  });

  it('exposes the netapp mapping', () => {
    expect(V8_TO_V6_ORDER_ROUTES['/bare-metal/storage/efs/new']).toEqual({
      application: 'dedicated',
      path: '#/netapp/new',
    });
  });
});

describe('resolveOrderUrls', () => {
  it('only rewrites the order of the mapped products', async () => {
    const external = { order: 'https://www.ovhcloud.com/fr/', name: 'External' } as Product;
    const netapp = { order: NETAPP_ORDER, name: 'NetApp' } as Product;

    await expect(resolveOrderUrls([external, netapp], getURL)).resolves.toEqual([
      external,
      { ...netapp, order: NETAPP_V6_ORDER },
    ]);
  });
});
