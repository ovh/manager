import React, { useEffect, useState } from 'react';
import { TPricingInfo } from '../useCatalogCommercial';

export const useDefaultOfferId = (
  pricingByDuration: TPricingInfo[],
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
