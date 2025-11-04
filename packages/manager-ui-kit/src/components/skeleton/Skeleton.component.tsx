import { Skeleton as OdsSkeleton } from '@ovhcloud/ods-react';

import { SkeletonProps } from '@/components/skeleton/Skeleton.props';

export const Skeleton = (props: SkeletonProps) => <OdsSkeleton {...props} />;
