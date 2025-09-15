import '@testing-library/jest-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCreateCertificate, useCreateDomainCertificate } from '@/data/hooks/ssl/useSsl';
import { wrapper } from '@/utils/test.provider';

const { mockPost } = vi.hoisted(() => ({
  mockPost: vi.fn().mockResolvedValue({ data: {} }),
}));

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    post: mockPost,
  },
}));

const onSuccess = vi.fn();
const onError = vi.fn();

describe('useCreateCertificate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('create certificate on import', async () => {
    const { result } = renderHook(() => useCreateCertificate('serviceName', onSuccess, onError), {
      wrapper,
    });

    act(() =>
      result.current.mutate({
        certificate: 'certificate',
        key: 'key',
        chain: 'chain',
      }),
    );

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/hosting/web/serviceName/ssl', {
        certificate: 'certificate',
        key: 'key',
        chain: 'chain',
      });

      expect(onSuccess).toHaveBeenCalled();
    });
  });
});

describe('useCreateDomainCertificate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('create domain certificate on import', async () => {
    const { result } = renderHook(
      () => useCreateDomainCertificate('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() => result.current.mutate('domain'));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/hosting/web/serviceName/attachedDomain/domain/ssl');

      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
