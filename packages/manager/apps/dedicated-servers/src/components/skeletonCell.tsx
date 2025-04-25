import { ApiError } from '@ovh-ux/manager-core-api';
import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import React, { PropsWithChildren, useContext } from 'react';

export type SkeletonCellParams = {
  isLoading: boolean;
  enabled?: boolean;
  error?: ApiError;
  server?: string;
};

export const SkeletonCell = ({
  isLoading,
  enabled = true,
  error,
  children,
}: PropsWithChildren<SkeletonCellParams>) => {
  if (!enabled || !!error) return null;
  return <>{isLoading ? <OdsSkeleton /> : children}</>;
};
