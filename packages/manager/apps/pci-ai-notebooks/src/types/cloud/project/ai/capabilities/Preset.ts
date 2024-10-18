import { PresetCapabilities } from '@/types/cloud/project/ai/capabilities/PresetCapabilities';
import { PresetDocumentationUrl } from '@/types/cloud/project/ai/capabilities/PresetDocumentationUrl';
import { Partner } from '@/types/cloud/project/ai/job/Partner';
import { PresetTypeEnum } from '@/types/cloud/project/ai/capabilities/PresetTypeEnum';

/** AI Solutions Preset image */
export interface Preset {
  /** Preset capabilities */
  capabilities?: PresetCapabilities;
  /** Preset description */
  descriptions?: string[];
  /** URL toward the preset image documentation */
  docUrl?: PresetDocumentationUrl[];
  /** Preset id */
  id?: string;
  /** URL toward the logo to illustrate the preset */
  logoUrl?: string;
  /** Preset name */
  name?: string;
  /** Partner name */
  partner?: Partner;
  /** Snippet example of the doc */
  snippet?: string;
  /** Preset type */
  type?: PresetTypeEnum;
}
