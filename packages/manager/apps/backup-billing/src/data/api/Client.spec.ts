import { AxiosHeaders, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as coreApi from '@ovh-ux/manager-core-api';

import * as AppC from '@/App.constants';

import { deleteJSON, fetchListing, getJSON, postJSON, putJSON } from './Client.api';

// Define a minimal client type instead of `any`
type MockableAxios = Pick<AxiosInstance, 'get' | 'post' | 'put' | 'delete'>;

// helper to fake axios responses
const makeResponse = <T>(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: new AxiosHeaders(),
  } as InternalAxiosRequestConfig,
});

// eslint-disable-next-line max-lines-per-function
describe('API client helpers', () => {
  const mockGet = vi.fn();
  const mockPost = vi.fn();
  const mockPut = vi.fn();
  const mockDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    const fakeClient: MockableAxios = {
      get: mockGet,
      post: mockPost,
      put: mockPut,
      delete: mockDelete,
    };

    // patch both v6 and v2 axios clients with typed cast
    Object.assign(coreApi.v6 as unknown as MockableAxios, fakeClient);
    Object.assign(coreApi.v2 as unknown as MockableAxios, fakeClient);
  });

  it('getJSON should call axios.get with params and headers', async () => {
    mockGet.mockResolvedValue(makeResponse({ foo: 'bar' }));

    const result = await getJSON('v6', '/test', {
      params: { a: 1 },
      headers: { h: 'x' },
      disableCache: true,
    });

    expect(result).toEqual({ foo: 'bar' });
    expect(mockGet).toHaveBeenCalledWith('/test', {
      params: { a: 1 },
      headers: { h: 'x', Pragma: 'no-cache' },
    });
  });

  it('postJSON should call axios.post with body and options', async () => {
    mockPost.mockResolvedValue(makeResponse({ ok: true }));

    const result = await postJSON('v2', '/route', { foo: 1 }, { params: { q: 2 } });
    expect(result).toEqual({ ok: true });
    expect(mockPost).toHaveBeenCalledWith('/route', { foo: 1 }, { params: { q: 2 }, headers: {} });
  });

  it('putJSON should call axios.put with body and options', async () => {
    mockPut.mockResolvedValue(makeResponse({ updated: true }));

    const result = await putJSON('v6', '/route', { foo: 'bar' });
    expect(result).toEqual({ updated: true });
    expect(mockPut).toHaveBeenCalledWith(
      '/route',
      { foo: 'bar' },
      { params: undefined, headers: {} },
    );
  });

  it('deleteJSON should call axios.delete with options', async () => {
    mockDelete.mockResolvedValue(makeResponse({ deleted: true }));

    const result = await deleteJSON('v6', '/route');
    expect(result).toEqual({ deleted: true });
    expect(mockDelete).toHaveBeenCalledWith('/route', {
      params: undefined,
      headers: {},
    });
  });
});

// eslint-disable-next-line max-lines-per-function
describe('fetchListing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetchIcebergV6 when APP_FEATURES.listingApi = v6Iceberg', async () => {
    vi.spyOn(coreApi, 'fetchIcebergV6').mockResolvedValue({
      data: [{ id: 1 }],
      totalCount: 42,
      status: 200,
    });

    vi.spyOn(AppC, 'APP_FEATURES', 'get').mockReturnValue({
      ...AppC.APP_FEATURES,
      listingApi: 'v6Iceberg',
    });

    const result = await fetchListing('/my/route', { page: 2 });
    expect(coreApi.fetchIcebergV6).toHaveBeenCalledWith(
      expect.objectContaining({ route: '/my/route', page: 2 }),
    );
    expect(result.data).toEqual([{ id: 1 }]);
    expect(result.totalCount).toBe(42);
  });

  it('calls fetchIcebergV2 when APP_FEATURES.listingApi = v2', async () => {
    vi.spyOn(coreApi, 'fetchIcebergV2').mockResolvedValue({
      data: [{ id: 1 }],
      cursorNext: 'next',
      status: 200,
    });

    vi.spyOn(AppC, 'APP_FEATURES', 'get').mockReturnValue({
      ...AppC.APP_FEATURES,
      listingApi: 'v2',
    });

    const result = await fetchListing('/my/route', { cursor: 'cur' });
    expect(coreApi.fetchIcebergV2).toHaveBeenCalledWith(
      expect.objectContaining({ route: '/my/route', cursor: 'cur' }),
    );
    expect(result.data).toEqual([{ id: 1 }]);
    expect(result.cursorNext).toBe('next');
  });

  it('falls back to plain v6 listing if APP_FEATURES.listingApi = v6', async () => {
    vi.spyOn(AppC, 'APP_FEATURES', 'get').mockReturnValue({
      ...AppC.APP_FEATURES,
      listingApi: 'v6',
    });

    const mockGet = vi.fn().mockResolvedValue(makeResponse([{ id: 'a' }, { id: 'b' }]));
    Object.assign(coreApi.v6 as unknown as MockableAxios, { get: mockGet });

    const result = await fetchListing('/plain');
    expect(mockGet).toHaveBeenCalledWith('/plain', {
      params: undefined,
      headers: {},
    });
    expect(result.data.length).toBe(2);
    expect(result.totalCount).toBe(2);
  });
});
