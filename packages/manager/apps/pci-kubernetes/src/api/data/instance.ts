import { v6 } from '@ovh-ux/manager-core-api';

export const switchToMonthlyBilling = async (projectId: string, instanceId: string) =>
  v6.post(`/cloud/project/${projectId}/instance/${instanceId}/activeMonthlyBilling`, {
    instanceId,
    serviceName: projectId,
  });
