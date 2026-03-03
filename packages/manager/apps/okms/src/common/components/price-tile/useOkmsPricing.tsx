import { IntervalUnit } from '@ovh-ux/muk';

import { useOrderCatalogOkms } from '@/common/data/hooks/useOrderCatalogOkms';

import { PricingProductCode } from './pricingTile.type';

type OkmsPricingData = {
  price: number;
  tax: number;
  intervalUnit: IntervalUnit;
};

const PRODUCT_CODE_TO_ADDON_CODE: Record<PricingProductCode, string> = {
  servicekey: 'okms-servicekey-monthly-consumption',
  secret: 'okms-secret-monthly-consumption',
};

type UseOkmsPricingProps = {
  productCode: PricingProductCode;
};

type UseOkmsPricingResult =
  | { isPending: true; isError: false; pricingData: undefined }
  | { isPending: false; isError: true; pricingData: undefined }
  | { isPending: false; isError: false; pricingData: OkmsPricingData };

export const useOkmsPricing = ({ productCode }: UseOkmsPricingProps): UseOkmsPricingResult => {
  const { data: catalog, isPending, isError } = useOrderCatalogOkms();

  if (isPending) {
    return { isPending: true, isError: false, pricingData: undefined };
  }

  if (isError || !catalog) {
    return { isPending: false, isError: true, pricingData: undefined };
  }

  const addonCode = PRODUCT_CODE_TO_ADDON_CODE[productCode];
  const addon = catalog.addons.find((a) => a.planCode === addonCode);
  const plan = catalog.plans.find((p) => p.planCode === 'okms');

  if (!addon?.pricings?.[0] || !plan?.pricings?.[0]) {
    return { isPending: false, isError: true, pricingData: undefined };
  }

  return {
    isPending: false,
    isError: false,
    pricingData: {
      price: addon.pricings[0].price,
      tax: addon.pricings[0].tax,
      intervalUnit: plan.pricings[0].intervalUnit,
    },
  };
};
