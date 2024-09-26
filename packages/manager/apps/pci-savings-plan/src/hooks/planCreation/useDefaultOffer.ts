import React, { useEffect, useState } from 'react';
import { formatPricingInfo } from '@/utils/formatter/formatter';

export type PricingByDurationType = ReturnType<typeof formatPricingInfo>;

export const useDefaultOfferId = (
  pricingByDuration: PricingByDurationType[],
): [
  string | undefined,
  React.Dispatch<React.SetStateAction<string | undefined>>,
] => {
  const [offerIdSelected, setOfferIdSelected] = useState<string>();

  useEffect(() => {
    if (pricingByDuration.length) {
      const twelveMonthDefaultOffer = pricingByDuration.find((p) =>
        p.code.includes('12-months'),
      );
      if (twelveMonthDefaultOffer) {
        setOfferIdSelected(twelveMonthDefaultOffer.id);
      }
    }
  }, [pricingByDuration]);

  return [offerIdSelected, setOfferIdSelected];
};
