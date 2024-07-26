import { Engine } from '@/types/cloud/project/database/capabilities/Engine';
import { Flavor } from '@/types/cloud/project/database/capabilities/Flavor';
import { Option } from '@/types/cloud/project/database/capabilities/Option';
import { Plan } from '@/types/cloud/project/database/capabilities/Plan';

/** Capabilities available for the databases engines on cloud projects */
export interface Capabilities {
  /** Disks available */
  disks?: string[];
  /** Database engines available */
  engines?: Engine[];
  /** Flavors available */
  flavors?: Flavor[];
  /** Options available */
  options?: Option[];
  /** Plans available */
  plans?: Plan[];
  /** Regions available */
  regions?: string[];
}
