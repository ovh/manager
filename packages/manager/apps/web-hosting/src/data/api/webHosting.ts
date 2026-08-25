import { fetchIcebergV2, v2, v6 } from '@ovh-ux/manager-core-api';

import {
  AttachedDomainProps,
  PostWebHostingAttachedDomainPayload,
  PostWebHostingWebsitePayload,
  PutWebHostingWebsitePayload,
  WebHostingWebsiteDomainType,
  WebHostingWebsiteType,
} from '../types/product/webHosting';
import { WebsiteType } from '../types/product/website';

export const getWebHostingAttachedDomainQueryKey = (
  searchParams: string,
  shouldFetchAll?: boolean,
) =>
  ['get', 'webhosting', 'attachedDomain', searchParams, shouldFetchAll ? 'all' : ''].filter(
    Boolean,
  );
export const getWebHostingAttachedDomain = async ({
  pageParam,
  searchParams,
  pageSize = 15,
}: {
  pageParam?: string;
  searchParams?: string;
  pageSize?: number;
}) => {
  const response = await fetchIcebergV2<WebsiteType>({
    route: `/webhosting/attachedDomain${searchParams}`,
    pageSize,
    cursor: pageParam,
  });
  return response;
};

export const getAllWebHostingAttachedDomain = async (searchParams?: string) => {
  const allDataArray: WebsiteType[] = [];

  const fetchPages = async (cursor: string | null): Promise<void> => {
    const response = await getWebHostingAttachedDomain({
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

export const getWebHostingWebsite = async (serviceName: string) => {
  const { data } = await v2.get<WebHostingWebsiteType[]>(
    `/webhosting/resource/${serviceName}/website`,
  );
  return data;
};
export const postWebHostingWebsite = async (
  serviceName: string,
  payload: PostWebHostingWebsitePayload,
) => {
  const { data } = await v2.post<PostWebHostingWebsitePayload>(
    `/webhosting/resource/${serviceName}/website`,
    payload,
  );
  return data;
};

export const postWebHostingWebsites = async (
  serviceName: string,
  payload: PostWebHostingWebsitePayload,
  wwwNeeded: boolean,
): Promise<PromiseSettledResult<PostWebHostingWebsitePayload>[]> => {
  const promises = [postWebHostingWebsite(serviceName, payload)];

  if (wwwNeeded) {
    promises.push(
      postWebHostingWebsite(serviceName, {
        ...payload,
        targetSpec: {
          fqdn: `www.${payload.targetSpec.fqdn}`,
          ...payload.targetSpec,
        },
      }),
    );
  }
  const results = await Promise.allSettled(promises);
  const failed = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');

  if (failed) {
    throw failed.reason ?? new Error('Domain certificate creation failed');
  }

  return results;
};

export const putWebHostingWebsite = async (
  serviceName: string,
  id: number,
  payload: PutWebHostingWebsitePayload,
) => {
  const { data } = await v2.put<PutWebHostingWebsitePayload>(
    `/webhosting/resource/${serviceName}/website/${id}`,
    payload,
  );
  return data;
};

export const getWebHostingWebsiteDomainQueryKey = (serviceName: string, id: string) => [
  'get',
  'webhosting',
  'resource',
  serviceName,
  'website',
  id,
  'domain',
];
export const getWebHostingWebsiteDomain = async (serviceName: string, id: string) => {
  const { data } = await v2.get<WebHostingWebsiteDomainType[]>(
    `/webhosting/resource/${serviceName}/website/${id}/domain`,
  );
  return data;
};

export const getWebHostingService = async (serviceName: string) => {
  const { data } = await v6.get<void>(`/hosting/web/${serviceName}`);
  return data;
};

export const deleteAttachedDomain = async (
  serviceName: string,
  domain: string,
  bypassDNSConfiguration: boolean,
): Promise<void> => {
  await v6.delete(
    `/hosting/web/${serviceName}/attachedDomain/${domain}?bypassDNSConfiguration=${bypassDNSConfiguration}`,
  );
};

export const deleteAttachedDomains = async (
  serviceName: string,
  domains: string[],
  bypassDNSConfiguration: boolean,
): Promise<PromiseSettledResult<void>[]> => {
  const results = await Promise.allSettled(
    domains?.map((domain) => deleteAttachedDomain(serviceName, domain, bypassDNSConfiguration)),
  );
  const failed = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');

  if (failed) {
    throw failed.reason ?? new Error('Domain deletion failed');
  }

  return results;
};
export const getWebHostingWebsiteV6 = async (serviceName: string, path?: string) => {
  const url = path
    ? `/hosting/web/${serviceName}/website?path=${path}`
    : `/hosting/web/${serviceName}/website`;
  const { data } = await v6.get<string[]>(url);
  return data;
};

export const putAttachedDomain = async (
  serviceName: string,
  domain: string,
  payload: PostWebHostingAttachedDomainPayload,
) => {
  await v6.put<PostWebHostingAttachedDomainPayload>(
    `/hosting/web/${serviceName}/attachedDomain/${domain}`,
    payload,
  );
};

export const getAttachedDomainDetails = async (
  serviceName: string,
  domain: string,
): Promise<AttachedDomainProps> => {
  const { data } = await v6.get<AttachedDomainProps>(
    `/hosting/web/${serviceName}/attachedDomain/${domain}`,
  );
  return data;
};
