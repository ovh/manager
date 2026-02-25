import { QueryClient, queryOptions } from '@tanstack/react-query';

import {
  getResourceServiceId,
  getResourceServiceIdQueryKey,
} from '@ovh-ux/manager-module-common-api';

import { getBackupServices } from '@/data/api/backup/backupServices.requests';

import { queryKeys } from './queryKeys';

const ONE_DAY_HOURS_IN_MS = 1000 * 60 * 60 * 24;

// ─── Base queries (no QueryClient needed) ───

const all = () =>
  queryOptions({
    queryKey: queryKeys.backupServices.all,
    queryFn: () => getBackupServices(),
    staleTime: ONE_DAY_HOURS_IN_MS,
  });

const agoraServiceId = (resourceName: string) =>
  queryOptions({
    queryKey: getResourceServiceIdQueryKey({ resourceName }),
    queryFn: () => getResourceServiceId({ resourceName }),
  });

// ─── Queries needing QueryClient ───

const withClient = (queryClient: QueryClient) => ({
  /** Resolves the first backupServicesId from cache (ensureQueryData). */
  backupServicesId: async () => (await queryClient.ensureQueryData(all()))[0]?.id,
});

// ─── Factory ───

export const servicesQueries = { all, agoraServiceId, withClient };
