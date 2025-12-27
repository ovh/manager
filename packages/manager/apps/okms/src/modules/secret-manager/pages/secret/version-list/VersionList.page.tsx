import { Suspense } from 'react';

import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';

import { useSecretVersionList } from '@secret-manager/data/hooks/useSecretVersionList';
import { SecretPageOutletContext } from '@secret-manager/pages/secret/Secret.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { OdsButton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, ErrorBanner } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { isErrorResponse } from '@/common/utils/api/api';

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
  const secretPathDecoded = decodeSecretPath(secretPath);
  const { trackClick } = useOkmsTracking();

  const { secret } = useOutletContext<SecretPageOutletContext>();
  const hasVersions = secret?.metadata?.currentVersion !== undefined;

  const { data, error, hasNextPage, fetchNextPage, sorting, isFetching, setSorting, refetch } =
    useSecretVersionList({
      okmsId,
      path: secretPathDecoded,
      // If the secret has no versions, don't fetch them to avoid a 500 error
      // TODO: Remove this once the API is fixed
      enabled: hasVersions,
    });

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
        totalItems={versions?.length ?? 0}
        isLoading={isFetching}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        sorting={sorting}
        onSortChange={setSorting}
        contentAlignLeft
        topbar={
          <OdsButton
            label={t('add_new_version')}
            onClick={() => {
              navigate(
                SECRET_MANAGER_ROUTES_URLS.versionListCreateVersionDrawer(
                  okmsId,
                  secretPathDecoded,
                ),
              );
              trackClick({
                location: PageLocation.page,
                buttonType: ButtonType.button,
                actionType: 'navigation',
                actions: ['create', 'version'],
              });
            }}
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
