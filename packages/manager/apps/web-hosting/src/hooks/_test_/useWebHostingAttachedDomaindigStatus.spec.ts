import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { attachedDomainDigStatusMock } from '@/api/_mock_';
import { useWebHostingAttachedDomaindigStatus } from '@/hooks';
import { wrapper } from '@/test.provider';

describe('useWebHostingAttachedDomaindigStatus', () => {
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
