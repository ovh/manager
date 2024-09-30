import React, { useMemo } from 'react';
import clsx from 'clsx';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { TPricing } from '../api/data';
import { usePricing } from '../hooks';
import { PriceFormattingOptions } from '../hooks/usePricing';

interface PricingProps {
  pricing: TPricing;
  options?: PriceFormattingOptions;
}

export function Pricing({ pricing, options }: Readonly<PricingProps>) {
  const { getPriceDetails } = usePricing();
  const price = useMemo(() => pricing && getPriceDetails(pricing, options), [
    pricing,
    options,
  ]);
  if (!price) return <OsdsSkeleton />;
  return (
    <span>
      <span className={clsx(price?.secondary && 'font-bold')}>
        {price?.primary}
      </span>
      {price?.secondary && ` (${price?.secondary})`}
      {price?.interval && ` / ${price?.interval}`}
    </span>
  );
}
