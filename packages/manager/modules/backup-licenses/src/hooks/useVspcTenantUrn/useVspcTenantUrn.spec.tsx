import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { createQueryClientTest } from '@/test-utils/renderWithProviders';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';
import { VspcTenant } from '@/types/VspcTenant.type';

import { useVspcTenantUrn } from './useVspcTenantUrn';

vi.mock('@/data/api/tenants/tenants.requests');

const mockedGetBackupServicesTenants = vi.mocked(getBackupServicesTenants);
const mockedGetVspcTenants = vi.mocked(getVspcTenants);

const buildResource = <T,>(id: string, currentState: T, iam?: Resource<T>['iam']): Resource<T> => ({
  id,
  resourceStatus: 'READY',
  currentState,
  iam,
});

const renderUseVspcTenantUrn = () => {
  const queryClient = createQueryClientTest();

  return renderHook(() => useVspcTenantUrn(), {
    wrapper: ({ children }: React.PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('useVspcTenantUrn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetBackupServicesTenants.mockResolvedValue([
      buildResource<BackupServicesTenant>('service-1', { id: 'service-1', name: 'service' }),
    ]);
  });

  it('résout la cascade backupServicesId → vspcTenantId puis renvoie son urn IAM', async () => {
    mockedGetVspcTenants.mockResolvedValue([
      buildResource<VspcTenant>(
        'vspc-1',
        { id: 'vspc-1' },
        { id: 'vspc-1', urn: 'urn:v1:eu:resource:backupServices:vspc/vspc-1' },
      ),
    ]);

    const { result } = renderUseVspcTenantUrn();

    await waitFor(() =>
      expect(result.current).toBe('urn:v1:eu:resource:backupServices:vspc/vspc-1'),
    );
    expect(mockedGetVspcTenants).toHaveBeenCalledWith('service-1');
  });

  it("renvoie undefined tant que le tenant n'a pas d'urn IAM (contrat BE non confirmé)", async () => {
    mockedGetVspcTenants.mockResolvedValue([buildResource<VspcTenant>('vspc-1', { id: 'vspc-1' })]);

    const { result } = renderUseVspcTenantUrn();

    await waitFor(() => expect(mockedGetVspcTenants).toHaveBeenCalled());
    expect(result.current).toBeUndefined();
  });

  it('renvoie undefined quand la cascade échoue', async () => {
    mockedGetBackupServicesTenants.mockResolvedValue([]);

    const { result } = renderUseVspcTenantUrn();

    await waitFor(() => expect(mockedGetBackupServicesTenants).toHaveBeenCalled());
    expect(mockedGetVspcTenants).not.toHaveBeenCalled();
    expect(result.current).toBeUndefined();
  });
});
