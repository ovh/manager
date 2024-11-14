import { OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  DashboardTile,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigate } from 'react-router-dom';
import { useDetailsLicenseHYCU } from '@/hooks/api/license';
import { LicenseStatus } from '@/types/hycu.details.interface';
import { subRoutes, urls } from '@/routes/routes.constant';
import {
  ManagerLink,
  ManagerLinkProps,
} from '@/components/ManagerLink/ManagerLink.component';
import { IAM_ACTIONS } from '@/utils/iam.constants';
import { HYCU_CHANGE_PACK_FEATURE_ACTIVATED } from '@/constants';

const ShortcutsItem = ({ children, ...rest }: ManagerLinkProps) => (
  <ManagerLink color={ODS_THEME_COLOR_INTENT.primary} {...rest}>
    <div className="flex items-center">
      <div>{children}</div>
      <OsdsIcon
        name={ODS_ICON_NAME.CHEVRON_RIGHT}
        color={ODS_THEME_COLOR_INTENT.primary}
      ></OsdsIcon>
    </div>
  </ManagerLink>
);

const ShortcutsTile = ({ serviceName }: { serviceName: string }) => {
  const navigate = useNavigate();
  const { data: hycuDetail } = useDetailsLicenseHYCU(serviceName);
  const { data: serviceDetails } = useServiceDetails({
    resourceName: serviceName,
  });
  const { t } = useTranslation('hycu/dashboard');

  const isServiceSuspended = useMemo(
    () => serviceDetails?.data.resource.state === 'suspended',
    [serviceDetails],
  );

  const links = useMemo(
    () => ({
      linkActivated: {
        id: 'link_activated',
        value: (
          <ShortcutsItem
            disabled={isServiceSuspended}
            iamActions={[IAM_ACTIONS.licenseHycuApiOvhActivate]}
            urn={hycuDetail?.data?.iam?.urn}
            data-testid="hycu_link_activated_test_id"
            onClick={() => {
              navigate(
                urls.activateLicense.replace(
                  subRoutes.serviceName,
                  serviceName,
                ),
              );
            }}
          >
            {t('hycu_dashboard_link_activate')}
          </ShortcutsItem>
        ),
      },
      linkReactivated: {
        id: 'link_regenerate',
        value: (
          <ShortcutsItem
            disabled={isServiceSuspended}
            iamActions={[IAM_ACTIONS.licenseHycuApiOvhRefresh]}
            urn={hycuDetail?.data?.iam?.urn}
            data-testid="hycu_link_regenerate_test_id"
            onClick={() => {
              navigate(
                urls.regenerateLicense.replace(
                  subRoutes.serviceName,
                  serviceName,
                ),
              );
            }}
          >
            {t('hycu_dashboard_link_regenerate')}
          </ShortcutsItem>
        ),
      },
      linkChangePackType: {
        id: 'link_change_pack_type',
        value: (
          <ShortcutsItem
            disabled={isServiceSuspended}
            iamActions={[IAM_ACTIONS.licenseHycuApiOvhEdit]}
            urn={hycuDetail?.data?.iam?.urn}
            data-testid="hycu_link_edit_test_id"
            onClick={() => {
              navigate(
                urls.editPack.replace(subRoutes.serviceName, serviceName),
              );
            }}
          >
            {t('hycu_dashboard_link_change_pack_type')}
          </ShortcutsItem>
        ),
      },
    }),
    [isServiceSuspended, hycuDetail],
  );

  return (
    <DashboardTile
      title={t('hycu_dashboard_shortcuts_title')}
      items={[
        !hycuDetail?.data.controllerId
          ? links.linkActivated
          : links.linkReactivated,
        ((HYCU_CHANGE_PACK_FEATURE_ACTIVATED &&
          hycuDetail?.data.licenseStatus === LicenseStatus.ACTIVATED) ||
          undefined) &&
          links.linkChangePackType,
      ].filter(Boolean)}
    ></DashboardTile>
  );
};

export default ShortcutsTile;
