import React from 'react';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OdsSpinner } from '@ovhcloud/ods-components/react';

type LoadingType = Partial<HTMLOdsSpinnerElement>;

export const Loading: React.FC<LoadingType> = ({
  className = 'flex justify-center my-5',
  size = ODS_SPINNER_SIZE.md,
}) => {
  return (
    <div data-testid="spinner" className={className}>
      <OdsSpinner size={size} inline-block></OdsSpinner>
    </div>
  );
};

export default Loading;
