import React from 'react';
import { Skeleton } from '@ovhcloud/ods-react';

interface DatagridColumnSkeletonProps {
  readonly serviceId: number;
}

export default function DatagridColumnSkeleton({
  serviceId,
  children,
}: Readonly<React.PropsWithChildren<DatagridColumnSkeletonProps>>) {
  if (!serviceId) {
    return <Skeleton className="[&::part(skeleton)]:max-w-[5rem]" />;
  }

  return children;
}
