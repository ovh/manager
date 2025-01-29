import { v6 } from '@ovh-ux/manager-core-api';

export const getProductRegionsAvailability = async (
  ovhSubsidiary: string,
): Promise<string[]> => {
  const { data } = await v6.get(
    `/cloud/order/rule/availability?ovhSubsidiary=${ovhSubsidiary}&planCode=coldarchive.archive.hour.consumption`,
  );
  return data?.plans[0]?.regions;
};
