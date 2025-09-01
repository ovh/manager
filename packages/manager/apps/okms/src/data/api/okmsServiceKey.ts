import { ColumnSort } from '@ovh-ux/manager-react-components';
import apiClient from '@ovh-ux/manager-core-api';
import { defaultCompareFunctionSortKey } from './utils';
import {
  OkmsServiceKey,
  OkmsServiceKeyPostPayload,
  OkmsServiceKeyPutPayload,
} from '@/types/okmsServiceKey.type';

/**
 *  Get okms ServiceKey list
 */

export const getListingOkmsServiceKey = async (
  okmsId: string,
): Promise<{ data: OkmsServiceKey[] }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}/serviceKey`);
};

export const getOkmsServiceKeyResourceListQueryKey = (okmsId: string) => [
  `get/okms/resource/${okmsId}/serviceKey`,
];

export const sortOkmsServiceKey = (
  okms: OkmsServiceKey[],
  sorting: ColumnSort,
): OkmsServiceKey[] => {
  const data = [...okms];

  if (sorting) {
    const { id: sortKey, desc } = sorting;

    data.sort(defaultCompareFunctionSortKey(sortKey as keyof OkmsServiceKey));
    if (desc) {
      data.reverse();
    }
  }

  return data;
};

/**
 *  Get okms ServiceKey
 */

export const getOkmsServiceKeyResourceQueryKey = ({
  okmsId,
  keyId,
}: {
  okmsId: string;
  keyId: string;
}) => [`get/okms/resource/${okmsId}/serviceKey/${keyId}?format=JWK`];

export const getOkmsServiceKeyResource = async ({
  okmsId,
  keyId,
}: {
  okmsId: string;
  keyId: string;
}): Promise<{ data: OkmsServiceKey }> => {
  return apiClient.v2.get(
    `okms/resource/${okmsId}/serviceKey/${keyId}?format=JWK`,
  );
};

/**
 *  update okms Servicekey
 */

export const updateOkmsServiceKeyResourceQueryKey = ({
  okmsId,
  keyId,
}: {
  okmsId: string;
  keyId: string;
}) => [`put/okms/resource/${okmsId}/serviceKey/${keyId}/editName`];

export const updateOkmsServiceKeyResource = async ({
  okmsId,
  keyId,
  data,
}: {
  okmsId: string;
  keyId: string;
  data: OkmsServiceKeyPutPayload;
}) => {
  return apiClient.v2.put(`okms/resource/${okmsId}/serviceKey/${keyId}`, data);
};

/**
 *  Delete okms ServiceKey
 */

export const deleteOkmsServiceKeyResourceQueryKey = ({
  okmsId,
  keyId,
}: {
  okmsId: string;
  keyId: string;
}) => [`okms/resource/${okmsId}/serviceKey/${keyId}/delete`];

export const deleteOkmsServiceKeyResource = async ({
  okmsId,
  keyId,
}: {
  okmsId: string;
  keyId: string;
}) => {
  return apiClient.v2.delete(`okms/resource/${okmsId}/serviceKey/${keyId}`);
};

/**
 *  create okms Servicekey
 */

export const createOkmsServiceKeyResourceQueryKey = ({
  okmsId,
}: {
  okmsId: string;
}) => [`put/okms/resource/${okmsId}/serviceKey/create`];

export const createOkmsServiceKeyResource = async ({
  okmsId,
  data,
}: {
  okmsId: string;
  data: OkmsServiceKeyPostPayload;
}) => {
  return apiClient.v2.post(`okms/resource/${okmsId}/serviceKey`, data);
};
