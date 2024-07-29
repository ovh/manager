import { GpuInformation } from '@/types/cloud/project/ai/capabilities/flavor/GpuInformation';
import { ResourcesPerUnit } from '@/types/cloud/project/ai/capabilities/flavor/ResourcesPerUnit';
import { FlavorTypeEnum } from '@/types/cloud/project/ai/capabilities/FlavorTypeEnum';

/** AI Solutions Flavor */
export interface Flavor {
  /** Is the flavor the default one for a flavor type */
  default?: boolean;
  /** Flavor description */
  description?: string;
  /** Describe GPU information */
  gpuInformation?: GpuInformation;
  /** Flavor id */
  id?: string;
  /** Maximum amount available for a job / notebook */
  max?: number;
  /** Describe the amount of resources given per unit of the flavor */
  resourcesPerUnit?: ResourcesPerUnit;
  /** Flavor type */
  type?: FlavorTypeEnum;
}
