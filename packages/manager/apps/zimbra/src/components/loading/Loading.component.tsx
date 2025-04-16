import React from 'react';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';

export const Loading = ({
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
