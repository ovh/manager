import type { TVps } from '@/domain/entities/vps';
import {
  formatMemory,
  formatDiskSize,
  formatDate,
} from '@/domain/services/vpsTransform.service';

export type TVpsInfoForView = {
  model: string;
  vCores: number;
  ram: string;
  disk: string;
  datacenter: string;
  distribution: string;
  state: TVps['state'];
};

export type TVpsNetworkForView = {
  ipV4: string;
  ipV6: string | null;
  netbootMode: string;
  slaMonitoring: boolean;
};

export type TVpsSubscriptionForView = {
  creationDate: string;
  expirationDate: string | null;
  autoRenew: boolean;
};

export const selectVpsInfoForView = (vps?: TVps): TVpsInfoForView | null => {
  if (!vps) return null;

  return {
    model: vps.model.name,
    vCores: vps.model.vcore,
    ram: formatMemory(vps.model.memory),
    disk: formatDiskSize(vps.model.disk),
    datacenter: vps.location.datacenter,
    distribution: vps.distribution.name,
    state: vps.state,
  };
};

export const selectVpsNetworkForView = (
  vps?: TVps,
): TVpsNetworkForView | null => {
  if (!vps) return null;

  return {
    ipV4: vps.network.ipV4,
    ipV6: vps.network.ipV6,
    netbootMode: vps.network.netbootMode,
    slaMonitoring: vps.network.slaMonitoring,
  };
};

export const selectVpsSubscriptionForView = (
  vps?: TVps,
): TVpsSubscriptionForView | null => {
  if (!vps) return null;

  return {
    creationDate: formatDate(vps.subscription.creationDate),
    expirationDate: vps.subscription.expirationDate
      ? formatDate(vps.subscription.expirationDate)
      : null,
    autoRenew: vps.subscription.autoRenew,
  };
};
