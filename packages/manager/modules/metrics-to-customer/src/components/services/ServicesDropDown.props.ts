import { ObservabilityService } from '@/types/observability.type';

export interface ServicesDropDownProps {
  /**
   * List of available services
   */
  services?: ObservabilityService[];
  
  /**
   * Currently selected service ID
   */
  selectedServiceId?: string;
  
  /**
   * Whether services are loading
   */
  isLoading?: boolean;
  
  /**
   * Callback when service selection changes
   */
  onChange?: (value: string | null) => void;
}
