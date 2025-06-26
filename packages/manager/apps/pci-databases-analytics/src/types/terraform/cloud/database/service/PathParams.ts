import { EngineEnum } from '@/types/terraform/cloud/database/EngineEnum';

/** Path Parameters with engine and Service Name */
export interface PathParams {
  /** The engine of the database cluster. */
  engine: EngineEnum;
  /** The id of the public cloud project. */
  serviceName: string;
}
