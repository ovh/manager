import { apiClient } from '@ovh-ux/manager-core-api';
import {
  ZimbraPlatform,
  Organization,
  Domain,
  Task,
  Email,
} from '@/api/api.type';

export const getZimbraPlatformListQueryKey = ['get/zimbra/platform'];

export const getZimbraPlatformList = async () => {
  const { data } = await apiClient.v2.get<ZimbraPlatform[]>('/zimbra/platform');
  return data;
};

export const getZimbraPlatformOrganizationQueryKey = (platformId: string) => [
  `get/zimbra/platform/${platformId}/organization`,
];

export const getZimbraPlatformOrganization = async (platformId: string) => {
  const { data } = await apiClient.v2.get<Organization[]>(
    `/zimbra/platform/${platformId}/organization`,
  );
  return data;
};

export const getZimbraPlatformDomainsQueryKey = (
  platformId: string,
  organizationId?: string,
) => [
  `get/zimbra/platform/${platformId}/domain?organizationId=${organizationId}`,
];

export const getZimbraPlatformDomains = async (
  platformId: string,
  organizationId?: string,
) => {
  const { data } = await apiClient.v2.get<Domain[]>(
    `/zimbra/platform/${platformId}/domain${
      organizationId ? `?organizationId=${organizationId}` : ''
    }`,
  );
  return data;
};

export const getZimbraPlatformOrganizationDetailsQueryKey = (
  platformId: string,
  organizationId: string,
) => [`get/zimbra/platform/${platformId}/organization/${organizationId}`];

export const getZimbraPlatformOrganizationDetails = async (
  platformId: string,
  organizationId: string,
) => {
  const { data } = await apiClient.v2.get(
    `/zimbra/platform/${platformId}/organization/${organizationId}`,
  );
  return data;
};

export const getZimbraPlatformTaskQueryKey = (
  platformId: string,
  organizationId?: string,
) => [
  `get/zimbra/platform/${platformId}/task?organizationId=${organizationId}`,
];

export const getZimbraPlatformTask = async (
  platformId: string,
  organizationId?: string,
) => {
  const { data } = await apiClient.v2.get<Task[]>(
    `/zimbra/platform/${platformId}/task${
      organizationId ? `?organizationId=${organizationId}` : ''
    }`,
  );
  return data;
};

export const getZimbraPlatformEmailsQueryKey = (
  platformId: string,
  queryParameters?: {
    organizationId?: string;
    domainId?: string;
  },
) => {
  const params = new URLSearchParams(queryParameters).toString();
  const queryString = params ? `?${params}` : '';
  return [`get/zimbra/platform/${platformId}/account${queryString}`];
};

export const getZimbraPlatformEmails = async (
  platformId: string,
  queryParameters?: {
    organizationId?: string;
    domainId?: string;
  },
) => {
  const params = new URLSearchParams(queryParameters).toString();
  const queryString = params ? `?${params}` : '';

  const { data } = await apiClient.v2.get<Email[]>(
    `/zimbra/platform/${platformId}/account${queryString}`,
  );

  return data;
};

export const getZimbraPlatformEmailsDetailQueryKey = (
  platformId: string,
  accountId?: string,
) => [`get/zimbra/platform/${platformId}/account/${accountId}`];

export const getZimbraPlatformEmailsDetail = async (
  platformId: string,
  accountId: string,
) => {
  const { data } = await apiClient.v2.get<Email>(
    `/zimbra/platform/${platformId}/account/${accountId}`,
  );
  return data;
};
