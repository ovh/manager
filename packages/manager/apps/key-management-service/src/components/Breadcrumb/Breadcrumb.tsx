import React from 'react';
import { useBreadcrumb } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';

function Breadcrumb(): JSX.Element {
  const { t } = useTranslation('key-management-service/listing');

  const breadcrumbItems = useBreadcrumb({
    rootLabel: t('key_management_service_listing_title'),
    appName: 'key-management-service',
  });

  return <OsdsBreadcrumb items={breadcrumbItems} />;
}

export default Breadcrumb;
