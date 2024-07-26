import { StatusEnum } from '@/types/cloud/project/database/service/integration/StatusEnum';
import { TypeEnum } from '@/types/cloud/project/database/service/integration/TypeEnum';

/** Cloud database service integration definition */
export interface Integration {
  /** ID of the destination service */
  destinationServiceId: string;
  /** Service ID */
  id?: string;
  /** Parameters for the integration */
  parameters?: { [key: string]: string };
  /** ID of the source service */
  sourceServiceId: string;
  /** Current status of the integration */
  status?: StatusEnum;
  /** Type of the integration */
  type: TypeEnum;
}
