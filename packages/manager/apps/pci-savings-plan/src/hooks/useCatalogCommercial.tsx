import { useQuery } from '@tanstack/react-query';
import { v2 } from '@ovh-ux/manager-core-api';
import {
  formatPricingInfo,
  formatTechnicalInfo,
} from '@/utils/formatter/formatter';
import { InstanceTechnicalName } from '@/types/CreatePlan.type';
import {
  CommercialCatalogPricingType,
  CommercialCatalogTechnicalType,
} from '@/types/commercial-catalog.type';

const getCatalogCommercial = async <T,>(
  additionalParams: string,
): Promise<T> => {
  const { data } = await v2.get<T>(
    // TODO: Change the locale based on manager
    `commercialCatalog/offers?merchants=FR&type=ATOMIC&${additionalParams}`,
  );
  return data;
};

export const getCommercialOffers = async (
  productCode: string,
): Promise<CommercialCatalogPricingType[]> => {
  return getCatalogCommercial<CommercialCatalogPricingType[]>(
    `nature=BILLING_PLAN&productCode=${productCode}%20SP`,
  );
};

export const getTechnicalInfo = async (
  productCode: string,
): Promise<CommercialCatalogTechnicalType[]> => {
  return getCatalogCommercial<CommercialCatalogTechnicalType[]>(
    `nature=REGULAR&productCode=${productCode}`,
  );
};

export const useTechnicalInfo = ({
  productCode,
}: {
  productCode: InstanceTechnicalName;
}) =>
  useQuery({
    queryKey: ['technicalInfo', productCode],
    queryFn: () => getTechnicalInfo(productCode),
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

export const usePricingInfo = ({
  productSizeCode,
}: {
  productSizeCode: string;
}) =>
  useQuery({
    queryKey: ['pricingInfo', productSizeCode],
    queryFn: () => getCommercialOffers(productSizeCode),
    select: (res) =>
      res.map(formatPricingInfo).filter((item) => item.id !== null),
  });

export default useTechnicalInfo;
