import type { TShareStatusBadgeColor } from './shareStatusMapper';

export type TShareStatusDisplay = {
  labelKey: string;
  badgeColor: TShareStatusBadgeColor;
};

export type TShareRegionAndName = {
  region: string;
  name: string;
};

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
