import { IcebergFetchResultV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { IpTypeEnum } from './ipDetails';

export type GetProductServicesParams = {
  category: IpTypeEnum;
  path?: string;
  pathList?: string[];
};

export type ProductServicesDetails = Record<string, unknown>;

export const getProductServicesQueryKey = (
  params: GetProductServicesParams,
) => [`get/${params.path || params.pathList.join(',')}/${params.category}`];

export const getProductServices = async (
  params: GetProductServicesParams,
): Promise<IcebergFetchResultV6<ProductServicesDetails>> => {
  if (params.path) {
    return fetchIcebergV6<ProductServicesDetails>({
      route: params.path,
    });
  }

  const results = await Promise.all(
    params.pathList.map((path) =>
      fetchIcebergV6<ProductServicesDetails>({ route: path }),
    ),
  );

  return {
    data: results.flatMap((result) => result.data),
    totalCount: results.reduce((acc, result) => acc + result.totalCount, 0),
    status: results[0].status,
  };
};
