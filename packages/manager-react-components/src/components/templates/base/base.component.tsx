import React from 'react';
import { Headers, HeadersProps } from '../../content';
import { OdsText } from '@ovhcloud/ods-components/react';
import { LinkType, Links, Subtitle } from '../../typography';
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
    <div>{breadcrumb}</div>
    {header && <Headers {...header} />}
    <div>
      {backLinkLabel && (onClickReturn || hrefPrevious) && (
        <Links
          onClickReturn={onClickReturn}
          label={backLinkLabel}
          type={LinkType.back}
          target={OdsHTMLAnchorElementTarget._self}
          href={hrefPrevious}
        />
      )}
    </div>
    {description && <OdsText>{description}</OdsText>}
    {message && <div className="mb-8">{message}</div>}
    {subtitle && <Subtitle className="block mb-6">{subtitle}</Subtitle>}
    {subDescription && <OdsText>{subDescription}</OdsText>}
    <div className="mb-6">{tabs}</div>
    {children}
  </PageLayout>
);
