import {
  DashboardTile,
  Description,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import {
  OsdsChip,
  OsdsIcon,
  OsdsButton,
  OsdsSkeleton,
  OsdsLink,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { getStatusColor } from '@/utils/statusColor';
import { useDetailsLicenseHYCU } from '@/hooks/api/license';
import { LicenseStatus } from '@/type/hycu.details.interface';

const DownloadHycuLicense = ({ serviceName }: { serviceName: string }) => {
  const { t } = useTranslation('hycu/dashboard');
  const { data: hycuDetail, isLoading } = useDetailsLicenseHYCU(serviceName);

  if (isLoading) return <OsdsSkeleton />;
  if (LicenseStatus.ACTIVATED !== hycuDetail.data.licenseStatus)
    return <>{t('hycu_dashboard_wait_for_activation')}</>;
  return (
    <OsdsLink color={ODS_THEME_COLOR_INTENT.primary}>
      {t('hycu_dashboard_download_license_file')}
      <span slot="end">
        <OsdsIcon
          className="ml-3"
          name={ODS_ICON_NAME.DOWNLOAD}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
        ></OsdsIcon>
      </span>
    </OsdsLink>
  );
};

const ControllerIdHycuLicense = ({ serviceName }: { serviceName: string }) => {
  const { t } = useTranslation('hycu/dashboard');
  const { data: hycuDetail, isLoading } = useDetailsLicenseHYCU(serviceName);

  if (isLoading) return <OsdsSkeleton />;
  if (!hycuDetail?.data.controllerId)
    return <>{t('hycu_dashboard_wait_for_activation')}</>;
  return <Description>{hycuDetail?.data.controllerId}</Description>;
};

const GeneralInformationsTile = ({ serviceName }: { serviceName: string }) => {
  const { t: tCommon } = useTranslation('hycu');
  const { t } = useTranslation('hycu/dashboard');
  const { data: hycuDetail } = useDetailsLicenseHYCU(serviceName);
  const { data: serviceDetails, isLoading } = useServiceDetails({
    resourceName: serviceName,
  });

  return (
    <DashboardTile
      title={t('hycu_dashboard_generals_informations_title')}
      items={[
        {
          id: 'name',
          label: t('hycu_dashboard_label_name'),
          value: isLoading ? (
            <OsdsSkeleton />
          ) : (
            <div className="flex items-center space-between gap-x-2">
              <Description className="grow">
                {serviceDetails?.data.resource.displayName}
              </Description>

              <OsdsButton
                circle
                variant={ODS_BUTTON_VARIANT.stroked}
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_BUTTON_SIZE.sm}
              >
                <OsdsIcon
                  aria-label="edit"
                  name={ODS_ICON_NAME.PEN}
                  size={ODS_ICON_SIZE.xs}
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
              </OsdsButton>
            </div>
          ),
        },
        {
          id: 'status',
          label: t('hycu_dashboard_label_status'),
          value: isLoading ? (
            <OsdsSkeleton />
          ) : (
            <OsdsChip
              color={getStatusColor(hycuDetail?.data.licenseStatus)}
              size={ODS_CHIP_SIZE.sm}
              inline
            >
              {tCommon([
                `hycu_status_${hycuDetail?.data.licenseStatus}`,
                'hycu_status_error',
              ])}
            </OsdsChip>
          ),
        },
        {
          id: 'pack_type',
          label: t('hycu_dashboard_label_pack_type'),
          value: isLoading ? (
            <OsdsSkeleton />
          ) : (
            <Description>
              {serviceDetails?.data.resource.product.description}
            </Description>
          ),
        },
        {
          id: 'controller_id',
          label: t('hycu_dashboard_label_controller_id'),
          value: ControllerIdHycuLicense({ serviceName }),
        },
        {
          id: 'license_key',
          label: t('hycu_dashboard_label_license_key'),
          value: isLoading ? (
            <OsdsSkeleton />
          ) : (
            <DownloadHycuLicense
              serviceName={serviceName}
            ></DownloadHycuLicense>
          ),
        },
      ]}
    ></DashboardTile>
  );
};

export default GeneralInformationsTile;
