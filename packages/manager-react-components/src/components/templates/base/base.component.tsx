import React from 'react';
import { Headers, HeadersProps } from '../../content';
import { OdsText } from '@ovhcloud/ods-components/react';
import { LinkType, Links, Subtitle } from '../../typography';
import { PageLayout } from '../layout/layout.component';

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
    <div>{breadcrumb}</div>
    {header && (
      <div className="mt-[24px]">
        <Headers {...header} />
      </div>
    )}
    {backLinkLabel && (onClickReturn || hrefPrevious) && (
      <div className="mb-[24px]">
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
      <OdsText className="mb-[24px]" preset="span">
        {description}
      </OdsText>
    )}
    {message && <div className="mb-8">{message}</div>}
    {subtitle && <Subtitle className="block mb-6">{subtitle}</Subtitle>}
    {subDescription && <OdsText preset="span">{subDescription}</OdsText>}
    <div className="mb-6">{tabs}</div>
    {children}
  </PageLayout>
);
