import { describe, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { v6 } from '@ovh-ux/manager-core-api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetImportsIPs, useMoveIP } from './useImportIP';
import { getImportsIPs } from '@/api/data/import-ip';

vi.mock('@ovh-ux/manager-core-api', () => {
  const post = vi.fn(() => Promise.resolve({ data: null }));
  return {
    v6: { post },
  };
});

vi.mock('@/api/data/import-ip', async (importOriginal) => {
  const mock = vi.fn(() => Promise.resolve([]));
  return {
    ...(await importOriginal<typeof import('@/api/data/import-ip')>()),
    getImportsIPs: mock,
  };
});

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useImportIP', () => {
  it('should get import ips', async () => {
    const projectId = '123';
    expect(getImportsIPs).not.toHaveBeenCalled();
    renderHook(
      () =>
        useGetImportsIPs(projectId, {
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      { wrapper },
    );
    expect(getImportsIPs).toHaveBeenCalledWith('123');
  });
  it('should move ips', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const projectId = '123';
    const ip = '127.0.0.1';
    expect(v6.post).not.toHaveBeenCalled();
    const { result } = renderHook(
      () =>
        useMoveIP({
          projectId,
          onError,
          onSuccess,
        }),
      { wrapper },
    );
    await result.current.mutateAsync(ip);
    expect(v6.post).toHaveBeenCalledWith(`/ip/${ip}/move`, { to: projectId });
  });
});
