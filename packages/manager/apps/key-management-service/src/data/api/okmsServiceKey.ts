import { ColumnSort } from '@ovhcloud/manager-components';
import apiClient from '@ovh-ux/manager-core-api';
import { OkmsServiceKey } from '@/types/okmsServiceKey.type';
import { defaultCompareFunctionSortKey } from './utils';

export const getListingOkmsServiceKey = async (
  okmsId: string,
): Promise<{ data: OkmsServiceKey[] }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}/serviceKey`);
};

export const getOkmsServiceKeyResourceListQueryKey = (okmsId: string) => [
  `get/okms/resource/${okmsId}/serviceKey`,
];

export const getOkmsServiceKeyResourceQueryKey = (
  okmsId: string,
  keyId: string,
) => [`get/okms/resource/${okmsId}/serviceKey/${keyId}`];

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
