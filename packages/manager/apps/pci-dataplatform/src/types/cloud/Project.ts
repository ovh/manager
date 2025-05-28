import { AccessTypeEnum } from '@/types/cloud/AccessTypeEnum';
import { ProjectStatusEnum } from '@/types/cloud/project/ProjectStatusEnum';

/** Project */
export interface Project {
  /** Project access */
  access?: AccessTypeEnum;
  /** Project creation date */
  creationDate?: string;
  /** Description of your project */
  description: string;
  /** Expiration date of your project. After this date, your project will be deleted */
  expiration?: string;
  /** Manual quota prevent automatic quota upgrade */
  manualQuota: boolean;
  /** Project order id */
  orderId?: number;
  /** Order plan code */
  planCode?: PlanCode;
  /** Project name */
  projectName?: string;
  /** Project id */
  project_id?: string;
  /** Current status */
  status?: ProjectStatusEnum;
  /** Project unleashed */
  unleash?: boolean;
}

export enum PlanCode {
  DISCOVERY = 'project.discovery',
  STANDARD = 'project.2018',
}
