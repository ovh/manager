import { LicensingTypeEnum } from '@/types/cloud/project/ai/capabilities/LicensingTypeEnum';

/** AI Solutions App image object */
export interface Image {
  /** Short description of the image */
  description?: string;
  /** URL of the image documentation */
  docUrl?: string;
  /** Unique identifier of the image */
  id?: string;
  /** Type of licensing */
  licensing?: LicensingTypeEnum;
  /** URL of the logo of the image */
  logoUrl?: string;
  /** Name of the image */
  name?: string;
  /** ID of the partner providing the image */
  partnerId?: string;
  /** Name of the partner providing the image */
  partnerName?: string;
  /** List of available versions of this image */
  versions?: string[];
}
