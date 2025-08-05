import React from 'react';
import { useGetBillingInfo } from '@/hooks/useGetBillingInfo';
import { SkeletonCell } from './skeletonCell';
import { BillingInfo } from '@/data/types/billing.type';

export type BillingProps = {
  server: string;
  children: (billing: BillingInfo) => React.ReactElement;
};

export const DSBilling = ({ server, children }: BillingProps) => {
  const { billingInfo, isLoading, error } = useGetBillingInfo({ server });
  return (
    billingInfo && (
      <SkeletonCell isLoading={isLoading} error={error}>
        {billingInfo ? children(billingInfo) : <>-</>}
      </SkeletonCell>
    )
  );
};
