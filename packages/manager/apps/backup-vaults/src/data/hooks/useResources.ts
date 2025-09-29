import {
  useResourcesIcebergV2,
  useResourcesIcebergV6,
  useResourcesV6,
} from '@ovh-ux/manager-react-components';

import { APP_FEATURES } from '@/App.constants';
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

export function useResources<T extends Record<string, unknown> = Record<string, unknown>>(
  params: UseResourcesParams<T>,
): ResourcesFacadeResult<T> {
  const resourcesFactory = createResourcesFactory<T>();
  const api = APP_FEATURES.listingApi;

  if (api === 'v6Iceberg') return resourcesFactory.v6Iceberg(params);
  if (api === 'v2') return resourcesFactory.v2(params);
  return resourcesFactory.v6(params);
}
