import { getMacroRegion } from '@ovh-ux/muk';

import { TShare } from '@/domain/entities/share.entity';

import { TShareListRow } from './shareList.data';
import { getShareStatusDisplay } from './shareStatusMapper';

export const mapShareToShareListRow = (share: TShare): TShareListRow => ({
  id: share.id,
  name: share.name,
  region: share.region,
  regionDisplayKey: `regions:manager_components_region_${getMacroRegion(share.region)}_micro`,
  protocol: share.protocol,
  size: share.size,
  status: share.status,
  statusDisplay: getShareStatusDisplay(share.status),
});
