import { NetworkRegion } from '@/types/cloud/network/NetworkRegion';
import { NetworkStatusEnum } from '@/types/cloud/network/NetworkStatusEnum';
import { NetworkTypeEnum } from '@/types/cloud/network/NetworkTypeEnum';

/** Network */
export interface Network {
  /** Network id */
  id?: string;
  /** Network name */
  name?: string;
  /** Details about private network in region */
  regions?: NetworkRegion[];
  /** Network status */
  status?: NetworkStatusEnum;
  /** Network type */
  type?: NetworkTypeEnum;
  /** Network VLAN id */
  vlanId?: number;
}
