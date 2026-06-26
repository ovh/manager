import { queryOptions } from '@tanstack/react-query';

import { getBaremetalDetails, getBaremetals } from '@/data/api/baremetal/baremetals.requests';

import { queryKeys } from './queryKeys';

// ─── Base queries (no QueryClient needed) ───

const all = () =>
  queryOptions({
    queryKey: queryKeys.baremetals.all,
    queryFn: () => getBaremetals(),
    select: (data) =>
      [...data].sort((a, b) =>
        (a.iam?.displayName ?? a.name).localeCompare(b.iam?.displayName ?? b.name),
      ),
  });

const detail = (serviceName: string) =>
  queryOptions({
    queryKey: queryKeys.baremetals.detail(serviceName),
    queryFn: () => getBaremetalDetails(serviceName),
    enabled: !!serviceName,
  });

// ─── Factory ───

export const baremetalsQueries = { all, detail };
