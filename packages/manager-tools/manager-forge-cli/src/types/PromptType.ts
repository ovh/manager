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
  moduleName?: string;
  modulePackageName?: string;
  moduleDescription?: string;
  isPrivate?: boolean;
  moduleType?: 'react' | 'node';
  hasTranslations?: boolean;
  [key: string]: unknown;
}
