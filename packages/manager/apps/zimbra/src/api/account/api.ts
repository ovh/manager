import { fetchIcebergV2, v2 } from '@ovh-ux/manager-core-api';
import { AccountBodyParamsType, AccountType } from './type';
import { getApiPath } from '../utils/apiPath';
import { APIV2_DEFAULT_PAGESIZE } from '@/utils';

// GET

export const getZimbraPlatformAccounts = ({
  platformId,
  searchParams,
  pageParam,
  pageSize = APIV2_DEFAULT_PAGESIZE,
}: {
  platformId: string;
  searchParams?: string;
  pageParam?: unknown;
  pageSize?: number;
}) =>
  fetchIcebergV2<AccountType[]>({
    route: `${getApiPath(platformId)}account${searchParams}`,
    pageSize,
    cursor: pageParam as string,
  });

export const getZimbraPlatformAccountDetail = async (
  platformId: string,
  accountId: string,
) => {
  const { data } = await v2.get<AccountType>(
    `${getApiPath(platformId)}account/${accountId}`,
  );
  return data;
};

// POST

export const postZimbraPlatformAccount = async (
  platformId: string,
  params: AccountBodyParamsType,
) => {
  const { data } = await v2.post(`${getApiPath(platformId)}account`, {
    targetSpec: { ...params, offer: 'STARTER' }, // offer hardcoded for beta scope
  });
  return data;
};

// PUT

export const putZimbraPlatformAccount = async (
  platformId: string,
  accountId: string,
  params: AccountBodyParamsType,
) => {
  const { data } = await v2.put(
    `${getApiPath(platformId)}account/${accountId}`,
    {
      targetSpec: params,
    },
  );
  return data;
};

// DELETE

export const deleteZimbraPlatformAccount = async (
  platformId: string,
  accountId: string,
) => {
  const { data } = await v2.delete(
    `${getApiPath(platformId)}account/${accountId}`,
  );
  return data;
};
