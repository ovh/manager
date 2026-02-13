import { getMacroRegion } from '@ovh-ux/muk';

import type { TShare } from '@/domain/entities/share.entity';
import {
  type TShareStatusDisplay,
  getShareStatusDisplay,
} from '@/pages/view-model/shareStatus.view-model';

export type TShareDetailsView = {
  id: string;
  name: string;
  region: string;
  regionDisplayKey: string;
  protocol: string;
  size: number;
  status: string;
  statusDisplay: TShareStatusDisplay;
  createdAt: string;
  mountPaths: string[];
  enabledActions: readonly string[];
};

export const mapShareToShareDetailsView = (share: TShare): TShareDetailsView => ({
  id: share.id,
  name: share.name,
  region: share.region,
  regionDisplayKey: `regions:manager_components_region_${getMacroRegion(share.region)}_micro`,
  protocol: share.protocol,
  size: share.size,
  status: share.status,
  statusDisplay: getShareStatusDisplay(share.status),
  createdAt: share.createdAt,
  mountPaths: share.mountPaths,
  enabledActions: [...(share.enabledActions ?? [])],
});

export const selectShareDetails = (share: TShare | undefined): TShareDetailsView | undefined =>
  share ? mapShareToShareDetailsView(share) : undefined;
