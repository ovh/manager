import { v6 } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  hostingDeleteLocation,
  hostingLocalSeoLogin,
} from '@/data/api/local-seo';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi
      .fn()
      .mockReturnValue({ data: {}, headers: { 'x-pagination-total': '1' } }),
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('hostingLocalSeoLogin', () => {
  it('should call v6.post with the correct URL', async () => {
    const serviceName = 'srv-123';
    const accountId = 'accountId-123';

    await hostingLocalSeoLogin(serviceName, accountId);

    expect(v6.post).toHaveBeenCalledWith(
      `/hosting/web/${serviceName}/localSeo/account/${accountId}/login`,
    );
  });
});

describe('hostingDeleteLocation', () => {
  it('should call v6.post with the correct URL', async () => {
    const serviceName = 'srv-123';
    const locationId = 'locationId-123';

    await hostingDeleteLocation(serviceName, locationId);

    expect(v6.post).toHaveBeenCalledWith(
      `/hosting/web/${serviceName}/localSeo/location/${locationId}/terminate`,
    );
  });
});
