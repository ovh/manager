import { Suspense } from 'react';

import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';

import { useSecretVersionList } from '@secret-manager/data/hooks/useSecretVersionList';
import { SecretPageOutletContext } from '@secret-manager/pages/secret/Secret.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { Error } from '@ovh-ux/muk';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { isErrorResponse } from '@/common/utils/api/api';

import { AddVersionButton } from './AddVersionButton.component';
import { VersionCellAction } from './VersionCellAction.component';
import {
  VersionCreatedAtCell,
  VersionDeactivatedAtCell,
  VersionIdCell,
  VersionStateCell,
} from './VersionCells.component';

const VersionListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['secret-manager', NAMESPACES.STATUS, NAMESPACES.DASHBOARD]);
  const { okmsId, secretPath } = useRequiredParams('okmsId', 'secretPath');

  const { secret } = useOutletContext<SecretPageOutletContext>();

  const {
    flattenData: versions,
    error,
    hasNextPage,
    fetchNextPage,
    isLoading,
  } = useSecretVersionList({
    okmsId,
    path: decodeSecretPath(secretPath),
  });

  const columns = [
    {
      id: 'version',
      cell: (version: SecretVersion) => VersionIdCell({ version, secret }),
      label: t('version'),
    },
    {
      id: 'state',
      cell: VersionStateCell,
      label: t('status', { ns: NAMESPACES.STATUS }),
    },
    {
      id: 'createdAt',
      cell: VersionCreatedAtCell,

      label: t('creation_date', { ns: NAMESPACES.DASHBOARD }),
    },
    {
      id: 'deactivatedAt',
      cell: VersionDeactivatedAtCell,
      label: t('expiration_date'),
    },
    {
      id: 'actions',
      cell: (version: SecretVersion) =>
        VersionCellAction({
          okmsId,
          secret,
          version,
        }),
      label: '',
    },
  ];

  if (error)
    return (
      <Error
        error={isErrorResponse(error) ? error.response : {}}
        onRedirectHome={() => navigate(SECRET_MANAGER_ROUTES_URLS.onboarding)}
      />
    );

  return (
    <>
      <Datagrid
        columns={columns}
        items={versions || []}
        totalItems={versions?.length ?? 0}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        contentAlignLeft
        topbar={<AddVersionButton okmsId={okmsId} secret={secret} />}
      />
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
};

export default VersionListPage;
