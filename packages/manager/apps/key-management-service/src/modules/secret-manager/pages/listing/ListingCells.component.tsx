import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  ActionMenu,
  ActionMenuItem,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Secret } from '@secret-manager/types/secret.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Link } from '@/common/components/Link/Link.component';
import { SecretListingPageParams } from './listing.type';
import { useFormatDate } from '@/common/hooks/useFormatDate';

export const DatagridCellPath = (secret: Secret) => {
  const { domainId } = useParams<SecretListingPageParams>();
  const url = SECRET_MANAGER_ROUTES_URLS.secretDashboard(domainId, secret.path);

  return <Link href={url} label={secret.path} isRouterLink />;
};

export const DatagridCellVersion = (secret: Secret) => {
  return <DataGridTextCell>{secret.version.id}</DataGridTextCell>;
};

export const DatagridCreationDate = (secret: Secret) => {
  const { formatDate } = useFormatDate();
  return (
    <DataGridTextCell>{formatDate(secret.metadata.createdAt)}</DataGridTextCell>
  );
};

export const DatagridAction = (secret: Secret) => {
  const { domainId } = useParams<SecretListingPageParams>();
  const { t } = useTranslation('secret-manager/secrets');
  const navigate = useNavigate();

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('access_versions'),
      onClick: () => {
        navigate(
          SECRET_MANAGER_ROUTES_URLS.secretVersions(domainId, secret.path),
        );
      },
    },
  ];

  return (
    <ActionMenu
      id={`SecretActionMenu-${secret.path}`}
      items={items}
      isCompact
      icon={ODS_ICON_NAME.ellipsisVertical}
      variant={ODS_BUTTON_VARIANT.ghost}
    />
  );
};
