import { TShare } from '@/domain/entities/share.entity';

import { TShareListRow } from './shareList.data';
import { getShareStatusDisplay } from './shareStatusMapper';

export const mapShareToShareListRow = (share: TShare): TShareListRow => ({
  id: share.id,
  name: share.name,
  region: share.region,
  protocol: share.protocol,
  size: share.size,
  status: share.status,
  statusDisplay: getShareStatusDisplay(share.status),
});
