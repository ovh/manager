import React from 'react';
import { Headers, HeadersProps } from '../../content';
import { Description, LinkType, Links, Subtitle } from '../../typography';
import { PageLayout } from '../layout/layout.component';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

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
    <div className="mb-6">{breadcrumb}</div>
    {header && <Headers {...header} />}
    {backLinkLabel && (onClickReturn || hrefPrevious) && (
      <Links
        className="mb-6"
        onClickReturn={onClickReturn}
        label={backLinkLabel}
        type={LinkType.back}
        target={OdsHTMLAnchorElementTarget._self}
        href={hrefPrevious}
      />
    )}
    {description && <Description className="mb-6">{description}</Description>}
    {message && <div className="mb-8 max-w-[800px]">{message}</div>}
    {subtitle && <Subtitle className="block mb-6">{subtitle}</Subtitle>}
    {subDescription && (
      <Description className="mb-8">{subDescription}</Description>
    )}
    <div className="mb-6">{tabs}</div>
    {children}
  </PageLayout>
);
