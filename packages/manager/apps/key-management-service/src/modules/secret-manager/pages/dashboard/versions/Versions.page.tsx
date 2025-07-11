import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Datagrid, ErrorBanner } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useSecretVersions } from '@secret-manager/data/hooks/useSecretVersions';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { SecretDashboardPageParams } from '../dashboard.type';
import {
  VersionCellCreatedAt,
  VersionCellDeactivatedAt,
  VersionCellID,
  VersionCellState,
} from './VersionCells.component';

const SecretVersionsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation([
    'secret-manager/common',
    NAMESPACES.STATUS,
    NAMESPACES.DASHBOARD,
  ]);
  const { domainId, secretPath } = useParams<SecretDashboardPageParams>();
  const secretPathDecoded = decodeSecretPath(secretPath);

  const { data: versions, isPending, error, refetch } = useSecretVersions(
    domainId,
    secretPathDecoded,
  );

  const columns = [
    {
      id: 'version',
      cell: VersionCellID,
      label: t('version'),
    },
    {
      id: 'state',
      cell: VersionCellState,
      label: t('status', { ns: NAMESPACES.STATUS }),
    },
    {
      id: 'createdAt',
      cell: VersionCellCreatedAt,

      label: t('creation_date', { ns: NAMESPACES.DASHBOARD }),
    },
    {
      id: 'deactivatedAt',
      cell: VersionCellDeactivatedAt,
      label: t('expiration_date'),
    },
  ];

  if (error)
    return (
      <ErrorBanner
        error={error}
        onRedirectHome={() =>
          navigate(SECRET_MANAGER_ROUTES_URLS.secretManagerOnboarding)
        }
        onReloadPage={refetch}
      />
    );

  return (
    <Datagrid
      columns={columns}
      items={versions || []}
      totalItems={versions?.length}
      isLoading={isPending}
      contentAlignLeft
    />
  );
};

export default SecretVersionsPage;
