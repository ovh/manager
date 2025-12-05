import '@testing-library/jest-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  useCreateCertificate,
  useCreateDomainCertificate,
  useCreateDomainCertificates,
  useDeleteDomainCertificate,
} from '@/data/hooks/ssl/useSsl';
import { wrapper } from '@/utils/test.provider';

const { mockPost, mockDelete } = vi.hoisted(() => ({
  mockPost: vi.fn().mockResolvedValue({ data: {} }),
  mockDelete: vi.fn().mockResolvedValue({ data: {} }),
}));

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    post: mockPost,
    delete: mockDelete,
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

  it('should handle optional parameters', async () => {
    const { result } = renderHook(() => useCreateCertificate('serviceName', onSuccess, onError), {
      wrapper,
    });

    act(() =>
      result.current.mutate({
        certificate: 'certificate',
      }),
    );

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/hosting/web/serviceName/ssl', {
        certificate: 'certificate',
        key: undefined,
        chain: undefined,
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

describe('useCreateDomainCertificates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('create domain certificates for multiple domains', async () => {
    const { result } = renderHook(
      () => useCreateDomainCertificates('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() => result.current.mutate(['domain1', 'domain2', 'domain3']));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledTimes(3);
      expect(mockPost).toHaveBeenCalledWith('/hosting/web/serviceName/attachedDomain/domain1/ssl');
      expect(mockPost).toHaveBeenCalledWith('/hosting/web/serviceName/attachedDomain/domain2/ssl');
      expect(mockPost).toHaveBeenCalledWith('/hosting/web/serviceName/attachedDomain/domain3/ssl');

      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should handle empty domains array', async () => {
    const { result } = renderHook(
      () => useCreateDomainCertificates('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() => result.current.mutate([]));

    await waitFor(() => {
      expect(mockPost).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});

describe('useDeleteDomainCertificate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delete domain certificate', async () => {
    const { result } = renderHook(
      () => useDeleteDomainCertificate('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() => result.current.mutate('domain'));

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('/hosting/web/serviceName/attachedDomain/domain/ssl');

      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
