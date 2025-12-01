import { Locale } from 'date-fns';

import { Tenant, TenantListing } from '@/types/tenants.type';
import { formatObservabilityDuration } from '@/utils/duration.utils';

export const mapTenantsToListing = (tenants: Tenant[], dateFnsLocale: Locale): TenantListing[] => {
  const result: TenantListing[] = tenants.map(({ id, currentState, iam }) => {
    const { title, limits, infrastructure } = currentState;
    const entryPoint = infrastructure?.entryPoint;
    const retention = limits?.mimir?.compactor_blocks_retention_period
      ? formatObservabilityDuration(limits?.mimir?.compactor_blocks_retention_period, dateFnsLocale)
      : undefined;
    const numberOfSeries = limits?.mimir?.max_global_series_per_user;
    const tags = iam?.tags ?? {};
    const tagsStr = Object.entries(iam?.tags ?? {})
      .map(([key, value]) => `${key}:${value}`)
      .join(';');

    return {
      id,
      name: title,
      infrastructure: infrastructure,
      endpoint: entryPoint,
      retention: retention,
      numberOfSeries: numberOfSeries,
      tags: tags,
      search: `${title} ${entryPoint ?? ''} ${retention ?? ''} ${numberOfSeries ?? ''} ${tagsStr}`,
    };
  });
  return result;
};
