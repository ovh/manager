import { getMacroRegion } from '@ovh-ux/muk';

import { TStatusBadgeProps } from '@/components/status-badge/StatusBadge.component';
import { TNetwork } from '@/domain/entities/network.entity';
import type { TShare } from '@/domain/entities/share.entity';
import { getShareStatusDisplay } from '@/pages/view-model/shareStatus.view-model';

export type TShareDetailsView = {
  id: string;
  name: string;
  region: string;
  regionDisplayKey: string;
  protocol: string;
  size: number;
  status: string;
  statusDisplay: TStatusBadgeProps;
  createdAt: string;
  mountPaths: string[];
  enabledActions: readonly string[];
  networkId: string;
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
  networkId: share.network.id,
});

export const selectShareDetails = (share: TShare | undefined): TShareDetailsView | undefined =>
  share ? mapShareToShareDetailsView(share) : undefined;

export type TNetworkDetailsView = {
  id: string;
  displayName: string;
};

export const mapNetworkToNetworkDetailsView = (network: TNetwork): TNetworkDetailsView => ({
  id: network.id,
  displayName: network.name || network.vlanId?.toString() || network.id.substring(0, 13),
});

export const selectNetworkDetails = (network: TNetwork | undefined) =>
  network ? mapNetworkToNetworkDetailsView(network) : undefined;
