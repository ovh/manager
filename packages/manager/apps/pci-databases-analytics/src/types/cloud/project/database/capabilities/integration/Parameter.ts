import { TypeEnum } from '@/types/cloud/project/database/capabilities/integration/parameter/TypeEnum';

/** Integration capability parameter */
export interface Parameter {
  /** Name of the integration parameter */
  name?: string;
  /** Type of the integration parameter */
  type?: TypeEnum;
}
