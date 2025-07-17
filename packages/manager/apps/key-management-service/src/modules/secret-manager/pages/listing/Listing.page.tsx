import React from 'react';
import {
  BaseLayout,
  Datagrid,
  DatagridColumn,
  ErrorBanner,
} from '@ovh-ux/manager-react-components';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_SEARCH_PARAMS,
} from '@secret-manager/routes/routes.constants';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useSecretList } from '@secret-manager/data/hooks/useSecretList';
import { Secret } from '@secret-manager/types/secret.type';
import {
  DatagridAction,
  DatagridCellPath,
  DatagridCellVersion,
  DatagridCreationDate,
} from './ListingCells.component';
import { SecretListingPageParams } from './listing.type';

export default function SecretListingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['secret-manager/common', NAMESPACES.DASHBOARD]);
  const { domainId } = useParams<SecretListingPageParams>();
  const { data: secrets, isPending, error, refetch } = useSecretList(domainId);

  const columns: DatagridColumn<Secret>[] = [
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
    {
      id: 'actions',
      cell: DatagridAction,
      label: '',
    },
  ];

  if (error)
    return (
      <ErrorBanner
        error={error.response}
        onRedirectHome={() =>
          navigate(SECRET_MANAGER_ROUTES_URLS.secretManagerOnboarding)
        }
        onReloadPage={refetch}
      />
    );

  return (
    <BaseLayout header={{ title: t('secret_manager') }}>
      <Datagrid
        columns={columns}
        items={secrets || []}
        totalItems={secrets?.length}
        isLoading={isPending}
        contentAlignLeft
        topbar={
          <OdsButton
            label={t('create_secret')}
            onClick={() =>
              navigate({
                pathname: SECRET_MANAGER_ROUTES_URLS.secretCreate,
                search: `?${SECRET_MANAGER_SEARCH_PARAMS.domainId}=${domainId}`,
              })
            }
          />
        }
      />
    </BaseLayout>
  );
}
