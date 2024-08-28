import React from 'react';
import { Headers, HeadersProps } from '../../content';
import { OdsText } from '@ovhcloud/ods-components/react';
import { LinkType, Links, Subtitle } from '../../typography';
import { PageLayout } from '../layout/layout.component';

export interface DashboardLayoutProps {
  breadcrumb?: React.ReactElement;
  content?: React.ReactElement;
  header?: HeadersProps;
  message?: React.ReactElement;
  description?: string;
  subtitle?: string;
  subdescription?: string;
  backLinkLabel?: string;
  tabs?: React.ReactElement;
  onClickReturn?: () => void;
}

export const DashboardLayout = ({
  backLinkLabel,
  onClickReturn,
  breadcrumb,
  description,
  subtitle,
  subdescription,
  message,
  content,
  header,
  tabs,
}: DashboardLayoutProps) => (
  <PageLayout>
    <div className="mb-6">{breadcrumb}</div>
    {header && <Headers {...header} />}
    <div>
      {backLinkLabel && onClickReturn && (
        <Links
          data-testid="manager-back-link"
          className="mb-8"
          onClickReturn={onClickReturn}
          label={backLinkLabel}
          type={LinkType.back}
        />
      )}
    </div>
    {description && <OdsText>{description}</OdsText>}
    {message && <div className="mb-8">{message}</div>}
    {subtitle && <Subtitle className="block mb-6">{subtitle}</Subtitle>}
    {subdescription && <OdsText>{subdescription}</OdsText>}
    <div className="mb-6">{tabs}</div>
    <div>{content}</div>
  </PageLayout>
);
