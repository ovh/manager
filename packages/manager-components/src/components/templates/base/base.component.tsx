import React from 'react';
import { Headers, HeadersProps } from '../../content';
import { Description, LinkType, Links, Subtitle } from '../../typography';
import { PageLayout } from '../layout/layout.component';

export interface BaseLayoutProps {
  breadcrumb?: React.ReactElement;
  header?: HeadersProps;
  message?: React.ReactElement;
  description?: string;
  subtitle?: string;
  subdescription?: string;
  backLinkLabel?: string;
  tabs?: React.ReactElement;
  onClickReturn?: () => void;
  children?: React.ReactElement | React.ReactElement[];
}

export const BaseLayout = ({
  backLinkLabel,
  onClickReturn,
  breadcrumb,
  description,
  subtitle,
  subdescription,
  message,
  children,
  header,
  tabs,
}: BaseLayoutProps) => (
  <PageLayout>
    <div className="mb-6">{breadcrumb}</div>
    {header && <Headers {...header} />}
    {backLinkLabel && onClickReturn && (
      <Links
        className="mb-8"
        onClickReturn={onClickReturn}
        label={backLinkLabel}
        type={LinkType.back}
      />
    )}
    {description && <Description className="mb-8">{description}</Description>}
    {message && <div className="mb-8">{message}</div>}
    {subtitle && <Subtitle className="block mb-6">{subtitle}</Subtitle>}
    {subdescription && (
      <Description className="mb-8">{subdescription}</Description>
    )}
    <div className="mb-6">{tabs}</div>
    <div>{children}</div>
  </PageLayout>
);
