import { SubscriptionUrls } from '@/types/SubscriptionUrls.type';
import { Region } from '@/types/region.type';

export interface IMetricsToCustomerModule {
  resourceName: string;
  productType: string;
  resourceURN: string;
  regions: Region[];
  defaultRetention: string;
  subscriptionUrls: SubscriptionUrls;
  enableConfigurationManagement?: boolean;
}
