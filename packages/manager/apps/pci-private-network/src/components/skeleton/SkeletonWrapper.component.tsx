import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { FC, PropsWithChildren } from 'react';

const SkeletonWrapper: FC<PropsWithChildren<{ isPending: boolean }>> = ({
  isPending,
  children,
}) => (isPending ? <OsdsSkeleton /> : children);

export default SkeletonWrapper;
