import React from 'react';

import { OsdsSkeleton } from '@ovhcloud/ods-components/react';

interface LoadingFilterItemProps {
  lineNumber?: number;
}

const LoadingFilterItem: React.FC<LoadingFilterItemProps> = ({ lineNumber = 1 }) => (
  <>
    {Array.from({ length: lineNumber }, (_, index) => (
      <span key={index} className="break-inside-avoid">
        <OsdsSkeleton />
      </span>
    ))}
  </>
);

export default LoadingFilterItem;
