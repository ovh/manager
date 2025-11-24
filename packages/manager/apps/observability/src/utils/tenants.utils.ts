import { Locale } from 'date-fns';

import { Tenant, TenantListing } from '@/types/tenants.type';
import { formatDuration } from '@/utils/duration.utils';

export const mapTenantsToListing = (tenants: Tenant[], dateFnsLocale: Locale): TenantListing[] => {
  const result: TenantListing[] = tenants.map(({ id, currentState, iam }) => {
    const { title, limits, infrastructure } = currentState;
    const entryPoint = infrastructure?.currentState.entryPoint;
    const retention = limits?.retention?.duration
      ? formatDuration(limits.retention.duration, dateFnsLocale)
      : undefined;
    const numberOfSeries = limits?.numberOfSeries?.current;
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
