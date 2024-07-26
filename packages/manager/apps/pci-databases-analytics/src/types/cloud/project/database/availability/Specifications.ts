import { NetworkTypeEnum } from '@/types/cloud/project/database/NetworkTypeEnum';
import { Nodes } from '@/types/cloud/project/database/availability/specifications/Nodes';
import { Storage } from '@/types/cloud/project/database/availability/specifications/Storage';

/** Specifications of the availability of databases engines on cloud projects */
export interface Specifications {
  /** Flavor name */
  flavor?: string;
  /** Type of network */
  network?: NetworkTypeEnum;
  /** Specification of the nodes */
  nodes?: Nodes;
  /** Specification of the storage */
  storage?: Storage;
}
