import { ColumnSort } from '@ovhcloud/manager-components';
import apiClient from '@ovh-ux/manager-core-api';
import { defaultCompareFunctionSortKey } from './utils';
import {
  OkmsAllServiceKeys,
  OkmsServiceKeyPutPayload,
} from '@/types/okmsServiceKey.type';

/**
 *  Get okms ServiceKey list
 */

export const getListingOkmsServiceKey = async (
  okmsId: string,
): Promise<{ data: OkmsAllServiceKeys[] }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}/serviceKey`);
};

export const getOkmsServiceKeyResourceListQueryKey = (okmsId: string) => [
  `get/okms/resource/${okmsId}/serviceKey`,
];

export const sortOkmsServiceKey = (
  okms: OkmsAllServiceKeys[],
  sorting: ColumnSort,
): OkmsAllServiceKeys[] => {
  const data = [...okms];

  if (sorting) {
    const { id: sortKey, desc } = sorting;

    data.sort(
      defaultCompareFunctionSortKey(sortKey as keyof OkmsAllServiceKeys),
    );
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
}) => [`get/okms/resource/${okmsId}/serviceKey/${keyId}`];

export const getOkmsServiceKeyResource = async ({
  okmsId,
  keyId,
}: {
  okmsId: string;
  keyId: string;
}): Promise<{ data: OkmsAllServiceKeys }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}/serviceKey/${keyId}`);
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
