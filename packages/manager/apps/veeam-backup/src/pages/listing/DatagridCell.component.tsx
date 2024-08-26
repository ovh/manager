import React from 'react';
import {
  OsdsChip,
  OsdsLink,
  OsdsSkeleton,
} from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import { ActionMenu, DataGridTextCell } from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import { ovhLocaleToI18next } from '@ovh-ux/manager-react-shell-client';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  VeeamBackupWithIam,
  getOrganizationDisplayName,
  getOrganizationIdFromBackupId,
  useOrganization,
  ResourceStatus,
  useRegions,
  getVeeamBackupDisplayName,
} from '@/data';
import { iamActions } from '@/veeam-backup.config';
import { urls } from '@/routes/routes.constant';

export const DisplayNameCell = (backup: VeeamBackupWithIam): JSX.Element => {
  const navigate = useNavigate();
  return (
    <DataGridTextCell>
      <OsdsLink
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => navigate(urls.dashboard.replace(':id', backup.id))}
      >
        {getVeeamBackupDisplayName(backup)}
      </OsdsLink>
    </DataGridTextCell>
  );
};

const colorByStatus: { [s in ResourceStatus]: ODS_THEME_COLOR_INTENT } = {
  READY: ODS_THEME_COLOR_INTENT.success,
  CREATING: ODS_THEME_COLOR_INTENT.info,
  DISABLED: ODS_THEME_COLOR_INTENT.default,
  DISABLING: ODS_THEME_COLOR_INTENT.default,
  REMOVED: ODS_THEME_COLOR_INTENT.error,
  UPDATING: ODS_THEME_COLOR_INTENT.info,
};

export const StatusCell = ({
  resourceStatus,
}: VeeamBackupWithIam): JSX.Element => {
  const { t } = useTranslation('veeam-backup');
  return (
    <OsdsChip inline color={colorByStatus[resourceStatus]}>
      {t(resourceStatus)}
    </OsdsChip>
  );
};

export const OvhRefCell = ({ id }: VeeamBackupWithIam) => (
  <DataGridTextCell>{id}</DataGridTextCell>
);

export const OrganizationCell = ({ id }: VeeamBackupWithIam): JSX.Element => {
  const organizationId = getOrganizationIdFromBackupId(id);
  const { isLoading, data } = useOrganization(organizationId);

  return isLoading ? (
    <OsdsSkeleton />
  ) : (
    <DataGridTextCell>{getOrganizationDisplayName(data.data)}</DataGridTextCell>
  );
};

export const RegionCell = (backup: VeeamBackupWithIam): JSX.Element => {
  const { flattenData, isLoading } = useRegions();
  return isLoading ? (
    <OsdsSkeleton />
  ) : (
    <DataGridTextCell>
      {
        flattenData?.find((r) => r.region === backup.currentState.region)
          ?.location
      }
    </DataGridTextCell>
  );
};

export const CreatedAtCell = ({
  createdAt,
}: VeeamBackupWithIam): JSX.Element => {
  const { i18n } = useTranslation('veeam-backup');
  const date = new Date(createdAt);
  return (
    <DataGridTextCell>
      {date.toString() !== 'Invalid Date'
        ? date.toLocaleDateString(ovhLocaleToI18next(i18n.language))
        : '-'}
    </DataGridTextCell>
  );
};

export const ActionCell = (backup: VeeamBackupWithIam): JSX.Element => {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();
  return (
    <ActionMenu
      icon={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
      isCompact
      items={[
        {
          id: 0,
          label: t('delete_action'),
          color: ODS_THEME_COLOR_INTENT.error,
          urn: backup.iam.urn,
          iamActions: [iamActions.vmwareCloudDirectorBackupGet],
          onClick: () => navigate(urls.deleteVeeam.replace(':id', backup.id)),
        },
      ]}
    />
  );
};
