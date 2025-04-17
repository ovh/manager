import { v6 } from '@ovh-ux/manager-core-api';
import { SavingsPlanConsumption } from '@/types/savingsPlanConsumption.type';

type TGetSavingsPlanConsumptionParams = {
  projectId?: string;
  flavor?: string;
  year: number;
  month: number;
};

export const getSavingsPlanConsumption = async ({
  projectId,
  flavor = '',
  year,
  month,
}: TGetSavingsPlanConsumptionParams): Promise<SavingsPlanConsumption> => {
  const url = `cloud/project/${projectId}/usage/plans?year=${year}&month=${month}&flavor=${flavor}`;
  const { data } = await v6.get(url);
  return data;
};

export type GetPublicCloudProjectProjectIdParams = {
  /** Project ID */
  projectId?: string;
};

export const getPublicCloudProjectProjectIdQueryKey = (
  params: GetPublicCloudProjectProjectIdParams,
) => [`get/publicCloud/project/${params.projectId}`];
