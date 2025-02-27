import React from 'react';
import { OdsLink, OdsSkeleton } from '@ovhcloud/ods-components/react';
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
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  VeeamBackup,
  getOrganizationDisplayName,
  getOrganizationIdFromBackup,
  useOrganization,
  getVeeamBackupDisplayName,
  getRegionNameFromAzName,
} from '@ovh-ux/manager-module-vcd-api';
import { vcdOrganizationAppName } from '@/veeam-backup.config';
import { urls } from '@/routes/routes.constant';
import TEST_IDS from '@/utils/testIds.constants';

export const DisplayNameCell = (backup: VeeamBackup): JSX.Element => {
  const navigate = useNavigate();
  return (
    <DataGridTextCell>
      <OdsLink
        label={getVeeamBackupDisplayName(backup)}
        onClick={() => navigate(urls.dashboard.replace(':id', backup.id))}
        href={undefined}
        data-testid={TEST_IDS.listingBackupLink}
      />
    </DataGridTextCell>
  );
};

export const OvhRefCell = ({ id }: VeeamBackup) => (
  <DataGridTextCell>{id}</DataGridTextCell>
);

export const OrganizationCell = ({
  withLink,
  className,
  ...backup
}: VeeamBackup & {
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
    return <OdsSkeleton />;
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

export const RegionCell = ({ currentState }: VeeamBackup): JSX.Element => (
  <DataGridTextCell>
    {getRegionNameFromAzName(currentState.azName)}
  </DataGridTextCell>
);

export const LocationCell = ({ currentState }: VeeamBackup): JSX.Element => (
  <DataGridTextCell>
    <Region mode="region" name={getRegionNameFromAzName(currentState.azName)} />
  </DataGridTextCell>
);

export const CreatedAtCell = ({ createdAt }: VeeamBackup): JSX.Element => {
  const date = useFormattedDate({
    dateString: createdAt,
    format: DateFormat.compact,
  });
  return <DataGridTextCell>{date}</DataGridTextCell>;
};

export const ActionCell = (backup: VeeamBackup): JSX.Element => {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();

  return (
    <ActionMenu
      id={`backup_menu_${backup.id}`}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      items={[
        {
          id: 1,
          label: t('delete_action'),
          color: ODS_BUTTON_COLOR.critical,
          isDisabled: backup.resourceStatus !== 'READY',
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
