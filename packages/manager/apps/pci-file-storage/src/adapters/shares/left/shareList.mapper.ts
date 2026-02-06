import { getMacroRegion } from '@ovh-ux/muk';

import { TShare, TShareEnabledAction } from '@/domain/entities/share.entity';

import { TShareListRow, TShareListRowAction } from './shareList.data';
import { getShareStatusDisplay } from './shareStatusMapper';

const ACTIONS_GROUP_KEY = 'actions';

export const shareEnabledActionsToMenuActions = (
  id: string,
  enabledActions: readonly TShareEnabledAction[],
): Map<string, TShareListRowAction[]> => {
  const items: TShareListRowAction[] = [
    { label: 'list:actions.manage', link: { path: `./${id}` } },
  ];
  if (enabledActions.includes('delete')) {
    items.push({
      label: 'list:actions.delete',
      link: { path: `./${id}/delete` },
      isCritical: true,
    });
  }
  return new Map([[ACTIONS_GROUP_KEY, items]]);
};

export const mapShareToShareListRow = (share: TShare): TShareListRow => ({
  id: share.id,
  name: share.name,
  region: share.region,
  regionDisplayKey: `regions:manager_components_region_${getMacroRegion(share.region)}_micro`,
  protocol: share.protocol,
  size: share.size,
  status: share.status,
  statusDisplay: getShareStatusDisplay(share.status),
  actions: shareEnabledActionsToMenuActions(share.id, share.enabledActions),
});
