import { Skeleton } from '@ovhcloud/ods-react';

import { SkeletonWrapperProps } from '@/components/dashboard/SkeletonWrapper.props';

export const SkeletonWrapper = ({ isLoading, children }: SkeletonWrapperProps) => {
  if (isLoading) {
    return <Skeleton />;
  }
  return <>{children}</>;
};

export default SkeletonWrapper;
