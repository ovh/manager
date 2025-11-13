import { OvhSubsidiaryEnum } from '@datatr-ux/ovhcloud-types/nichandle/index';
import { PCIData } from '..';
import { apiClient } from '../api.client';
import { ProductAvailability } from '@/types/Availability';

export interface GetProductAvailability extends PCIData {
  ovhSubsidiary: OvhSubsidiaryEnum;
}

export const getProductAvailability = async ({
  projectId,
  ovhSubsidiary = OvhSubsidiaryEnum.FR,
}: GetProductAvailability) =>
  apiClient.v6.get<ProductAvailability>(
    `/cloud/project/${projectId}/capabilities/productAvailability`,
    {
      params: { ovhSubsidiary },
    },
  );
