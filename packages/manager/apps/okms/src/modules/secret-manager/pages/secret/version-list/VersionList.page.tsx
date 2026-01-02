import { Suspense } from 'react';

import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';

import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { useSecretVersionList } from '@secret-manager/data/hooks/useSecretVersionList';
import { SecretPageOutletContext } from '@secret-manager/pages/secret/Secret.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret, SecretVersion } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, ErrorBanner, ManagerButton } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { isErrorResponse } from '@/common/utils/api/api';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';
import { canPerformActionsOnOkmsAndChildren } from '@/common/utils/okms/canPerformActionsOnOkmsAndChildren';

import { VersionCellAction } from './VersionCellAction.component';
import {
  VersionCreatedAtCell,
  VersionDeactivatedAtCell,
  VersionIdCell,
  VersionStateCell,
} from './VersionCells.component';

type AddVersionButtonProps = {
  okmsId: string;
  secret: Secret;
  path: string;
};

const AddVersionButton = ({ okmsId, path, secret }: AddVersionButtonProps) => {
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  const { t } = useTranslation(['secret-manager']);
  const { data: okms, isPending } = useOkmsById(okmsId);

  return (
    <ManagerButton
      id={path}
      label={t('add_new_version')}
      onClick={() => {
        navigate(
          SECRET_MANAGER_ROUTES_URLS.versionListCreateVersionDrawer(
            okmsId,
            path,
            secret.metadata.currentVersion,
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
      isDisabled={!canPerformActionsOnOkmsAndChildren(okms)}
      isLoading={isPending}
      urn={okms?.iam?.urn}
      iamActions={[kmsIamActions.secretVersionCreate]}
    />
  );
};

const VersionListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['secret-manager', NAMESPACES.STATUS, NAMESPACES.DASHBOARD]);
  const { okmsId, secretPath } = useRequiredParams('okmsId', 'secretPath');

  const { secret } = useOutletContext<SecretPageOutletContext>();
  const hasVersions = secret?.metadata?.currentVersion !== undefined;

  const { data, error, hasNextPage, fetchNextPage, sorting, isPending, setSorting, refetch } =
    useSecretVersionList({
      okmsId,
      path: decodeSecretPath(secretPath),
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
          secret,
          version,
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
        isLoading={isPending}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        sorting={sorting}
        onSortChange={setSorting}
        contentAlignLeft
        topbar={
          <AddVersionButton okmsId={okmsId} secret={secret} path={decodeSecretPath(secretPath)} />
        }
      />
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
};

export default VersionListPage;
