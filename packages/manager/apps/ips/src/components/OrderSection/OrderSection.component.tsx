import React from 'react';

import { ODS_SPINNER_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsDivider,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';

export const OrderSection: React.FC<
  React.PropsWithChildren<{
    title: string;
    description?: string;
    isLoading?: boolean;
  }>
> = ({ title, description, isLoading, children }) => (
  <section className="mb-8 max-w-[1368px]">
    <OdsText className="mb-3 block" preset={ODS_TEXT_PRESET.heading2}>
      {title}
    </OdsText>
    <OdsText className="mb-3 block" preset={ODS_TEXT_PRESET.paragraph}>
      {description}
    </OdsText>
    {isLoading ? (
      <div className="text-center">
        <OdsSpinner size={ODS_SPINNER_SIZE.md} />
      </div>
    ) : (
      children
    )}
    <OdsDivider className="mt-8 block" />
  </section>
);
