import { v2 } from '@ovh-ux/manager-core-api';
import { MailingListType, MailingListBodyParamsType } from './type';
import { getApiPath } from '../utils/apiPath';

// GET

export const getZimbraPlatformMailingLists = async (
  platformId: string,
  queryParameters?: {
    organizationId?: string;
    organizationLabel?: string;
  },
) => {
  const params = new URLSearchParams(queryParameters).toString();
  const queryString = params ? `?${params}` : '';
  const { data } = await v2.get<MailingListType[]>(
    `${getApiPath(platformId)}mailingList${queryString}`,
  );
  return data;
};

export const getZimbraPlatformMailingListDetails = async (
  platformId: string,
  mailingListId: string,
) => {
  const { data } = await v2.get(
    `${getApiPath(platformId)}mailingList/${mailingListId}`,
  );
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
  const { data } = await v2.put(
    `${getApiPath(platformId)}mailingList/${mailingListId}`,
    {
      targetSpec: params,
    },
  );
  return data;
};

// DELETE
