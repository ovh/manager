import { describe, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { attachedDomainDigStatusMock } from '@/data/__mocks__';
import { useWebHostingAttachedDomaindigStatus } from './useWebHostingAttachedDomaindigStatus';
import { wrapper } from '@/utils/test.provider';

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
      () =>
        useWebHostingAttachedDomaindigStatus('testServiceName', 'testDomain'),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(attachedDomainDigStatusMock);
  });
});
