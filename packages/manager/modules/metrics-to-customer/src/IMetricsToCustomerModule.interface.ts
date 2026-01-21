import { SubscriptionUrls } from '@/types/SubscriptionUrls.type';

export interface IMetricsToCustomerModule {
  resourceName: string;
  productType: string;
  resourceURN: string;
  regions: string[];
  subscriptionUrls: SubscriptionUrls;
  enableConfigurationManagement?: boolean;
}
