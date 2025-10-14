import { apiClient } from '@/data/api/api.client';
import { ServiceRequest } from '@/types/terraform/cloud/database';
import { Response } from '@/types/terraform/cloud';

export const serviceToTerraform = async (serviceData: ServiceRequest) =>
  apiClient.v2.post<Response>('/terraform/cloud/database', serviceData);
