import { v2 } from '@ovh-ux/manager-core-api';
import { AccountBodyParamsType, AccountType } from './type';

// GET

export const getZimbraPlatformAccount = async (
  platformId: string,
  queryParameters?: {
    organizationId?: string;
    domainId?: string;
  },
) => {
  const params = new URLSearchParams(queryParameters).toString();
  const queryString = params ? `?${params}` : '';
  const { data } = await v2.get<AccountType[]>(
    `/zimbra/platform/${platformId}/account${queryString}`,
  );
  return data;
};

export const getZimbraPlatformAccountDetail = async (
  platformId: string,
  accountId: string,
) => {
  const { data } = await v2.get<AccountType>(
    `/zimbra/platform/${platformId}/account/${accountId}`,
  );
  return data;
};

// POST

export const postZimbraPlatformAccount = async (
  platformId: string,
  params: AccountBodyParamsType,
) => {
  const { data } = await v2.post(
    `/zimbra/platform/${platformId}/account`,
    params,
  );
  return data;
};

// PUT

export const putZimbraPlatformAccount = async (
  platformId: string,
  accountId: string,
  params: AccountBodyParamsType,
) => {
  const { data } = await v2.put(
    `/zimbra/platform/${platformId}/account/${accountId}`,
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
    `/zimbra/platform/${platformId}/account/${accountId}`,
  );
  return data;
};
