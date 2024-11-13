import React from 'react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsLink, OdsMessage } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

import './translations';

interface PciMaintenanceProps {
  productName?: string;
  projectName?: string;
  serviceName?: string;
  maintenanceURL: string;
}

export function PciMaintenanceBanner({
  productName,
  projectName,
  serviceName,
  maintenanceURL,
}: Readonly<PciMaintenanceProps>) {
  const { t } = useTranslation('pci-maintenance-banner');

  return (
    <OdsMessage
      color={ODS_MESSAGE_COLOR.warning}
      data-testid="maintenance-banner"
    >
      {projectName && (
        <span
          dangerouslySetInnerHTML={{
            __html: t('pci_projects_maintenance_banner_info_project_page', {
              projectName,
            }),
          }}
        />
      )}
      {productName && (
        <span
          dangerouslySetInnerHTML={{
            __html: t('pci_projects_maintenance_banner_info_list_page', {
              productName: `<span class="font-bold">${productName}</span>`,
            }),
          }}
        />
      )}
      {serviceName && (
        <span
          dangerouslySetInnerHTML={{
            __html: t('pci_projects_maintenance_banner_info_product_page', {
              productServiceName: serviceName,
            }),
          }}
        />
      )}
      <span>
        <OdsLink
          data-testid="pci-maintenance-banner-link"
          className="ml-4"
          href={maintenanceURL}
          target="_blank"
          label={t('pci_projects_maintenance_banner_info_link')}
        />
      </span>
    </OdsMessage>
  );
}
