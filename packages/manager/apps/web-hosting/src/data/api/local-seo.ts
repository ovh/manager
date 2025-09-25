import { v6 } from '@ovh-ux/manager-core-api';

import { LocalSeoAccount } from '../types/product/seo';

export const getHostingLocalSeoAccount = async (
  serviceName: string,
  id: string,
): Promise<LocalSeoAccount> => {
  const { data } = await v6.get<LocalSeoAccount>(
    `/hosting/web/${serviceName}/localSeo/account/${id}`,
  );
  return data;
};

export const hostingLocalSeoLogin = async (
  serviceName: string,
  accountId: string,
): Promise<string> => {
  const { data } = await v6.post<string>(
    `/hosting/web/${serviceName}/localSeo/account/${accountId}/login`,
  );
  return data;
};

export const hostingDeleteLocation = async (
  serviceName: string,
  locationId: string,
): Promise<string> => {
  const { data } = await v6.post<string>(
    `/hosting/web/${serviceName}/localSeo/location/${locationId}/terminate`,
  );
  return data;
};
