import { Service } from '@/types/terraform/cloud/database/Service';
import { PathParams } from '@/types/terraform/cloud/database/service/PathParams';

/** Cloud databases request for database service terraform block */
export interface ServiceRequest {
  /** Service body */
  body: Service;
  /** Service path parameters */
  pathParams: PathParams;
}
