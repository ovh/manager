export interface MetricsToCustomerState {
  resourceName: string;
  productType: string;
  resourceURN: string;
  regions: string[];
  enableConfigurationManagement: boolean;
}

export interface MetricsToCustomerContextType {
  state: MetricsToCustomerState;
  setState: React.Dispatch<React.SetStateAction<MetricsToCustomerState>>;
}
