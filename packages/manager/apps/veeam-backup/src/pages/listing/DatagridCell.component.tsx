import React from 'react';
import {
  OsdsChip,
  OsdsLink,
  OsdsSkeleton,
} from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import {
  ActionMenu,
  DataGridTextCell,
  DateFormat,
  Description,
  LinkType,
  Links,
  Region,
  useFormattedDate,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  VeeamBackupWithIam,
  getOrganizationDisplayName,
  getOrganizationIdFromBackupId,
  useOrganization,
  ResourceStatus,
  getVeeamBackupDisplayName,
} from '@/data';
import { iamActions, vcdOrganizationAppName } from '@/veeam-backup.config';
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
  className,
}: VeeamBackupWithIam & { className?: string }): JSX.Element => {
  const { t } = useTranslation('veeam-backup');
  return (
    <OsdsChip
      className={className}
      inline
      color={colorByStatus[resourceStatus]}
    >
      {t(resourceStatus)}
    </OsdsChip>
  );
};

export const OvhRefCell = ({ id }: VeeamBackupWithIam) => (
  <DataGridTextCell>{id}</DataGridTextCell>
);

export const OrganizationCell = ({
  id,
  withLink,
  className,
}: VeeamBackupWithIam & {
  className?: string;
  withLink?: boolean;
}): JSX.Element => {
  const organizationId = getOrganizationIdFromBackupId(id);
  const { isLoading, data } = useOrganization(organizationId);
  const { shell } = React.useContext(ShellContext);
  const [href, setHref] = React.useState('');

  const value = getOrganizationDisplayName(data?.data);

  React.useEffect(() => {
    if (withLink) {
      shell.navigation
        .getURL(vcdOrganizationAppName, `/${organizationId}`, {})
        .then((url: string) => setHref(url));
    }
  }, []);

  if (isLoading || (withLink && !href)) {
    return <OsdsSkeleton />;
  }
  return withLink ? (
    <Links
      className={className}
      href={href}
      type={LinkType.next}
      label={value}
    />
  ) : (
    <DataGridTextCell>{value}</DataGridTextCell>
  );
};

export const RegionCell = ({
  currentState,
}: VeeamBackupWithIam): JSX.Element => (
  <DataGridTextCell>
    <Region mode="region" name={currentState.region.toLowerCase()} />
  </DataGridTextCell>
);

export const CreatedAtCell = ({
  createdAt,
}: VeeamBackupWithIam): JSX.Element => {
  const date = useFormattedDate({
    dateString: createdAt,
    format: DateFormat.compact,
  });
  return <DataGridTextCell>{date}</DataGridTextCell>;
};

export const ActionCell = (backup: VeeamBackupWithIam): JSX.Element => {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();
  return (
    <ActionMenu
      icon={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      items={[
        {
          id: 0,
          label: t('edit_name_action'),
          color: ODS_THEME_COLOR_INTENT.primary,
          urn: backup.iam.urn,
          iamActions: [iamActions.iamResourceEdit],
          onClick: () =>
            navigate(urls.editVeeamDisplayName.replace(':id', backup.id)),
        },
        {
          id: 1,
          label: t('delete_action'),
          color: ODS_THEME_COLOR_INTENT.error,
          urn: backup.iam.urn,
          iamActions: [iamActions.terminateService],
          onClick: () => navigate(urls.deleteVeeam.replace(':id', backup.id)),
        },
      ]}
    />
  );
};
