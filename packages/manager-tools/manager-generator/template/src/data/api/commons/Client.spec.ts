/* eslint-disable @typescript-eslint/unbound-method */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as AppC from '@/App.constants';

import {
  deleteJSON,
  getApiClient,
  getJSON,
  getListingPage,
  getOnboardingConfig,
  postJSON,
  putJSON,
} from './Client.api';

// --- Mocks ------------------------------------------------------------------
vi.mock('axios');
vi.mock('@ovh-ux/manager-core-api', () => {
  return {
    v2: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
    v6: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
    fetchIcebergV2: vi.fn().mockResolvedValue({ data: ['v2'], cursorNext: 'cursor', status: 200 }),
    fetchIcebergV6: vi.fn().mockResolvedValue({ data: ['v6'], totalCount: 1, status: 200 }),
  };
});

// --- Setup/teardown --------------------------------------------------------
beforeEach(() => {
  vi.clearAllMocks();
});

// --- Tests -----------------------------------------------------------------
describe('getApiClient', () => {
  it('returns correct API client', () => {
    expect(getApiClient('v2')).toBeTruthy();
    expect(getApiClient('v6')).toBeTruthy();
  });
});

describe('HTTP helpers', () => {
  it('performs GET with headers + params', async () => {
    const client = getApiClient('v6');
    vi.mocked(client.get).mockResolvedValueOnce({ data: { hello: 'world' } });

    const result = await getJSON<{ hello: string }>('v6', '/me', {
      params: { foo: 'bar' },
      disableCache: true,
    });

    expect(result).toEqual({ hello: 'world' });
    expect(client.get).toHaveBeenCalledWith('/me', {
      params: { foo: 'bar' },
      headers: { Pragma: 'no-cache' },
    });
  });

  it('performs POST with body', async () => {
    const client = getApiClient('v6');
    vi.mocked(client.post).mockResolvedValueOnce({ data: { ok: true } });

    const result = await postJSON<{ ok: boolean }>('v6', '/foo', { foo: 'bar' });
    expect(result).toEqual({ ok: true });
    expect(client.post).toHaveBeenCalled();
  });

  it('performs PUT with body', async () => {
    const client = getApiClient('v6');
    vi.mocked(client.put).mockResolvedValueOnce({ data: { updated: 1 } });

    const result = await putJSON<{ updated: number }>('v6', '/foo', { a: 1 });
    expect(result).toEqual({ updated: 1 });
  });

  it('performs DELETE', async () => {
    const client = getApiClient('v6');
    vi.mocked(client.delete).mockResolvedValueOnce({ data: { deleted: true } });

    const result = await deleteJSON<{ deleted: boolean }>('v6', '/foo');
    expect(result).toEqual({ deleted: true });
  });
});

describe('getOnboardingConfig', () => {
  it('returns local config in mock mode', async () => {
    vi.spyOn(AppC, 'API_DATA_MODE', 'get').mockReturnValue('mock');
    const config = await getOnboardingConfig();
    expect(config).toEqual(AppC.ONBOARDING_CONFIG);
  });

  it('falls back to local config on error', async () => {
    vi.spyOn(AppC, 'API_DATA_MODE', 'get').mockReturnValue('live');
    vi.spyOn(AppC, 'APP_FEATURES', 'get').mockReturnValue({
      ...AppC.APP_FEATURES,
      onboardingApi: 'v6',
    });

    const client = getApiClient('v6');
    vi.mocked(client.get).mockRejectedValueOnce(new Error('network'));

    const config = await getOnboardingConfig({ domain: 'x' });
    expect(config).toEqual(AppC.ONBOARDING_CONFIG);
  });
});

describe('getListingPage', () => {
  it('uses v6Iceberg when configured', async () => {
    vi.spyOn(AppC, 'APP_FEATURES', 'get').mockReturnValue({
      ...AppC.APP_FEATURES,
      listingApi: 'v6Iceberg',
    });

    const res = await getListingPage<{ id: string }>({ route: '/foo' });
    expect(res.data).toEqual(['v6']);
  });

  it('uses v2 Iceberg when configured', async () => {
    vi.spyOn(AppC, 'APP_FEATURES', 'get').mockReturnValue({
      ...AppC.APP_FEATURES,
      listingApi: 'v2',
    });

    const res = await getListingPage<{ id: string }>({ route: '/foo' });
    expect(res.data).toEqual(['v2']);
    expect(res.cursorNext).toBe('cursor');
  });

  it('uses plain v6 when no iceberg config', async () => {
    vi.spyOn(AppC, 'APP_FEATURES', 'get').mockReturnValue({
      ...AppC.APP_FEATURES,
      listingApi: 'v6',
    });

    const client = getApiClient('v6');
    vi.mocked(client.get).mockResolvedValueOnce({ data: [{ id: 1 }] });

    const res = await getListingPage<{ id: number }>({ route: '/foo' });
    expect(res.data).toEqual([{ id: 1 }]);
  });
});
