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

export const getCommercialOffers = async ({
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

export const getTechnicalInfo = async ({
  productCode,
  merchant,
}: {
  productCode: string;
  merchant: string;
}): Promise<CommercialCatalogTechnicalType[]> => {
  return getCatalogCommercial<CommercialCatalogTechnicalType[]>({
    additionalParams: `nature=REGULAR&productCode=${productCode}`,
    merchant,
  });
};

export const useTechnicalInfo = ({
  productCode,
}: {
  productCode: InstanceTechnicalName;
}) => {
  const context = React.useContext(ShellContext);
  const subsidiary = context.environment.getUser().ovhSubsidiary;

  return useQuery({
    queryKey: ['technicalInfo', productCode],
    queryFn: () => getTechnicalInfo({ productCode, merchant: subsidiary }),
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

  return useQuery({
    queryKey: ['pricingInfo', productSizeCode],
    queryFn: () =>
      getCommercialOffers({
        productCode: productSizeCode,
        serviceId,
      }),
    select: (res) =>
      res.map(formatPricingInfo).filter((item) => item.id !== null),
  });
};

export default useTechnicalInfo;
