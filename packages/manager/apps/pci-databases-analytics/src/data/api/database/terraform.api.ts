import { apiClient } from '@ovh-ux/manager-core-api';
import { ServiceRequest } from '@/types/terraform/cloud/database';
import { Response } from '@/types/terraform/cloud';

export const serviceToTerraform = async (serviceData: ServiceRequest) =>
         apiClient.v2
           .post('/terraform/cloud/database', serviceData)
           .then((res: { data: Response }) => res.data as Response);
