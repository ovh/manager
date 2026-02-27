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
    description2?: string;
    description3?: string;
    isLoading?: boolean;
    className?: string;
    isError?: boolean;
    errorComponent?: ReactNode;
  }>
> = ({
  title,
  description,
  description2,
  description3,
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
    {(description || description2 || description3) && (
      <div className="mb-7 flex flex-col gap-[1em]">
        {description && (
          <OdsText className="block" preset={ODS_TEXT_PRESET.paragraph}>
            {description}
          </OdsText>
        )}
        {description2 && (
          <OdsText className="block" preset={ODS_TEXT_PRESET.paragraph}>
            {description2}
          </OdsText>
        )}
        {description3 && (
          <OdsText className="block" preset={ODS_TEXT_PRESET.paragraph}>
            {description3}
          </OdsText>
        )}
      </div>
    )}
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
