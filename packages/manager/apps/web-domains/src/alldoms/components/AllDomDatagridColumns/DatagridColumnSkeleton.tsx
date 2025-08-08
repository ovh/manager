import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import React from 'react';

interface DatagridColumnSkeletonProps {
  readonly serviceId: number;
}

export default function DatagridColumnSkeleton({
  serviceId,
  children,
}: Readonly<React.PropsWithChildren<DatagridColumnSkeletonProps>>) {
  if (!serviceId) {
    return <OdsSkeleton className="[&::part(skeleton)]:max-w-[5rem]" />;
  }

  return children;
}
