import { proxyV2 } from '../../../../../core/api'; // @todo: to change soon we have prod api

import {
  ManagedWordpressResourceType,
  ManagedWordpressWebsiteDetailsType,
} from '../type';

export const getManagedCmsResource = async (): Promise<ManagedWordpressResourceType[]> => {
  const { data } = await proxyV2.get<ManagedWordpressResourceType[]>( // @todo: to change soon we have prod api
    '/managedCMS/resource',
  );
  return data;
};

export const getManagedCmsResourceWebsiteDetails = async (
  serviceName: string,
): Promise<ManagedWordpressWebsiteDetailsType[]> => {
  const { data } = await proxyV2.get<ManagedWordpressWebsiteDetailsType[]>( // @todo: to change soon we have prod api
    `/managedCMS/resource/${serviceName}/website`,
  );
  return data;
};
