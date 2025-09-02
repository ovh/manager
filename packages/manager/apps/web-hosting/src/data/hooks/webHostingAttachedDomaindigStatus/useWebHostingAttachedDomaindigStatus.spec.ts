import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, vi } from 'vitest';

import { attachedDomainDigStatusMock } from '@/data/__mocks__';
import { wrapper } from '@/utils/test.provider';

import { useWebHostingAttachedDomaindigStatus } from './useWebHostingAttachedDomaindigStatus';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn().mockResolvedValue({ data: attachedDomainDigStatusMock }),
  },
}));

describe('useWebHostingAttachedDomaindigStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return webhosting attached domain dig status ', async () => {
    const { result } = renderHook(
      () => useWebHostingAttachedDomaindigStatus('testServiceName', 'testDomain'),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(attachedDomainDigStatusMock);
  });
});
