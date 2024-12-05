import { FlavorTypeEnum } from '@/types/cloud/project/ai/capabilities/FlavorTypeEnum';
import { PresetResources } from '@/types/cloud/project/ai/capabilities/PresetResources';

/** AI Solutions Preset image enabled features */
export interface PresetCapabilities {
  /** Exec enabled */
  exec?: boolean;
  /** Flavor types */
  flavorTypes?: FlavorTypeEnum[];
  /** Log enabled */
  log?: boolean;
  /** Resources requirements */
  resources?: PresetResources;
  /** SSH enabled */
  ssh?: boolean;
  /** Volume enabled */
  volume?: boolean;
}
