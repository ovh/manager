import { SubscriptionUrls } from '@/types/SubscriptionUrls.type';
import { Region } from '@/types/region.type';

export type BaseM2CProperties = {
  resourceName: string;
  productType: string;
  resourceURN: string;
};

export type WithSubscriptionManagement = {
  enableConfigurationManagement: true;
  defaultRetention: string;
  subscriptionUrls: SubscriptionUrls;
};

export type WithoutSubscriptionManagement = {
  enableConfigurationManagement: false;
  defaultRetention?: string;
  subscriptionUrls?: SubscriptionUrls;
};

export type SubscriptionManagementConfig =
  | WithSubscriptionManagement
  | WithoutSubscriptionManagement;

type BaseMetricsToCustomerState = BaseM2CProperties & {
  regions: Region[];
};

export type MetricsToCustomerState = BaseMetricsToCustomerState & SubscriptionManagementConfig;

export interface MetricsToCustomerContextType {
  state: MetricsToCustomerState;
  setState: React.Dispatch<React.SetStateAction<MetricsToCustomerState>>;
}
