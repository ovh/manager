import { IcebergFetchResultV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export type GetProductServicesParams = {
  path?: string;
  category?: string;
};

export type ProductServicesDetails = Record<string, unknown>;

export const getProductServicesQueryKey = (
  params: GetProductServicesParams,
) => [`get/${params.path}/${params.category}`];

export const getProductServices = async (
  params: GetProductServicesParams,
): Promise<IcebergFetchResultV6<ProductServicesDetails>> =>
  fetchIcebergV6<ProductServicesDetails>({
    route: params.path,
  });
