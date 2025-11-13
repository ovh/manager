import { Locale } from 'date-fns';

import { Tenant, TenantListing } from '@/types/tenants.type';
import { formatDuration } from '@/utils/duration.utils';

export const mapTenantsToListing = (tenants: Tenant[], dateFnsLocale: Locale): TenantListing[] => {
  const result: TenantListing[] = tenants.map(({ id, currentState }) => {
    const { title, limits, infrastructure, tags } = currentState;
    return {
      id,
      name: title,
      infrastructure: infrastructure,
      endpoint: infrastructure?.currentState.entryPoint,
      retention: limits?.retention?.duration
        ? formatDuration(limits.retention.duration, dateFnsLocale)
        : undefined,
      numberOfSeries: limits?.numberOfSeries?.current,
      tags: tags?.join(';') ?? '',
      tagsArray: tags ?? [],
    };
  });
  return result;
};
