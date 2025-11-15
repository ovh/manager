import {
  useResourcesIcebergV2,
  useResourcesIcebergV6,
  useResourcesV6,
} from '@ovh-ux/manager-react-components';

import { ResourcesFacadeResult, UseResourcesParams } from '@/types/ClientApi.type';

function createResourcesFactory<T extends Record<string, unknown>>() {
  return {
    v6Iceberg: (params: UseResourcesParams<T>): ResourcesFacadeResult<T> => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useResourcesIcebergV6<T>(params);
    },
    v2: (params: UseResourcesParams<T>): ResourcesFacadeResult<T> => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useResourcesIcebergV2<T>(params);
    },
    v6: (params: UseResourcesParams<T>): ResourcesFacadeResult<T> => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useResourcesV6<T>({
        ...params,
        columns: params.columns ?? [],
      });
    },
  };
}
