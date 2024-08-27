import React from 'react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsLink,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
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
    <OsdsMessage type={ODS_MESSAGE_TYPE.warning}>
      {projectName && (
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.default}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: t('pci_projects_maintenance_banner_info_project_page', {
                projectName,
              }),
            }}
          />
        </OsdsText>
      )}
      {productName && (
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.default}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: t('pci_projects_maintenance_banner_info_list_page', {
                productName: `<span class="font-bold">${productName}</span>`,
              }),
            }}
          />
        </OsdsText>
      )}
      {serviceName && (
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.default}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: t('pci_projects_maintenance_banner_info_product_page', {
                productServiceName: serviceName,
              }),
            }}
          />
        </OsdsText>
      )}
      <OsdsLink
        className="ml-4"
        color={ODS_THEME_COLOR_INTENT.primary}
        href={maintenanceURL}
        target={OdsHTMLAnchorElementTarget._blank}
      >
        {t('pci_projects_maintenance_banner_info_link')}
      </OsdsLink>
    </OsdsMessage>
  );
}
