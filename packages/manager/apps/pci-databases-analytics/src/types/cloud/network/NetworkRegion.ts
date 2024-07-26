import { NetworkRegionStatusEnum } from '@/types/cloud/network/NetworkRegionStatusEnum';

/** NetworkRegion */
export interface NetworkRegion {
  /** Network id on openstack region */
  openstackId?: string;
  /** Network region */
  region?: string;
  /** Network region status */
  status?: NetworkRegionStatusEnum;
}
