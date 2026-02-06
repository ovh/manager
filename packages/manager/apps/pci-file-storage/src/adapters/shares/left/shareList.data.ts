import type { TShareStatusDisplay } from './shareStatusMapper';

export type TShareListRowActionLink = {
  path: string;
  isExternal?: boolean;
  isTargetBlank?: boolean;
};

export type TShareListRowAction = {
  label: string;
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
