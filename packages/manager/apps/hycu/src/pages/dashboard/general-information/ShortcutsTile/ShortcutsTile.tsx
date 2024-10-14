import { OsdsLink, OsdsIcon } from '@ovhcloud/ods-components/react';
import { DashboardTile } from '@ovh-ux/manager-react-components';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useDetailsLicenseHYCU } from '@/hooks/api/license';
import { LicenseStatus } from '@/type/hycu.details.interface';

const ShortcutsTile = ({ serviceName }: { serviceName: string }) => {
  const { data: hycuDetail } = useDetailsLicenseHYCU(serviceName);
  const { t } = useTranslation('hycu/dashboard');

  const links = {
    linkActivated: {
      id: 'link_activated',
      value: (
        <OsdsLink color={ODS_THEME_COLOR_INTENT.primary}>
          <div className="flex items-center">
            <div>{t('hycu_dashboard_link_activate')}</div>
            <OsdsIcon
              name={ODS_ICON_NAME.CHEVRON_RIGHT}
              color={ODS_THEME_COLOR_INTENT.primary}
            ></OsdsIcon>
          </div>
        </OsdsLink>
      ),
    },
    linkReactivated: {
      id: 'link_reactivated',
      value: (
        <OsdsLink color={ODS_THEME_COLOR_INTENT.primary}>
          <div className="flex items-center">
            <div>{t('hycu_dashboard_link_reactivate')}</div>
            <OsdsIcon
              name={ODS_ICON_NAME.CHEVRON_RIGHT}
              color={ODS_THEME_COLOR_INTENT.primary}
            ></OsdsIcon>
          </div>
        </OsdsLink>
      ),
    },
    linkChangePackType: {
      id: 'link_change_pack_type',
      value: (
        <OsdsLink color={ODS_THEME_COLOR_INTENT.primary}>
          <div className="flex items-center">
            <div>{t('hycu_dashboard_link_change_pack_type')}</div>
            <OsdsIcon
              name={ODS_ICON_NAME.CHEVRON_RIGHT}
              color={ODS_THEME_COLOR_INTENT.primary}
            ></OsdsIcon>
          </div>
        </OsdsLink>
      ),
    },
  } as const;

  return (
    <DashboardTile
      title={t('hycu_dashboard_shortcuts_title')}
      items={[
        hycuDetail?.data.licenseStatus === LicenseStatus.TO_ACTIVATE &&
          links.linkActivated,
        links.linkReactivated,
        hycuDetail?.data.licenseStatus === LicenseStatus.ACTIVATED &&
          links.linkChangePackType,
      ].filter(Boolean)}
    ></DashboardTile>
  );
};

export default ShortcutsTile;
