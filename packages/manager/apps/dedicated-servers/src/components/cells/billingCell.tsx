import React from 'react';
import { useGetBillingInfo } from '@/hooks/useGetBillingInfo';
import { SkeletonCell } from '../skeletonCell';
import { BillingInfo } from '@/data/types/billing.type';
import { DedicatedServer } from '@/data/types/server.type';
import { useGetNutanixServer } from '@/hooks/useGetNutanixServer';

export type BillingProps = {
  server: DedicatedServer;
  children: (billing: BillingInfo) => React.ReactElement;
};

export const DSBilling = ({ server, children }: BillingProps) => {
  const { billingInfo, isLoading, error } = useGetBillingInfo({ server });
  return (
    <SkeletonCell isLoading={isLoading} error={error}>
      {billingInfo ? children(billingInfo) : <>-</>}
    </SkeletonCell>
  );
};
