import '@testing-library/jest-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useUpdateHostingService } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { wrapper } from '@/utils/test.provider';

const { mockPut } = vi.hoisted(() => ({
  mockPut: vi.fn().mockResolvedValue({ data: {} }),
}));

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    put: mockPut,
  },
}));
const onSuccess = vi.fn();
const onError = vi.fn();

describe('useUpdateHostingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('update hosting service information', async () => {
    const { result } = renderHook(
      () => useUpdateHostingService('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() =>
      result.current.mutate({
        displayName: 'displayName',
      }),
    );

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith('/hosting/web/serviceName', {
        displayName: 'displayName',
      });

      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
