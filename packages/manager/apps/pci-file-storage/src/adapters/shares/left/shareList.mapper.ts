import { getMacroRegion } from '@ovh-ux/muk';

import { TShare, TShareEnabledAction } from '@/domain/entities/share.entity';
import { subRoutes } from '@/routes/Routes.constants';

import { TShareListRow, TShareListRowAction } from './shareList.data';
import { getShareStatusDisplay } from './shareStatusMapper';

const ACTIONS_GROUP_KEY = 'actions';

export const shareEnabledActionsToMenuActions = (
  id: string,
  region: string,
  enabledActions: readonly TShareEnabledAction[],
): Map<string, TShareListRowAction[]> => {
  const items: TShareListRowAction[] = [
    {
      labelTranslationKey: 'list:actions.manage',
      link: { path: `./${region}/${id}`, state: { region } },
    },
  ];
  if (enabledActions.includes('delete')) {
    items.push({
      labelTranslationKey: 'list:actions.delete',
      link: { path: `./${region}/${id}/${subRoutes.shareDelete}` },
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
  actions: shareEnabledActionsToMenuActions(share.id, share.region, share.enabledActions),
});
