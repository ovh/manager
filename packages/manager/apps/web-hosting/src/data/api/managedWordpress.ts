import { fetchIcebergV2, v2 } from '@ovh-ux/manager-core-api';

import { CmsLanguage, CmsType } from '../types/product/managedWordpress/cms';
import { PostCreatePayload, PostImportPayload } from '../types/product/managedWordpress/import';
import {
  ManagedWordpressResourceDetailsType,
  ManagedWordpressResourceType,
} from '../types/product/managedWordpress/ressource';
import {
  ManagedWordpressResourceTask,
  PostImportTaskPayload,
} from '../types/product/managedWordpress/tasks';
import {
  ManagedWordpressWebsiteDetails,
  ManagedWordpressWebsites,
} from '../types/product/managedWordpress/website';

export const getManagedCmsSupportedPHPVersions = async () => {
  const { data } = await v2.get<string[]>(
    `/managedCMS/reference/supportedPHPVersions?cms=${CmsType.WORDPRESS}`,
  );
  return data;
};
export const getManagedCmsReferenceAvailableLanguages = async (): Promise<CmsLanguage[]> => {
  const { data } = await v2.get<CmsLanguage[]>(
    `/managedCMS/reference/availableLanguages?cms=${CmsType.WORDPRESS}`,
  );
  return data;
};
export const getManagedCmsResource = async () => {
  const { data } = await v2.get<ManagedWordpressResourceType[]>('/managedCMS/resource');
  return data;
};
export const getManagedCmsResourceDetails = async (serviceName: string) => {
  const { data } = await v2.get<ManagedWordpressResourceDetailsType>(
    `/managedCMS/resource/${serviceName}`,
  );
  return data;
};

export const getManagedCmsResourceWebsitesQueryKey = (
  serviceName: string,
  searchParams?: string,
  shouldFetchAll?: boolean,
) => {
  return [
    'get',
    'managedCMS',
    'resource',
    serviceName,
    'website',
    searchParams,
    shouldFetchAll ? 'all' : '',
  ].filter(Boolean);
};
export const getManagedCmsResourceWebsites = async ({
  serviceName,
  pageParam,
  searchParams,
  pageSize = 15,
}: {
  serviceName: string;
  pageParam?: unknown;
  searchParams?: string;
  pageSize?: number;
}) => {
  const data = await fetchIcebergV2<ManagedWordpressWebsites>({
    route: `/managedCMS/resource/${serviceName}/website${searchParams}`,
    pageSize,
    cursor: pageParam as string,
  });
  return data;
};

export const getAllManagedCmsResourceWebsites = async (
  serviceName: string,
  searchParams?: string,
) => {
  const allDataArray: ManagedWordpressWebsites[] = [];

  const fetchPages = async (cursor: string | null): Promise<void> => {
    const response = await getManagedCmsResourceWebsites({
      serviceName,
      pageParam: cursor,
      pageSize: 500,
      searchParams,
    });

    allDataArray.push(...response.data);

    if (response.cursorNext) {
      await fetchPages(response.cursorNext);
    }
  };

  await fetchPages(null);
  return { data: allDataArray };
};
export const getManagedCmsResourceWebsiteDetails = async (
  serviceName: string,
  websiteId: string,
) => {
  const { data } = await v2.get<ManagedWordpressWebsiteDetails>(
    `/managedCMS/resource/${serviceName}/website/${websiteId}`,
  );
  return data;
};

export const getManagedCmsResourceWebsiteDetailsQueryKey = (
  serviceName: string,
  websiteId: string,
) => ['get', 'managedCMS', 'resource', serviceName, 'website', websiteId];

export const deleteManagedCmsResourceWebsite = async (serviceName: string, websiteId: string) => {
  const { data } = await v2.delete<ManagedWordpressWebsiteDetails>(
    `/managedCMS/resource/${serviceName}/website/${websiteId}`,
  );
  return data;
};

export const postManagedCmsResourceWebsite = async (
  serviceName: string,
  payload: PostImportPayload | PostCreatePayload,
) => {
  const { data } = await v2.post<void>(`/managedCMS/resource/${serviceName}/website`, payload);
  return data;
};

export const putManagedCmsResourceWebsiteTasks = async (
  serviceName: string,
  payload: PostImportTaskPayload,
  taskId: string,
) => {
  const { data } = await v2.put<ManagedWordpressResourceTask>(
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
