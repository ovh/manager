import { OdsSpinner } from '@ovhcloud/ods-components/react';
import React from 'react';

interface FullPageSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
  spinnerProps?: React.ComponentProps<typeof OdsSpinner>;
}

export default function FullPageSpinner({
  'data-testid': dataTestId = 'full-page-spinner',
  spinnerProps,
  className = '',
  ...containerProps
}: FullPageSpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center w-full h-full min-h-screen ${className}`}
      data-testid={dataTestId}
      {...containerProps}
    >
      <OdsSpinner {...spinnerProps} />
    </div>
  );
}
