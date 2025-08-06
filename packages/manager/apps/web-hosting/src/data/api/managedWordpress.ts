import { proxyV2 } from '../../../../../core/api'; // @todo: to change soon we have prod api

import {
  ManagedWordpressResourceDetailsType,
  ManagedWordpressResourceType,
  ManagedWordpressWebsiteDetails,
  ManagedWordpressWebsites,
  PostImportPayload,
  PostImportTaskPayload,
} from '../type';

export const getManagedCmsResource = async (): Promise<ManagedWordpressResourceType[]> => {
  const { data } = await proxyV2.get<ManagedWordpressResourceType[]>( // @todo: to change soon we have prod api
    '/managedCMS/resource',
  );
  return data;
};
export const getManagedCmsResourceDetails = async (
  serviceName: string,
): Promise<ManagedWordpressResourceDetailsType> => {
  const { data } = await proxyV2.get<ManagedWordpressResourceDetailsType>( // @todo: to change soon we have prod api
    `/managedCMS/resource/${serviceName}`,
  );
  return data;
};

export const getManagedCmsResourceWebsites = async (
  serviceName: string,
): Promise<ManagedWordpressWebsites[]> => {
  const { data } = await proxyV2.get<ManagedWordpressWebsites[]>( // @todo: to change soon we have prod api
    `/managedCMS/resource/${serviceName}/website`,
  );
  return data;
};

export const getManagedCmsResourceWebsiteDetails = async (
  serviceName: string,
  websiteId: string,
): Promise<ManagedWordpressWebsiteDetails> => {
  const { data } = await proxyV2.get<ManagedWordpressWebsiteDetails>( // @todo: to change soon we have prod api
    `/managedCMS/resource/${serviceName}/website/${websiteId}`,
  );
  return data;
};

export const postManagedCmsResourceWebsite = async (
  serviceName: string,
  payload: PostImportPayload,
) => {
  const { data } = await proxyV2.post(
    `/managedCMS/resource/${serviceName}/website`,
    payload,
  );
  return data;
};

export const putManagedCmsResourceWebsiteTasks = async (
  serviceName: string,
  payload: PostImportTaskPayload,
  taskId: string,
) => {
  const { data } = await proxyV2.put(
    `/managedCMS/resource/${serviceName}/task/${taskId}`,
    payload,
  );
  return data;
};
