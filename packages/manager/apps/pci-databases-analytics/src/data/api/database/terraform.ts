import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';
import { ServiceRequest } from '@/types/terraform/cloud/database';
import { Response } from '@/types/terraform/cloud';

export interface TServiceToTerraform extends ServiceRequest {
  serviceData: Omit<database.Service, 'id'>;
}
export const serviceToTerraform = async (serviceData: ServiceRequest) =>
  apiClient.v2
    .post('/terraform/cloud/database', serviceData)
    .then((res) => res.data as Response);
