import { ApiError } from '@ovh-ux/manager-core-api';
import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import React, { PropsWithChildren, useContext } from 'react';
import { ListingContext } from '@/pages/listing/listingContext';

export type SkeletonCellParams = {
  isLoading: boolean;
  enabled?: boolean;
  error?: ApiError;
  ip?: string;
};

/**
 * To render cell that is loading asynchronous datas
 * @param isLoading the loading state for the cell
 * @param enabled if false, return empty cell
 * @param error if error is defined, return empty cell
 * @param ip if ip is set and flag as expired, return empty cell
 * @returns React node of a datagrid cell
 */
export const SkeletonCell = ({
  isLoading,
  enabled = true,
  error,
  ip,
  children,
}: PropsWithChildren<SkeletonCellParams>) => {
  const { addExpiredIp } = useContext(ListingContext);

  // If ip is set and asynchronous call gives error 460 we add it on expired ips list
  if (ip && error?.response.status === 460) addExpiredIp(ip);

  // If not enable or if there is an error, return an empty cell
  if (!enabled || !!error) return null;
  return <>{isLoading ? <OdsSkeleton /> : children}</>;
};
