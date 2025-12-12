import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@ovhcloud/ods-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import config from '@/web-domains.config';
import { urls } from '@/domain/routes/routes.constant';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

interface BreadcrumbAnyCastProps {
  readonly serviceName: string;
}

export const BreadcrumbWebHostingOrder: React.FC<BreadcrumbAnyCastProps> = ({
  serviceName,
}: BreadcrumbAnyCastProps) => {
  const { t } = useTranslation(['domain']);
  const detailsUrl = `${urls.domainDetail.replace(
    ':serviceName',
    serviceName,
  )}/information`;
  const { data: url } = useNavigationGetUrl([config.rootLabel, detailsUrl, {}]);
  const { data: parentUrl } = useNavigationGetUrl([
    config.rootLabel,
    urls.domainRoot,
    {},
  ]);
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href={parentUrl}>Domain</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href={url}>{serviceName}</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink>
          {t(
            'domain_tab_general_information_associated_services_hosting_action_order',
          )}
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

export default BreadcrumbWebHostingOrder;
