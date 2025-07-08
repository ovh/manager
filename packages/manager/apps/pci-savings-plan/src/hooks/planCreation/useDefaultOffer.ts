import React, { useEffect, useState } from 'react';
import { formatPricingInfo } from '@/utils/formatter/formatter';

export type TPricingByDuration = ReturnType<typeof formatPricingInfo>;

export const useDefaultOfferId = (
  pricingByDuration: TPricingByDuration[],
): [
  string | undefined,
  React.Dispatch<React.SetStateAction<string | undefined>>,
] => {
  const [offerIdSelected, setOfferIdSelected] = useState<string>();

  useEffect(() => {
    if (!pricingByDuration.length) {
      setOfferIdSelected(undefined);
    }
  }, [pricingByDuration]);

  return [offerIdSelected, setOfferIdSelected];
};
