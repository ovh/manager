import React, { ReactNode } from 'react';

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
    className?: string;
    isError?: boolean;
    errorComponent?: ReactNode;
  }>
> = ({
  title,
  description,
  isLoading,
  className,
  isError,
  errorComponent,
  children,
}) => (
  <section className=" mb-8 flex max-w-[1368px] flex-col">
    <OdsText className="mb-3 block" preset={ODS_TEXT_PRESET.heading2}>
      {title}
    </OdsText>
    <OdsText className="mb-7 block" preset={ODS_TEXT_PRESET.paragraph}>
      {description}
    </OdsText>
    {isLoading && (
      <div className="text-center">
        <OdsSpinner size={ODS_SPINNER_SIZE.md} />
      </div>
    )}
    {!isLoading && !isError && <div className={className}>{children}</div>}
    {!isLoading && isError && errorComponent}
    <OdsDivider className="mt-8 block" />
  </section>
);
