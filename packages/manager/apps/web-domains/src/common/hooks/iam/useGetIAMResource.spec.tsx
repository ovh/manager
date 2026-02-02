import '@/common/setupTests';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { wrapper } from '@/common/utils/test.provider';
import { useGetIAMResource } from './useGetIAMResource';
import { getIAMResource, IAMResource } from '@/common/data/api/common.api';

vi.mock('@/common/data/api/common.api');

const iamResourcesMock: IAMResource[] = [
  {
    id: 'resource-1',
    urn: 'urn:ovh:resource:1',
    name: 'resource-name-1',
    displayName: 'Resource 1',
    type: 'type-a',
    owner: 'owner-a',
    tags: { env: 'prod' },
  },
  {
    id: 'resource-2',
    urn: 'urn:ovh:resource:2',
    name: 'resource-name-2',
    displayName: 'Resource 2',
    type: 'type-a',
    owner: 'owner-b',
    tags: { env: 'preprod' },
  },
];

describe('useGetIAMResource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return IAM resources when query succeeds', async () => {
    vi.mocked(getIAMResource).mockResolvedValue(iamResourcesMock);

    const { result } = renderHook(
      () => useGetIAMResource('res-success', 'type-a'),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(iamResourcesMock);
    expect(getIAMResource).toHaveBeenCalledWith('res-success', 'type-a');
  });

  it('should expose loading state while fetching', () => {
    vi.mocked(getIAMResource).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(
      () => useGetIAMResource('res-loading', 'type-b'),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);
  });

  it('should expose error state when query fails', async () => {
    vi.mocked(getIAMResource).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(
      () => useGetIAMResource('res-error', 'type-c'),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('API Error');
    expect(result.current.data).toBeUndefined();
    expect(getIAMResource).toHaveBeenCalledWith('res-error', 'type-c');
  });
});
