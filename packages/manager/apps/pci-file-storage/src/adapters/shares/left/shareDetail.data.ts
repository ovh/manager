import type { TShareStatusDisplay } from './shareDetails.data';

export type TShareRegionAndName = {
  region: string;
  name: string;
};

export type TShareDetailView = {
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
