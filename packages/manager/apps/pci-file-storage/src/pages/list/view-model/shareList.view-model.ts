import { getMacroRegion } from '@ovh-ux/muk';

import { TShare, TShareEnabledAction } from '@/domain/entities/share.entity';
import {
  type TShareStatusDisplay,
  getShareStatusDisplay,
} from '@/pages/view-model/shareStatus.view-model';
import { subRoutes } from '@/routes/Routes.constants';

export type TShareListRowActionLink = {
  path: string;
  isExternal?: boolean;
  isTargetBlank?: boolean;
  state?: { region: string };
};

export type TShareListRowAction = {
  labelTranslationKey: string;
  link: TShareListRowActionLink;
  isCritical?: boolean;
};

export type TShareListRow = {
  id: string;
  name: string;
  region: string;
  regionDisplayKey: string;
  protocol: string;
  size: number;
  status: string;
  statusDisplay: TShareStatusDisplay;
  actions: Map<string, TShareListRowAction[]>;
};

const ACTIONS_GROUP_KEY = 'actions';

export const shareEnabledActionsToMenuActions = (
  id: string,
  region: string,
  enabledActions: readonly TShareEnabledAction[],
): Map<string, TShareListRowAction[]> => {
  const items: TShareListRowAction[] = [
    {
      labelTranslationKey: 'share:actions.manage',
      link: { path: `./${region}/${id}`, state: { region } },
    },
  ];
  if (enabledActions.includes('delete')) {
    items.push({
      labelTranslationKey: 'share:actions.delete',
      link: { path: `./${subRoutes.shareDelete}?region=${region}&shareId=${id}` },
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

export const selectSharesForList = (data: TShare[] | undefined): TShareListRow[] =>
  (data ?? []).map(mapShareToShareListRow);

export const selectHasShares = (data?: TShare[]): boolean => (data ?? []).length > 0;
