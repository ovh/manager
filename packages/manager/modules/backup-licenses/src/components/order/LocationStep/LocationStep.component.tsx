import React from 'react';

import OrderTerms from '@/components/order/OrderTerms/OrderTerms.component';
import RegionSelector from '@/components/order/RegionSelector/RegionSelector.component';
import { OrderCartPreparation } from '@/hooks/useOrderCartPreparation/useOrderCartPreparation';

interface LocationStepProps {
  selected: string | null;
  isDisabled?: boolean;
  onSelect: (apiValue: string) => void;
  cart: OrderCartPreparation;
}

export default function LocationStep({
  selected,
  isDisabled = false,
  onSelect,
  cart,
}: LocationStepProps) {
  return (
    <section className="flex flex-col gap-8">
      <RegionSelector selected={selected} isDisabled={isDisabled} onSelect={onSelect} />
      <OrderTerms
        contractList={cart.contractList}
        hasRegion={selected !== null}
        isPreparing={cart.isPreparing}
        hasFailed={cart.hasPreparationFailed}
        isAccepted={cart.areTermsAccepted}
        isDisabled={isDisabled}
        onAcceptChange={cart.acceptTerms}
        onRetry={cart.retryPreparation}
      />
    </section>
  );
}
