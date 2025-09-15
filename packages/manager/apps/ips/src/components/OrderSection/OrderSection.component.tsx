import React from 'react';
import {
  OdsDivider,
  OdsText,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';

export const OrderSection: React.FC<React.PropsWithChildren<{
  title: string;
  description?: string;
  isLoading?: boolean;
}>> = ({ title, description, isLoading, children }) => (
  <section className="max-w-[1368px] mb-8">
    <OdsText className="block mb-3" preset={ODS_TEXT_PRESET.heading2}>
      {title}
    </OdsText>
    <OdsText className="block mb-3" preset={ODS_TEXT_PRESET.paragraph}>
      {description}
    </OdsText>
    {isLoading ? (
      <div className="text-center">
        <OdsSpinner size={ODS_SPINNER_SIZE.md} />
      </div>
    ) : (
      children
    )}
    <OdsDivider className="block mt-8" />
  </section>
);
