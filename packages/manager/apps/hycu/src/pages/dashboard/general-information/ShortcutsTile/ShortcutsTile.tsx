import { Icon, ICON_NAME } from '@ovhcloud/ods-react';
import { Tile, Link, LinkProps } from '@ovh-ux/muk';
import {
  useFeatureAvailability,
  useServiceDetails,
} from '@ovh-ux/manager-module-common-api';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { useDetailsLicenseHYCU } from '@/hooks/api/license';
import { LicenseStatus } from '@/types/hycu.details.interface';
import { subRoutes, urls } from '@/routes/routes.constant';
import { IAM_ACTIONS } from '@/utils/iam.constants';
import { HYCU_CHANGE_PACK_FEATURE } from '@/constants';

type ShortcutItemProps = LinkProps & {
  to: string;
};

const ShortcutsItem = ({ to, children, ...rest }: ShortcutItemProps) => {
  const href = useHref(to);
  return (
    <Link href={href} {...rest}>
      <div className="flex items-center">
        <div>{children}</div>
        <Icon name={ICON_NAME.chevronRight} aria-hidden="true"></Icon>
      </div>
    </Link>
  );
};

const ShortcutsTile = ({ serviceName }: { serviceName: string }) => {
  const { data: hycuDetail } = useDetailsLicenseHYCU(serviceName);
  const { data: serviceDetails } = useServiceDetails({
    resourceName: serviceName,
  });
  const { t } = useTranslation('hycu/dashboard');
  const { data: changePackFeature } = useFeatureAvailability([
    HYCU_CHANGE_PACK_FEATURE,
  ]);

  const isServiceSuspended = useMemo(
    () => serviceDetails?.data.resource.state === 'suspended',
    [serviceDetails],
  );

  const isLicencePending = useMemo(
    () => hycuDetail?.data?.licenseStatus === LicenseStatus.PENDING,
    [hycuDetail],
  );

  return (
    <Tile.Root title={t('hycu_dashboard_shortcuts_title')}>
      <Tile.Item.Root>
        <Tile.Item.Description>
          {!hycuDetail?.data.controllerId ? (
            <ShortcutsItem
              disabled={isServiceSuspended || isLicencePending}
              iamActions={[IAM_ACTIONS.licenseHycuApiOvhActivate]}
              urn={hycuDetail?.data?.iam?.urn}
              data-testid="hycu_link_activated_test_id"
              to={urls.activateLicense.replace(
                subRoutes.serviceName,
                serviceName,
              )}
            >
              {t('hycu_dashboard_link_activate')}
            </ShortcutsItem>
          ) : (
            <ShortcutsItem
              disabled={isServiceSuspended || isLicencePending}
              iamActions={[IAM_ACTIONS.licenseHycuApiOvhRefresh]}
              urn={hycuDetail?.data?.iam?.urn}
              data-testid="hycu_link_regenerate_test_id"
              to={urls.regenerateLicense.replace(
                subRoutes.serviceName,
                serviceName,
              )}
            >
              {t('hycu_dashboard_link_regenerate')}
            </ShortcutsItem>
          )}
        </Tile.Item.Description>
      </Tile.Item.Root>
      {changePackFeature?.[HYCU_CHANGE_PACK_FEATURE] &&
        hycuDetail?.data.licenseStatus === LicenseStatus.ACTIVATED && (
          <Tile.Item.Root>
            <Tile.Item.Description divider={false}>
              <ShortcutsItem
                disabled={isServiceSuspended}
                iamActions={[IAM_ACTIONS.licenseHycuApiOvhEdit]}
                urn={hycuDetail?.data?.iam?.urn}
                data-testid="hycu_link_edit_test_id"
                to={urls.editPack.replace(subRoutes.serviceName, serviceName)}
              >
                {t('hycu_dashboard_link_change_pack_type')}
              </ShortcutsItem>
            </Tile.Item.Description>
          </Tile.Item.Root>
        )}
    </Tile.Root>
  );
};

export default ShortcutsTile;
