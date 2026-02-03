import { getMacroRegion } from '@ovh-ux/muk';

import type { TShare } from '@/domain/entities/share.entity';

import type { TShareDetailsView } from './shareDetails.data';
import { getShareStatusDisplay } from './shareStatusMapper';

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
  enabledActions: [...share.enabledActions],
});
