import { Level2Code, Region, Universe } from '@/configs/manager-forge-prompts-config.js';

/**
 * Strict structure of collected answers.
 */
export interface Answers {
  appName: string;
  packageName: string;
  description: string;
  regions: Region[];
  universes: Universe[];
  level2: Level2Code;
  universe: Universe;
  subUniverse: Universe;
  [key: string]: unknown;
}
