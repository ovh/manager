import apiClient, {
  ApiClientVersions,
  fetchIceberg,
  IcebergOptions,
} from '@ovh-ux/manager-core-api';

import { IamApiReferenceAction } from '../types/reference';

export const listReferenceActions = async (icebergOptions?: IcebergOptions) => {
  if (icebergOptions) {
    const { page, pageSize, filters, sortBy, sortReverse } = icebergOptions;

    return fetchIceberg<IamApiReferenceAction>({
      route: '/iam/reference/action',
      page,
      pageSize,
      filters,
      sortBy,
      sortReverse,
      apiVersion: ApiClientVersions.v2,
    });
  }

  const { data } = await apiClient.v2.get('/iam/reference/action');
  return data;
};

export default {
  listReferenceActions,
};
