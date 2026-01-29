import { SubscriptionUrls } from '@/types/SubscriptionUrls.type';
import { Region } from '@/types/region.type';

export interface MetricsToCustomerState {
  resourceName: string;
  productType: string;
  resourceURN: string;
  regions: Region[];
  defaultRetention: string;
  subscriptionUrls: SubscriptionUrls;
  enableConfigurationManagement: boolean;
}

export interface MetricsToCustomerContextType {
  state: MetricsToCustomerState;
  setState: React.Dispatch<React.SetStateAction<MetricsToCustomerState>>;
}
