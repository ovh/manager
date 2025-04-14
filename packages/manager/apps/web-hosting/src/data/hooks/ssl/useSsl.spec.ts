import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import { v6 } from '@ovh-ux/manager-core-api';
import { useCreateCertificate } from '@/data/hooks/ssl/useSsl';
import { wrapper } from '@/utils/test.provider';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

const onSuccess = vi.fn();
const onError = vi.fn();

describe('useCreateCertificate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('create certificate on import', async () => {
    const { result } = renderHook(
      () => useCreateCertificate('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() =>
      result.current.mutate({
        certificate: 'certificate',
        key: 'key',
        chain: 'chain',
      }),
    );

    await waitFor(() => {
      expect(v6.post).toHaveBeenCalledWith('/hosting/web/serviceName/ssl', {
        certificate: 'certificate',
        key: 'key',
        chain: 'chain',
      });

      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
