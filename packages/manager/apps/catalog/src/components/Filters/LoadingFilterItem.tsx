import React from 'react';
import { OdsSkeleton } from '@ovhcloud/ods-components/react';

interface LoadingFilterItemProps {
  lineNumber?: number;
}

const LoadingFilterItem: React.FC<LoadingFilterItemProps> = ({
  lineNumber = 1,
}) => (
  <>
    {Array.from({ length: lineNumber }, (_, index) => (
      <span key={index} className="break-inside-avoid">
        <OdsSkeleton />
      </span>
    ))}
  </>
);

export default LoadingFilterItem;
