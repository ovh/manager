import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { FC, PropsWithChildren } from 'react';

export type TLoadingCellProps = PropsWithChildren<{
  isLoading: boolean;
}>;

export const LoadingCell: FC<TLoadingCellProps> = ({ isLoading, children }) => (
  <div data-testid="loading-cell">
    {isLoading ? <OsdsSkeleton data-testid="skeleton" /> : children}
  </div>
);
