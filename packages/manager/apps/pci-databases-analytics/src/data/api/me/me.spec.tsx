import { describe, expect, vi } from 'vitest';
import { apiClient } from '@/data/api/api.client';
import { getGeolocation } from "./me.api";

vi.mock('@/data/api/api.client', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/data/api/api.client')>();
  const post = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    ...mod,
    apiClient: {
      v6: {
        post,
      },
    },
  };
});

describe('me service functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getGeolocation', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await getGeolocation();
    expect(apiClient.v6.post).toHaveBeenCalledWith('/me/geolocation');
  });
});
