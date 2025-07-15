import { useQuery } from '@tanstack/react-query';
import { aapi, v2 } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import React from 'react';
import {
  formatPricingInfo,
  formatTechnicalInfo,
} from '@/utils/formatter/formatter';
import { InstanceTechnicalName } from '@/types/CreatePlan.type';
import {
  CommercialCatalogPricingType,
  CommercialCatalogTechnicalType,
} from '@/types/commercial-catalog.type';
import { useServiceId } from './useSavingsPlan';
import { DeploymentMode } from '@/utils/savingsPlan';

const getCatalogCommercial = async <T,>({
  additionalParams,
  merchant,
}: {
  additionalParams: string;
  merchant: string;
}): Promise<T> => {
  const { data } = await v2.get<T>(
    `commercialCatalog/offers?merchants=${merchant}&type=ATOMIC&${additionalParams}`,
  );
  return data;
};

const getCommercialOffers = async ({
  productCode,
  serviceId,
}: {
  productCode: string;
  serviceId: number;
}): Promise<CommercialCatalogPricingType[]> => {
  const { data } = await aapi.get<{ offers: CommercialCatalogPricingType[] }>(
    `publiccloud/savingsplan/subscribableOffers/${serviceId}?productCode=${productCode}`,
  );

  return data.offers;
};

const getTechnicalInfo = async ({
  productCode,
  merchant,
  deploymentMode,
}: {
  productCode: string;
  merchant: string;
  deploymentMode: DeploymentMode;
}): Promise<CommercialCatalogTechnicalType[]> => {
  return getCatalogCommercial<CommercialCatalogTechnicalType[]>({
    additionalParams: `nature=REGULAR&productCode=${productCode}&technicalRequirements=deployment_node:${deploymentMode}`,
    merchant,
  });
};

const useTechnicalInfo = ({
  productCode,
  deploymentMode,
}: {
  productCode: InstanceTechnicalName;
  deploymentMode: DeploymentMode;
}) => {
  const context = React.useContext(ShellContext);
  const subsidiary = context.environment.getUser().ovhSubsidiary;

  return useQuery({
    queryKey: ['technicalInfo', productCode, deploymentMode],
    queryFn: () =>
      getTechnicalInfo({ productCode, merchant: subsidiary, deploymentMode }),
    select: (res) =>
      res
        .map(formatTechnicalInfo)
        .filter((item) => item.id !== '')
        .sort((a, z) => {
          if (a.technical?.cpu?.cores) {
            return a.technical.cpu.cores - z.technical.cpu.cores;
          }
          return 1;
        }),
  });
};

export const usePricingInfo = ({
  productSizeCode,
}: {
  productSizeCode: string;
}) => {
  const serviceId = useServiceId();

  const exactProductCodeMatch = `"${productSizeCode}"`;
  return useQuery({
    queryKey: ['pricingInfo', exactProductCodeMatch],
    queryFn: async () => {
      const offers = await getCommercialOffers({
        productCode: exactProductCodeMatch,
        serviceId,
      });
      return offers || [];
    },
    select: (res) =>
      res.length > 0
        ? res.map(formatPricingInfo).filter((item) => item.id !== null)
        : [],
  });
};

export default useTechnicalInfo;
