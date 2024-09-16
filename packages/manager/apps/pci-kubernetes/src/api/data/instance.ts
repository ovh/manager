import { v6 } from '@ovh-ux/manager-core-api';

type TRawInstance = {
  id: string;
  monthlyBilling?: { status: string };
  flavorId: string;
  imageId: string;
  name: string;
  planCode: string;
  region: string;
  sshKeyId: string;
  status: string;
};

export const switchToMonthlyBilling = async (
  projectId: string,
  instanceId: string,
) =>
  v6.post(
    `/cloud/project/${projectId}/instance/${instanceId}/activeMonthlyBilling`,
    {
      instanceId,
      serviceName: projectId,
    },
  );
