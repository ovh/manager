import { EngineEnum } from '@/types/terraform/cloud/database/EngineEnum';

/** Path Parameters with product ID, Service Name and Engine */
export interface PathParamsWithEngine {
  /** The engine of the database cluster. */
  engine: EngineEnum;
  /** Cluster ID. */
  productID: string;
  /** The id of the public cloud project. */
  serviceName: string;
}
