import type { TShareStatusDisplay } from './shareDetails.data';

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
