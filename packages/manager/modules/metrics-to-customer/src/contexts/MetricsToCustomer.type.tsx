import { SubscriptionUrls } from '@/types/SubscriptionUrls.type';

export interface MetricsToCustomerState {
  resourceName: string;
  productType: string;
  resourceURN: string;
  regions: string[];
  subscriptionUrls: SubscriptionUrls;
  enableConfigurationManagement: boolean;
}

export interface MetricsToCustomerContextType {
  state: MetricsToCustomerState;
  setState: React.Dispatch<React.SetStateAction<MetricsToCustomerState>>;
}
