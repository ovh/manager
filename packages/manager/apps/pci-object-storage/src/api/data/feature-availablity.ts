import { aapi } from '@ovh-ux/manager-core-api';

export const getFeatureAvailability = async (feature: string, app: string) => {
  const { data } = await aapi.get<Record<string, boolean>>(
    `/feature/${feature}/availability?app=${app}`,
  );

  return data;
};
