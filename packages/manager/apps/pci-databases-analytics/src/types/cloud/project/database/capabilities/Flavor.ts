import { Lifecycle } from '@/types/cloud/project/database/availability/Lifecycle';
import { Specifications } from '@/types/cloud/project/database/capabilities/flavor/Specifications';

/** Cloud Database flavor definition */
export interface Flavor {
  /** Flavor core number. DEPRECATED: use specifications.core */
  core?: number;
  /** Defines the lifecycle of the flavor */
  lifecycle?: Lifecycle;
  /** Flavor ram size in GB. DEPRECATED: use specifications.memory */
  memory?: number;
  /** Name of the flavor */
  name?: string;
  /** Display order */
  order?: number;
  /** Technical specifications of the flavor */
  specifications?: Specifications;
  /** Flavor disk size in GB. DEPRECATED: use specifications.storage */
  storage?: number;
  /** Display tags */
  tags?: string[];
}
