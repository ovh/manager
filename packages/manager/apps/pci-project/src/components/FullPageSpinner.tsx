import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ComponentProps, HTMLAttributes, memo } from 'react';

interface FullPageSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
  spinnerProps?: ComponentProps<typeof OdsSpinner>;
}

export default memo(function FullPageSpinner({
  'data-testid': dataTestId = 'full-page-spinner',
  spinnerProps,
  className = '',
  ...containerProps
}: FullPageSpinnerProps) {
  return (
    <div
      {...containerProps}
      className={`flex items-center justify-center w-full h-full min-h-screen ${className}`}
      data-testid={dataTestId}
      role="alert"
      aria-live="polite"
      aria-busy="true"
    >
      <OdsSpinner
        role="status"
        aria-label={spinnerProps?.['aria-label'] || 'Loading'}
        {...spinnerProps}
      />
    </div>
  );
});
