import { useQuery, useQueryClient } from '@tanstack/react-query';

import { backupLicenseQueries } from '@/data/queries/backupLicense.queries';

export function useBackupLicenseUrn(): string | undefined {
  const queryClient = useQueryClient();

  const { data: urn } = useQuery(backupLicenseQueries.withClient(queryClient).urn());

  return urn ?? undefined;
}
