import { TypeEnum } from '@/types/cloud/project/database/capabilities/advancedConfiguration/property/TypeEnum';

/** Specific database engine capability */
export interface Property {
  /** Description of the property */
  description?: string;
  /** Maximum value for the property if numeric and applicable */
  maximum?: number;
  /** Minimum value for the property if numeric and applicable */
  minimum?: number;
  /** Property name */
  name?: string;
  /** Data type of the property */
  type?: TypeEnum;
  /** Possible values for the property if string and applicable */
  values?: string[];
}
