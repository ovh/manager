import { RoleEnum } from '@/types/cloud/project/database/service/node/RoleEnum';
import { StatusEnum } from '@/types/cloud/project/database/StatusEnum';

/** Cloud databases cluster new node definition */
export interface NodeCreation {
  /** Date of the creation of the node */
  createdAt?: string;
  /** Flavor of the node */
  flavor: string;
  /** Node ID */
  id?: string;
  /** Name of the node */
  name?: string;
  /** Connection port for the node */
  port?: number;
  /** Region of the node */
  region: string;
  /** Role of the node */
  role: RoleEnum;
  /** Current status of the node */
  status?: StatusEnum;
}
