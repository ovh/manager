import React from 'react';
import { Headers, HeadersProps } from '../../content';
import { OdsText } from '@ovhcloud/ods-components/react';
import { LinkType, Links, Subtitle } from '../../typography';
import { PageLayout } from '../layout/layout.component';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';

export type BaseLayoutProps = React.PropsWithChildren<{
  breadcrumb?: React.ReactElement;
  header?: HeadersProps;
  message?: React.ReactElement;
  description?: string;
  subtitle?: string;
  subDescription?: string;
  backLinkLabel?: string;
  hrefPrevious?: string;
  tabs?: React.ReactElement;
  onClickReturn?: () => void;
}>;

export const BaseLayout = ({
  backLinkLabel,
  hrefPrevious,
  onClickReturn,
  breadcrumb,
  description,
  subtitle,
  subDescription,
  message,
  children,
  header,
  tabs,
}: BaseLayoutProps) => (
  <PageLayout>
    <div className="mb-5">{breadcrumb}</div>
    {header && (
      <div className="mb-4">
        <Headers {...header} />
      </div>
    )}
    {backLinkLabel && (onClickReturn || hrefPrevious) && (
      <div className="mb-4">
        <Links
          data-testid="manager-back-link"
          onClickReturn={onClickReturn}
          label={backLinkLabel}
          type={LinkType.back}
          target="_self"
          href={hrefPrevious}
        />
      </div>
    )}
    {description && (
      <OdsText className="mb-4 block" preset={ODS_TEXT_PRESET.paragraph}>
        {description}
      </OdsText>
    )}
    {message && <div className="mb-5 max-w-[800px]">{message}</div>}
    {subtitle && <Subtitle className="block mb-6">{subtitle}</Subtitle>}
    {subDescription && <OdsText preset="span">{subDescription}</OdsText>}
    <div className="mb-6">{tabs}</div>
    {children}
  </PageLayout>
);
