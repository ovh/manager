import React from 'react';
import {
  DataGridTextCell,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import { useParams } from 'react-router-dom';
import { Secret } from '@secret-manager/types/secret.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Link } from '@/common/components/Link/Link.component';
import { SecretListingPageParams } from './listing.type';

export const DatagridCellPath = (secret: Secret) => {
  const { domainId } = useParams<SecretListingPageParams>();
  const url = SECRET_MANAGER_ROUTES_URLS.secretDashboard(domainId, secret.path);

  return <Link href={url} label={secret.path} isRouterLink />;
};

export const DatagridCellVersion = (secret: Secret) => {
  return <DataGridTextCell>{secret.version.id}</DataGridTextCell>;
};

export const DatagridCreationDate = (secret: Secret) => {
  const formatDate = useFormatDate();
  return (
    <DataGridTextCell>
      {formatDate({
        date: secret.metadata.createdAt,
        format: 'Pp',
      })}
    </DataGridTextCell>
  );
};
