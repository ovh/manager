export interface IMetricsToCustomerModule {
  resourceName: string;
  productType: string;
  resourceURN: string;
  regions: string[];
  enableConfigurationManagement?: boolean;
}
