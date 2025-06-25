import React from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { BaseLayout, Datagrid } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useSecretList } from '@secret-manager/data/hooks/useSecretList';
import {
  DatagridCellPath,
  DatagridCellVersion,
  DatagridCreationDate,
} from './ListingCells.component';
import { SecretListingPageParams } from './listing.type';

export default function SecretListingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['secret-manager/common', NAMESPACES.DASHBOARD]);
  const { domainId } = useParams<SecretListingPageParams>();
  const { data: secrets, isPending } = useSecretList(domainId);

  const columns = [
    {
      id: 'path',
      cell: DatagridCellPath,
      label: t('path'),
    },
    {
      id: 'version',
      cell: DatagridCellVersion,
      label: t('version'),
    },
    {
      id: 'createdAt',
      cell: DatagridCreationDate,
      label: t('creation_date', { ns: NAMESPACES.DASHBOARD }),
    },
  ];

  return (
    <BaseLayout header={{ title: t('secret_manager') }}>
      <Datagrid
        columns={columns}
        items={secrets}
        totalItems={secrets.length}
        isLoading={isPending}
        contentAlignLeft
        topbar={
          <OdsButton
            label={t('create_secret')}
            onClick={() => navigate(SECRET_MANAGER_ROUTES_URLS.secretCreate)}
          />
        }
      />
    </BaseLayout>
  );
}
