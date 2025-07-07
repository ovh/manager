import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsLink, OdsSkeleton } from '@ovhcloud/ods-components/react';
import { useHref, useNavigate } from 'react-router-dom';
import {
  ActionMenu,
  DataGridTextCell,
  LinkType,
  Links,
  Region,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  getOrganizationDisplayName,
  useOrganization,
} from '@ovh-ux/manager-module-vcd-api';
import { vcdOrganizationAppName } from '@/veeam-backup.config';
import { urls } from '@/routes/routes.constant';
import TEST_IDS from '@/utils/testIds.constants';
import { VeeamBackupDatagrid } from './Listing.page';

export const DisplayNameCell = ({
  id,
  name,
}: VeeamBackupDatagrid): JSX.Element => {
  const href = useHref(urls.dashboard.replace(':id', id));
  return (
    <DataGridTextCell>
      <OdsLink
        label={name}
        href={href}
        data-testid={TEST_IDS.listingBackupLink}
      />
    </DataGridTextCell>
  );
};

export const OvhRefCell = ({ id }: VeeamBackupDatagrid) => (
  <DataGridTextCell>{id}</DataGridTextCell>
);

export const OrganizationCell = ({
  withLink,
  className,
  organizationId,
}: Pick<VeeamBackupDatagrid, 'organizationId'> & {
  className?: string;
  withLink?: boolean;
}): JSX.Element => {
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
      href={(href as string) ?? ''}
      type={LinkType.next}
      label={value}
    />
  ) : (
    <DataGridTextCell>{value}</DataGridTextCell>
  );
};

export const RegionCell = ({ location }: VeeamBackupDatagrid): JSX.Element => (
  <DataGridTextCell>{location}</DataGridTextCell>
);

export const LocationCell = ({
  location,
}: VeeamBackupDatagrid): JSX.Element => (
  <DataGridTextCell>
    <Region mode="region" name={location} />
  </DataGridTextCell>
);

export const CreatedAtCell = ({
  createdAt,
}: VeeamBackupDatagrid): JSX.Element => {
  const formatDate = useFormatDate();
  return (
    <DataGridTextCell>
      {formatDate({ date: createdAt, format: 'P' })}
    </DataGridTextCell>
  );
};

export const ActionCell = ({
  id,
  iam,
  resourceStatus,
}: VeeamBackupDatagrid): JSX.Element => {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();

  return (
    <ActionMenu
      id={`backup_menu_${id}`}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      items={[
        {
          id: 1,
          label: t('delete_action'),
          color: ODS_BUTTON_COLOR.critical,
          isDisabled: resourceStatus !== 'READY',
          urn: iam.urn,
          // Not implemented yet in IAM
          iamActions: [
            /* iamActions.terminateService */
          ],
          onClick: () => navigate(urls.deleteVeeam.replace(':id', id)),
        },
      ]}
    />
  );
};
