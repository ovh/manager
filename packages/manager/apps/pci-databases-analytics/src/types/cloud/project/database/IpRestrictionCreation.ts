import { IpBlock } from '@/types/IpBlock';

/** Ip Restriction creation definition for cloud project databases (DEPRECATED) */
export interface IpRestrictionCreation {
  /** Description of the ip restriction */
  description: string;
  /** Whitelisted IP */
  ip: IpBlock;
}
