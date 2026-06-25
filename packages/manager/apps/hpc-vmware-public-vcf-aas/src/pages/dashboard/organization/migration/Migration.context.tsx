import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useVcdOrganization,
  PublicVcda,
  VcdaResourceStatus,
  VcdaWhitelistEntry,
} from '@ovh-ux/manager-module-vcd-api';
import { useVcdaMigration } from '@/data/hooks/vcda/useVcdaMigration.hook';

interface MigrationContextValue {
  orgId: string;
  migration: PublicVcda | undefined;
  migrationId: string;
  endpointUrl: string | undefined;
  whitelist: VcdaWhitelistEntry[];
  resourceStatus: VcdaResourceStatus | undefined;
  isEditable: boolean;
  organisationUrn: string | undefined;
  isPending: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => void;
}

const MigrationContext = createContext<MigrationContextValue | null>(null);

export function MigrationProvider({ children }: { children: ReactNode }) {
  const { id } = useParams();
  const orgId = id ?? '';
  const { data: organisation } = useVcdOrganization({ id: orgId });
  const {
    data: migration,
    isPending,
    isError,
    error,
    refetch,
  } = useVcdaMigration(orgId);

  const whitelist = useMemo<VcdaWhitelistEntry[]>(
    () => (migration?.currentState?.ips ?? []).map((ip) => ({ ip })),
    [migration],
  );

  const value = useMemo<MigrationContextValue>(
    () => ({
      orgId,
      migration,
      migrationId: migration?.id ?? '',
      endpointUrl: migration?.currentState?.migrationCloudUrl,
      whitelist,
      resourceStatus: migration?.resourceStatus,
      isEditable: migration?.resourceStatus === 'READY',
      organisationUrn: organisation?.data?.iam?.urn,
      isPending,
      isError,
      error: (error as ApiError) ?? null,
      refetch,
    }),
    [
      orgId,
      migration,
      whitelist,
      organisation,
      isPending,
      isError,
      error,
      refetch,
    ],
  );

  return (
    <MigrationContext.Provider value={value}>
      {children}
    </MigrationContext.Provider>
  );
}

export function useMigrationContext() {
  const context = useContext(MigrationContext);
  if (!context) {
    throw new Error(
      'useMigrationContext must be used within MigrationProvider',
    );
  }
  return context;
}
