import { TenantSubscriptionListing } from '@/types/tenants.type';

export type UnsubscribeLinkProps = {
  tenantId: string;
  resourceName: string;
  subscription: TenantSubscriptionListing;
};
