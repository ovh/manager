import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsDivider, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';

export const OrderSection: React.FC<React.PropsWithChildren<{
  title: string;
  description?: string;
}>> = ({ title, description, children }) => (
  <section className="max-w-[784px] mb-8">
    <OdsText className="block mb-3" preset={ODS_TEXT_PRESET.heading2}>
      {title}
    </OdsText>
    <OdsText className="block mb-3" preset={ODS_TEXT_PRESET.paragraph}>
      {description}
    </OdsText>
    {children}
    <OdsDivider className="block mt-8" />
  </section>
);
