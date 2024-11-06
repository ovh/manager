import React from 'react';
import { OsdsLink, OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import {
  ActionMenu,
  DataGridTextCell,
  DateFormat,
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
  getOrganizationIdFromBackup,
  useOrganization,
  getVeeamBackupDisplayName,
  getRegionNameFromAzName,
} from '@ovh-ux/manager-module-vcd-api';
import { vcdOrganizationAppName } from '@/veeam-backup.config';
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

export const OvhRefCell = ({ id }: VeeamBackupWithIam) => (
  <DataGridTextCell>{id}</DataGridTextCell>
);

export const OrganizationCell = ({
  withLink,
  className,
  ...backup
}: VeeamBackupWithIam & {
  className?: string;
  withLink?: boolean;
}): JSX.Element => {
  const organizationId = getOrganizationIdFromBackup(backup);
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
    {getRegionNameFromAzName(currentState.azName)}
  </DataGridTextCell>
);

export const LocationCell = ({
  currentState,
}: VeeamBackupWithIam): JSX.Element => (
  <DataGridTextCell>
    <Region mode="region" name={getRegionNameFromAzName(currentState.azName)} />
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
          id: 1,
          label: t('delete_action'),
          color: ODS_THEME_COLOR_INTENT.error,
          disabled: backup.resourceStatus !== 'READY' || undefined,
          urn: backup.iam.urn,
          // Not implemented yet in IAM
          iamActions: [
            /* iamActions.terminateService */
          ],
          onClick: () => navigate(urls.deleteVeeam.replace(':id', backup.id)),
        },
      ]}
    />
  );
};
