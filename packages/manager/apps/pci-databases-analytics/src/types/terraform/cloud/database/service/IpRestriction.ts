import { IpBlock } from '@/types/IpBlock';

/** Ip Restriction definition for cloud project databases */
export interface IpRestriction {
  /** Description of the ip restriction */
  description: string;
  /** Authorized IP */
  ip: IpBlock;
}
