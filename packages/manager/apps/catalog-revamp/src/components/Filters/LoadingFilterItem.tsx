import React from 'react';
import { OsdsSkeleton } from '@ovhcloud/ods-components/skeleton/react';

interface LoadingFilterItemProps {
  lineNumber?: number;
}

const LoadingFilterItem: React.FC<LoadingFilterItemProps> = ({
  lineNumber = 1,
}) => (
  <>
    {Array.from({ length: lineNumber }, (_, index) => (
      <div key={index} className="break-inside-avoid">
        <OsdsSkeleton />
      </div>
    ))}
  </>
);

export default LoadingFilterItem;
