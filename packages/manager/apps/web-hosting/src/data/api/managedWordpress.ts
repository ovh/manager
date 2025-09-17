import { v2 } from '@ovh-ux/manager-core-api';

// import { proxyV2 } from '../../../../../core/api/src/client';
// @todo: to change soon we have prod api
import {
  ManagedWordpressResourceDetailsType,
  ManagedWordpressResourceTask,
  ManagedWordpressResourceType,
  ManagedWordpressWebsiteDetails,
  ManagedWordpressWebsites,
  PostImportPayload,
  PostImportTaskPayload,
} from '../types/product/managedWordpress';

export const getManagedCmsReferenceAvailableLanguages = async (): Promise<string[]> => {
  const { data } = await v2.get<string[]>('/managedCMS/reference/availableLanguages');
  return data;
};
export const getManagedCmsResource = async () => {
  const { data } = await v2.get<ManagedWordpressResourceType[]>('/managedCMS/resource'); // @todo: to change soon we have prod api
  return data;
};
export const getManagedCmsResourceDetails = async (serviceName: string) => {
  const { data } = await v2.get<ManagedWordpressResourceDetailsType>( // @todo: to change soon we have prod api
    `/managedCMS/resource/${serviceName}`,
  );
  return data;
};

export const getManagedCmsResourceWebsites = async (serviceName: string) => {
  const { data } = await v2.get<ManagedWordpressWebsites[]>( // @todo: to change soon we have prod api
    `/managedCMS/resource/${serviceName}/website`,
  );
  return data;
};

export const getManagedCmsResourceWebsiteDetails = async (
  serviceName: string,
  websiteId: string,
) => {
  const { data } = await v2.get<ManagedWordpressWebsiteDetails>( // @todo: to change soon we have prod api
    `/managedCMS/resource/${serviceName}/website/${websiteId}`,
  );
  return data;
};

export const deleteManagedCmsResourceWebsite = async (serviceName: string, websiteId: string) => {
  const { data } = await v2.delete<ManagedWordpressWebsiteDetails>(
    // @todo: to change soon we have prod api
    `/managedCMS/resource/${serviceName}/website/${websiteId}`,
  );
  return data;
};

export const postManagedCmsResourceWebsite = async (
  serviceName: string,
  payload: PostImportPayload,
) => {
  const { data } = await v2.post<void>(`/managedCMS/resource/${serviceName}/website`, payload);
  return data;
};

export const putManagedCmsResourceWebsiteTasks = async (
  serviceName: string,
  payload: PostImportTaskPayload,
  taskId: string,
) => {
  const { data } = await v2.put<ManagedWordpressResourceTask[]>(
    `/managedCMS/resource/${serviceName}/task/${taskId}`,
    payload,
  );
  return data;
};

export const getManagedCmsResourceWebsiteTasks = async (serviceName: string) => {
  const { data } = await v2.get<ManagedWordpressResourceTask[]>(
    `/managedCMS/resource/${serviceName}/task`,
  );
  return data;
};
