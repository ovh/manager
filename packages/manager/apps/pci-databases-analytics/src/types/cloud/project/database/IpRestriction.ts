import { IpBlock } from '@/types/IpBlock';
import { StatusEnum } from '@/types/cloud/project/database/StatusEnum';

/** @deprecated Ip Restriction definition for cloud project databases (DEPRECATED) */
export interface IpRestriction {
  /** Description of the ip restriction */
  description: string;
  /** Whitelisted IP */
  ip: IpBlock;
  /** Current status of the ip restriction */
  status: StatusEnum;
}
