import { fetchIcebergV2, v2 } from '@ovh-ux/manager-core-api';

import { getApiPath } from '@/data/api';
import { APIV2_DEFAULT_PAGESIZE } from '@/utils';

import { MailingListBodyParamsType, MailingListType } from './type';

// GET

export const getZimbraPlatformMailingLists = ({
  platformId,
  searchParams,
  pageParam,
  pageSize = APIV2_DEFAULT_PAGESIZE,
  disableCache,
}: {
  platformId: string;
  searchParams?: string;
  pageParam?: unknown;
  pageSize?: number;
  disableCache?: boolean;
}) =>
  fetchIcebergV2<MailingListType[]>({
    route: `${getApiPath(platformId)}mailingList${searchParams}`,
    pageSize,
    cursor: pageParam as string,
    disableCache,
  });

export const getZimbraPlatformMailingListDetails = async (
  platformId: string,
  mailingListId: string,
) => {
  const { data } = await v2.get(`${getApiPath(platformId)}mailingList/${mailingListId}`);
  return data;
};

// POST

export const postZimbraPlatformMailingList = async (
  platformId: string,
  params: MailingListBodyParamsType,
) => {
  const { data } = await v2.post(`${getApiPath(platformId)}mailingList`, {
    targetSpec: params,
  });
  return data;
};

// PUT

export const putZimbraPlatformMailingList = async (
  platformId: string,
  mailingListId: string,
  params: MailingListBodyParamsType,
) => {
  const { data } = await v2.put(`${getApiPath(platformId)}mailingList/${mailingListId}`, {
    targetSpec: params,
  });
  return data;
};

// DELETE
