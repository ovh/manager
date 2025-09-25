import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import { Datagrid, ErrorBanner } from '@ovh-ux/manager-react-components';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { useSecretVersionList } from '@secret-manager/data/hooks/useSecretVersionList';
import { SecretPageOutletContext } from '@secret-manager/pages/secret/Secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import {
  VersionCreatedAtCell,
  VersionDeactivatedAtCell,
  VersionIdCell,
  VersionStateCell,
} from './VersionCells.component';
import { isErrorResponse } from '@/utils/api/api';
import { VersionCellAction } from './VersionCellAction.component';

const VersionListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation([
    'secret-manager',
    NAMESPACES.STATUS,
    NAMESPACES.DASHBOARD,
  ]);
  const { okmsId, secretPath } = useParams<LocationPathParams>();
  const secretPathDecoded = decodeSecretPath(secretPath);

  const { secret } = useOutletContext<SecretPageOutletContext>();

  const {
    data,
    error,
    hasNextPage,
    fetchNextPage,
    sorting,
    isPending,
    setSorting,
    refetch,
  } = useSecretVersionList({ okmsId, path: secretPathDecoded });

  const versions = data?.pages.flatMap((page) => page.data);

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
          secretPath: secretPathDecoded,
          version,
          urn: secret?.iam?.urn,
        }),
      label: '',
    },
  ];

  if (error)
    return (
      <ErrorBanner
        error={isErrorResponse(error) ? error.response : {}}
        onRedirectHome={() => navigate(SECRET_MANAGER_ROUTES_URLS.onboarding)}
        onReloadPage={refetch}
      />
    );

  return (
    <>
      <Datagrid
        columns={columns}
        items={versions || []}
        totalItems={versions?.length}
        isLoading={isPending}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        sorting={sorting}
        onSortChange={setSorting}
        contentAlignLeft
        topbar={
          <OdsButton
            label={t('add_new_version')}
            onClick={() =>
              navigate(
                SECRET_MANAGER_ROUTES_URLS.versionListCreateVersionDrawer(
                  okmsId,
                  secretPathDecoded,
                ),
              )
            }
            icon={'plus'}
          />
        }
      />
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
};

export default VersionListPage;
