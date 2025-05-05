import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import { v6 } from '@ovh-ux/manager-core-api';
import { useUpdateHostingService } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { wrapper } from '@/utils/test.provider';

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
      expect(v6.put).toHaveBeenCalledWith('/hosting/web/serviceName', {
        displayName: 'displayName',
      });

      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
