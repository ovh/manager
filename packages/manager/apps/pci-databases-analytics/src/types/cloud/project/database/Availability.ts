import { BackupTypeEnum } from '@/types/cloud/project/database/BackupTypeEnum';
import { Backups } from '@/types/cloud/project/database/availability/Backups';
import { CategoryEnum } from '@/types/cloud/project/database/engine/CategoryEnum';
import { Lifecycle } from '@/types/cloud/project/database/availability/Lifecycle';
import { NetworkTypeEnum } from '@/types/cloud/project/database/NetworkTypeEnum';
import { Specifications } from '@/types/cloud/project/database/availability/Specifications';
import { StatusEnum } from '@/types/cloud/project/database/availability/StatusEnum';

/** Availability of databases engines on cloud projects */
export interface Availability {
  /** Defines the type of backup. DEPRECATED: use backups.enable */
  backup?: BackupTypeEnum;
  /** Backup retention time of the availability in days. DEPRECATED: use backups.retentionDays */
  backupRetentionDays?: number;
  /** Defines backups strategy for the availability */
  backups?: Backups;
  /** Category of the engine */
  category?: CategoryEnum;
  /** Whether this availability can be used by default */
  default?: boolean;
  /** End of life of the product. DEPRECATED: use lifecycle.endOfLife */
  endOfLife?: string;
  /** Database engine name */
  engine?: string;
  /** Flavor name. DEPRECATED: use specifications.flavor */
  flavor?: string;
  /** Defines the lifecycle of the availability */
  lifecycle?: Lifecycle;
  /** Maximum possible disk size in GB. DEPRECATED: use specifications.storage.maximum */
  maxDiskSize?: number;
  /** Maximum nodes of the cluster. DEPRECATED: use specifications.nodes.maximum */
  maxNodeNumber?: number;
  /** Minimum possible disk size in GB. DEPRECATED: use specifications.storage.minimum */
  minDiskSize?: number;
  /** Minimum nodes of the cluster. DEPRECATED: use specifications.nodes.minimum */
  minNodeNumber?: number;
  /** Type of network. DEPRECATED: use specifications.network */
  network?: NetworkTypeEnum;
  /** Plan name */
  plan?: string;
  /** Region name */
  region?: string;
  /** Defines the technical specifications of the availability */
  specifications?: Specifications;
  /** Date of the release of the product. DEPRECATED: use lifecycle.startDate */
  startDate?: string;
  /** Status of the availability. DEPRECATED: use lifecycle.status */
  status?: StatusEnum;
  /** Flex disk size step in GB. DEPRECATED: use specifications.storage.step */
  stepDiskSize?: number;
  /** End of life of the upstream product. DEPRECATED: use lifecycle */
  upstreamEndOfLife?: string;
  /** Version name */
  version?: string;
}
