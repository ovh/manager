import { Time } from '@/types/Time';
import { Backup } from '@/types/cloud/project/database/service/Backup';
import { CapabilityActions } from '@/types/cloud/project/database/service/CapabilityActions';
import { CategoryEnum } from '@/types/cloud/project/database/engine/CategoryEnum';
import { Disk } from '@/types/cloud/project/database/service/Disk';
import { Endpoint } from '@/types/cloud/project/database/service/Endpoint';
import { EngineEnum } from '@/types/cloud/project/database/EngineEnum';
import { IpRestriction } from '@/types/cloud/project/database/service/IpRestriction';
import { NetworkTypeEnum } from '@/types/cloud/project/database/NetworkTypeEnum';
import { Node } from '@/types/cloud/project/database/service/Node';
import { StatusEnum } from '@/types/cloud/project/database/StatusEnum';
import { Storage } from '@/types/cloud/project/database/service/Storage';

/** Cloud database service definition */
export interface Service {
  /** Time on which backups start every day. DEPRECATED: use backups.time */
  backupTime: Time;
  /** Information related to the backups, null if the engine does not support backups */
  backups: Backup;
  /** Capabilities of the services */
  capabilities?: { [key: string]: CapabilityActions };
  /** Category of the engine */
  category?: CategoryEnum;
  /** Date of the creation of the cluster */
  createdAt?: string;
  /** Description of the cluster */
  description: string;
  /** Disk attributes of the cluster. DEPRECATED: use storage */
  disk: Disk;
  /** List of all endpoints of the service */
  endpoints?: Endpoint[];
  /** Name of the engine of the service */
  engine?: EngineEnum;
  /** The VM flavor used for this cluster */
  flavor: string;
  /** Service ID */
  id?: string;
  /** IP Blocks authorized to access to the cluster */
  ipRestrictions: IpRestriction[];
  /** Time on which maintenances can start every day */
  maintenanceTime: Time;
  /** Private network ID in which the cluster is */
  networkId?: string;
  /** Type of network of the cluster */
  networkType?: NetworkTypeEnum;
  /** Number of nodes in the cluster. DEPRECATED: use nodes */
  nodeNumber: number;
  /** Nodes of the cluster */
  nodes?: Node[];
  /** Plan of the cluster */
  plan: string;
  /** Region of the cluster */
  region: string;
  /** Current status of the cluster */
  status?: StatusEnum;
  /** Storage attributes of the cluster */
  storage: Storage;
  /** Private subnet ID in which the cluster is */
  subnetId?: string;
  /** Version of the engine deployed on the cluster */
  version: string;
}
