import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@ovhcloud/ods-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import config from '@/web-domains.config';
import { urls } from '@/domain/routes/routes.constant';

interface BreadcrumbAnyCastProps {
  readonly serviceName: string;
}

export const BreadcrumbAnyCast: React.FC<BreadcrumbAnyCastProps> = ({
  serviceName,
}: BreadcrumbAnyCastProps) => {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const rootUrl = `/#/${config.rootLabel}`;
  const parentUrl = `${rootUrl}${urls.domainRoot}`;
  const dnsUrl = `${rootUrl}${urls.domainTabDns.replace(
    ':serviceName',
    serviceName,
  )}`;
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href={parentUrl}>Domain</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href={dnsUrl}>{serviceName}</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink>{t('domain_tab_DNS_anycast_order')}</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

export default BreadcrumbAnyCast;
