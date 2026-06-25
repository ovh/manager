import { ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateVcdaWhitelist } from './useUpdateVcdaWhitelist.hook';
import { getVcdaMigrationQueryKey } from './vcdaQueryKey';
import * as vcdaApi from '@ovh-ux/manager-module-vcd-api';

const ORG_ID = 'org-1';
const MIGRATION_ID = 'migration-1';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, queryClient };
};

describe('useUpdateVcdaWhitelist', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('PUTs the full ips array and invalidates the migration query (R11)', async () => {
    const putSpy = vi
      .spyOn(vcdaApi, 'updateVcdaMigrationWhitelist')
      .mockResolvedValue({ data: {} } as never);
    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(
      () =>
        useUpdateVcdaWhitelist({ orgId: ORG_ID, migrationId: MIGRATION_ID }),
      { wrapper },
    );

    result.current.mutate(['192.168.1.10', '10.0.0.5']);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(putSpy).toHaveBeenCalledWith(MIGRATION_ID, {
      ips: ['192.168.1.10', '10.0.0.5'],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: getVcdaMigrationQueryKey(ORG_ID),
    });
  });

  it('forwards a provided onSuccess callback', async () => {
    vi.spyOn(vcdaApi, 'updateVcdaMigrationWhitelist').mockResolvedValue({
      data: {},
    } as never);
    const onSuccess = vi.fn();
    const { wrapper } = createWrapper();

    const { result } = renderHook(
      () =>
        useUpdateVcdaWhitelist({
          orgId: ORG_ID,
          migrationId: MIGRATION_ID,
          onSuccess,
        }),
      { wrapper },
    );

    result.current.mutate(['10.0.0.5']);

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });
});
