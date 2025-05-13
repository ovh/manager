import { Lifecycle } from '@/types/cloud/project/database/availability/Lifecycle';
import { TagEnum } from '@/types/cloud/project/database/capabilities/TagEnum';

/** Regions Capabilites */
export interface RegionCapabilities {
  lifecycle: Lifecycle;
  name: string;
  order: number;
  tags: TagEnum[];
}
