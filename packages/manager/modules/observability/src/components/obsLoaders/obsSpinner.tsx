import React from 'react';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE, ODS_SPINNER_COLOR } from '@ovhcloud/ods-components';

export interface ObsSpinnerProps {
  message?: string;
  details?: string;
  size?: ODS_SPINNER_SIZE;
  color?: ODS_SPINNER_COLOR;
}

export const ObsSpinner = ({
  message,
  details,
  size = ODS_SPINNER_SIZE.md,
  color = ODS_SPINNER_COLOR.primary,
}: Readonly<ObsSpinnerProps>): JSX.Element => {
  const hasMessage = message !== undefined && message.trim() !== '';
  const hasDetails = details !== undefined && details.trim() !== '';

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <OdsSpinner size={size} color={color} />
      {hasMessage && <span className="heading-6">{message}</span>}

      {hasDetails && (
        <div className="mt-4 text-sm text-gray-600">
          <span className="heading-6">{details}</span>
        </div>
      )}
    </div>
  );
};
