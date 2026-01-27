import { Locale } from 'date-fns';

import {
  Tenant,
  TenantListing,
  TenantSubscription,
  TenantSubscriptionListing,
} from '@/types/tenants.type';
import { formatObservabilityDuration } from '@/utils/duration.utils';
import { formatNumberWithLocale } from '@/utils/number.utils';

export const mapTenantsToListing = (tenants: Tenant[], dateFnsLocale: Locale): TenantListing[] => {
  const result: TenantListing[] = tenants.map(({ id, currentState, iam, resourceStatus }) => {
    const { title, endpoint, limits, infrastructure } = currentState;
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
      infrastructure,
      entryPoint,
      endpoint,
      retention,
      numberOfSeries: formatNumberWithLocale(numberOfSeries, dateFnsLocale),
      resourceStatus,
      tags,
      search: `${title} ${entryPoint ?? ''} ${retention ?? ''} ${numberOfSeries ?? ''} ${tagsStr}`,
    };
  });
  return result;
};

export const mapSubscriptionsToListing = (
  subscriptions: TenantSubscription[],
): TenantSubscriptionListing[] => {
  return subscriptions.map(({ id, resourceStatus, currentState: { resource }, iam }) => ({
    id,
    resourceStatus,
    resource,
    tags: iam?.tags ?? {},
    urn: iam?.urn ?? '',
    search: [
      Object.entries(iam?.tags ?? {})
        .map(([key, value]) => `${key}:${value}`)
        .join(';'),
      resource.name,
      resource.type,
    ].join(' '),
  }));
};
