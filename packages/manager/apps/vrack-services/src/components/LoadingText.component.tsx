import React from 'react';
import { ODS_SPINNER_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';

export type LoadingTextProps = {
  title?: string;
  description?: string;
};

export const LoadingText: React.FC<LoadingTextProps> = ({
  title,
  description,
}) => (
  <div className="flex items-center">
    <OdsSpinner size={ODS_SPINNER_SIZE.md} />
    <div className="ml-5 mb-3 flex flex-col">
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{title}</OdsText>
      {description && (
        <OdsText className="block" preset={ODS_TEXT_PRESET.paragraph}>
          {description}
        </OdsText>
      )}
    </div>
  </div>
);
