import { FC, PropsWithChildren } from 'react';
import { Skeleton } from '@ovhcloud/ods-react';

export type TLoadingCellProps = PropsWithChildren<{
  isLoading: boolean;
}>;

export const LoadingCell: FC<TLoadingCellProps> = ({ isLoading, children }) => (
  <div data-testid="loading-cell">
    {isLoading ? <Skeleton data-testid="skeleton" /> : children}
  </div>
);
