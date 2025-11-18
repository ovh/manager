import { Locale } from 'date-fns';

import { Tenant, TenantListing } from '@/types/tenants.type';
import { formatDuration } from '@/utils/duration.utils';

export const mapTenantsToListing = (tenants: Tenant[], dateFnsLocale: Locale): TenantListing[] => {
  const result: TenantListing[] = tenants.map(({ id, currentState }) => {
    const { title, limits, infrastructure, tags } = currentState;
    const entryPoint = infrastructure?.currentState.entryPoint;
    const retention = limits?.retention?.duration
      ? formatDuration(limits.retention.duration, dateFnsLocale)
      : undefined;
    const numberOfSeries = limits?.numberOfSeries?.current;
    const tagsStr = tags?.join(';') ?? '';

    return {
      id,
      name: title,
      infrastructure: infrastructure,
      endpoint: entryPoint,
      retention: retention,
      numberOfSeries: numberOfSeries,
      tags: tagsStr,
      tagsArray: tags ?? [],
      search: `${title} ${entryPoint ?? ''} ${retention ?? ''} ${numberOfSeries ?? ''} ${tagsStr}`,
    };
  });
  return result;
};
