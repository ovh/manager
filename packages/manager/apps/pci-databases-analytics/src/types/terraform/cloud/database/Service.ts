import { Backup } from '@/types/cloud/project/database/service/Backup';
import { Disk } from '@/types/cloud/project/database/service/Disk';
import { IpRestriction } from '@/types/terraform/cloud/database/service/IpRestriction';
import { Node } from '@/types/terraform/cloud/database/service/Node';
import { Time } from '@/types/Time';

/** Cloud databases cluster definition */
export interface Service {
  /** Defines whether the ACLs are enabled on an OpenSearch cluster. */
  aclsEnabled?: boolean;
  /** Advanced configuration key / value. */
  advancedConfiguration?: { [key: string]: string };
  /** Time on which backups start every day. */
  backupTime?: Time;
  /** Information related to the backups, null if the engine does not support backups */
  backups?: Backup;
  /** Small description of the database service. */
  description?: string;
  /** Storage attributes of the cluster */
  disk?: Disk;
  /** Public Cloud Database Service ID. */
  id?: string;
  /** IP Blocks authorized to access to the cluster. */
  ipRestrictions?: IpRestriction[];
  /** Time on which maintenances can start every day. */
  maintenanceTime?: Time;
  /** Private network id in which the node should be deployed. It's the regional openstackId of the private network */
  networkId?: string;
  /** List of nodes object. */
  nodesList: Node[];
  /** Plan of the cluster. */
  plan: string;
  /** Defines whether the REST API is enabled on a kafka cluster. */
  restAPI?: boolean;
  /** Defines whether the schema registry is enabled on a Kafka cluster. */
  schemaRegistry?: boolean;
  /** Private subnet ID in which the node is. */
  subnetId?: string;
  /** The version of the engine in which the service should be deployed. */
  version: string;
}
