import React from 'react';
import {
  OdsBadge,
  OdsSkeleton,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';

export const Loading = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={`flex justify-center ${props.className}`}>
    <OdsSpinner size="md" />
  </div>
);

export const LoadingChip = ({ className }: { className?: string }) => (
  <OdsBadge className={`mt-1 ${className}`} color="neutral" label="">
    <OdsSkeleton />
  </OdsBadge>
);
