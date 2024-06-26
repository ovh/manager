import { useQuery } from '@tanstack/react-query';
import { TechnicalInfo } from '@/data/api/commercial-catalog';
import { buildTechnicalInfosMock } from '@/mock/commercial-catalog/technical';
import {
  formatPricingInfo,
  formatTechnicalInfo,
} from '@/utils/formatter/formatter';
import { CommercialCatalogPricing } from '@/data/api/commercial-catalog-pricing';
import { buildPricingsMock } from '@/mock/commercial-catalog/pricing';
import { InstanceTechnicalName } from '@/components/CreatePlanForm/CreatePlan.type';

export const getTechnicalInfo = async (
  productCode: string,
): Promise<TechnicalInfo[]> => {
  // TODO: Fetch to real api

  return Promise.resolve(buildTechnicalInfosMock(productCode));
};

export const getPricingInfo = async (
  productSizeCode: string,
): Promise<CommercialCatalogPricing[]> => {
  // TODO: Fetch to real api

  return Promise.resolve(buildPricingsMock(productSizeCode));
};

export const useTechnicalInfo = ({
  productCode,
}: {
  productCode: InstanceTechnicalName;
}) => {
  return useQuery({
    queryKey: ['technicalInfo', productCode],
    queryFn: () => getTechnicalInfo(productCode),
    select: (res) => res.map(formatTechnicalInfo),
  });
};

export const usePricingInfo = ({
  productSizeCode,
}: {
  productSizeCode: string;
}) => {
  return useQuery({
    queryKey: ['pricingInfo', productSizeCode],
    queryFn: () => getPricingInfo(productSizeCode),
    select: (res) => res.map(formatPricingInfo),
  });
};
export default useTechnicalInfo;
