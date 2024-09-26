import { StateEnum } from '@/types/cloud/project/database/service/capability/StateEnum';

/** Cloud database service capability actions definition */
export interface CapabilityActions {
  /** Defines if the capability can be created */
  create?: StateEnum;
  /** Defines if the capability can be deleted */
  delete?: StateEnum;
  /** Defines if the capability can be read */
  read?: StateEnum;
  /** Defines if the capability can be updated */
  update?: StateEnum;
}
