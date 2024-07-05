import { Lifecycle } from '@/types/cloud/project/database/availability/Lifecycle';

/** Cloud Database plan definition */
export interface Plan {
  /** Automatic backup retention duration */
  backupRetention?: string;
  /** Description of the plan */
  description?: string;
  /** Defines the lifecycle of the availability */
  lifecycle?: Lifecycle;
  /** Name of the plan */
  name?: string;
  /** Display order */
  order?: number;
  /** Display tags */
  tags?: string[];
}
