import { BackupFork } from '@/types/cloud/project/database/service/creation/BackupFork';
import { Time } from '@/types/Time';
import { Backup } from '@/types/cloud/project/database/service/Backup';
import { Disk } from '@/types/cloud/project/database/service/Disk';
import { ForkFrom } from '@/types/cloud/project/database/service/creation/ForkFrom';
import { IpRestriction } from '@/types/cloud/project/database/service/IpRestriction';
import { NodeCreation } from '@/types/cloud/project/database/service/NodeCreation';
import { NodePattern } from '@/types/cloud/project/database/service/NodePattern';

/** Cloud databases cluster definition */
export interface ServiceCreation {
  /** Backup from which the new service is created. DEPRECATED: use forkFrom */
  backup?: BackupFork;
  /** Time on which backups start every day. DEPRECATED: use backups.time */
  backupTime?: Time;
  /** Information related to the backups, null if the engine does not support backups */
  backups?: Backup;
  /** Description of the cluster */
  description: string;
  /** Disk attributes of the cluster */
  disk?: Disk;
  /** Backup from which the new service is created */
  forkFrom?: ForkFrom;
  /** IP Blocks authorized to access to the cluster */
  ipRestrictions: IpRestriction[];
  /** Time on which maintenances can start every day */
  maintenanceTime: Time;
  /** Private network ID in which the cluster is */
  networkId: string;
  /** List of nodes in the cluster, not compatible with nodesPattern */
  nodesList?: NodeCreation[];
  /** Pattern definition of the nodes in the cluster, not compatible with nodesList */
  nodesPattern?: NodePattern;
  /** Plan of the cluster */
  plan: string;
  /** Private subnet ID in which the cluster is */
  subnetId: string;
  /** Version of the engine deployed on the cluster */
  version: string;
}
