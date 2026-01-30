import type { TShareStatusDisplay } from './shareStatusMapper';

export type TShareListRow = {
  id: string;
  name: string;
  region: string;
  regionDisplayKey: string;
  protocol: string;
  size: number;
  status: string;
  statusDisplay: TShareStatusDisplay;
};
