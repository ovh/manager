/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NashaUse } from './Dashboard.type';

export type SpaceMeterProps = {
  usage: NashaUse;
  legend?: boolean;
  large?: boolean;
  help?: string;
};

export type SpaceMeterLegendItem = {
  type: string;
  name: string;
  value: number;
  unit: string;
};

