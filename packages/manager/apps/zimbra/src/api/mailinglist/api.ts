import { v2 } from '@ovh-ux/manager-core-api';
import { MailingListType } from './type';
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

// PUT

// DELETE
