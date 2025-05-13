import { ServicePlanEnum } from './ServicePlanEnum';
import { ServiceStateEnum } from './ServiceStateEnum';

/** Service */
export interface Service {
  /** Service creation */
  createdAt: string;
  /** Service custom name */
  displayName?: string;
  /** If set, can perform extra action on cluster */
  isClusterOwner: boolean;
  /** Is IAM enabled for this service? */
  isIamEnabled: boolean;
  /** Service plan */
  plan: ServicePlanEnum;
  /** Service name */
  serviceName: string;
  /** Service state */
  state: ServiceStateEnum;
  /** Service last update */
  updatedAt?: string;
  /** Username on DBaaS Logs */
  username: string;
}
