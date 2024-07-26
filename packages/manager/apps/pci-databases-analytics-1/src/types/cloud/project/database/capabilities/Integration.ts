import { EngineEnum } from '@/types/cloud/project/database/EngineEnum';
import { Parameter } from '@/types/cloud/project/database/capabilities/integration/Parameter';
import { TypeEnum } from '@/types/cloud/project/database/service/integration/TypeEnum';

/** Integration capability between database engines */
export interface Integration {
  /** Destination engine for the integration */
  destinationEngine?: EngineEnum;
  /** Parameters for the integration capability */
  parameters?: Parameter[];
  /** Source engine for the integration */
  sourceEngine?: EngineEnum;
  /** Type of the integration */
  type?: TypeEnum;
}
