import { postJSON } from '@/data/api/Client.api';

export interface TerminateServiceResponse {
  terminationDate?: string;
}

export const terminateService = (serviceId: number): Promise<TerminateServiceResponse> =>
  postJSON<TerminateServiceResponse>('v6', `/services/${serviceId}/terminate`);
