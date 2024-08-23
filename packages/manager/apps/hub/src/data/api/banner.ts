import { aapi } from '@ovh-ux/manager-core-api';
import { Banner } from '@/types/banner.type';

export const getBanner: (locale: string) => Promise<Banner> = async (
  locale: string,
) => {
  const { data } = await aapi.get<Banner>(`/banner?locale=${locale}`);
  return data;
};
