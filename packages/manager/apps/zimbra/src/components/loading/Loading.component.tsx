import React from 'react';

import { SPINNER_SIZE, Spinner, SpinnerProp } from '@ovhcloud/ods-react';

export const Loading: React.FC<SpinnerProp> = ({
  className = 'flex justify-center my-5',
  size = SPINNER_SIZE.md,
}) => {
  return (
    <div data-testid="spinner" className={className}>
      <Spinner size={size}></Spinner>
    </div>
  );
};

export default Loading;
