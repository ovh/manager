import React, { Suspense } from 'react';
import {
  BaseLayout,
  Datagrid,
  DatagridColumn,
  ErrorBanner,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { OdsBreadcrumb, OdsButton } from '@ovhcloud/ods-components/react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_SEARCH_PARAMS,
} from '@secret-manager/routes/routes.constants';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Secret } from '@secret-manager/types/secret.type';
import {
  OkmsBreadcrumbItem,
  RootBreadcrumbItem,
} from '@secret-manager/components/breadcrumb';
import { useSecretList } from '@secret-manager/data/hooks/useSecretList';
import { RegionSelector } from '@secret-manager/components/regionSelector/RegionSelector.component';
import { SecretManagerChangelogButton } from '@secret-manager/components/secretManagerChangelogButton/SecretManagerChangelogButton.component';
import { useBackToOkmsListUrl } from '@secret-manager/hooks/useBackToOkmsListUrl';
import {
  DatagridAction,
  DatagridCellPath,
  DatagridCellVersion,
  DatagridCreationDate,
} from './ListingCells.component';
import { isErrorResponse } from '@/utils/api/api';
import { PATH_LABEL } from '@/constants';

export default function SecretListPage() {
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const { t } = useTranslation(['secret-manager', NAMESPACES.DASHBOARD]);
  const { okmsId } = useParams<LocationPathParams>();

  const columns: DatagridColumn<Secret>[] = [
    {
      id: 'path',
      cell: DatagridCellPath,
      label: PATH_LABEL,
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

  const {
    data,
    error,
    hasNextPage,
    fetchNextPage,
    sorting,
    isPending,
    setSorting,
    refetch,
  } = useSecretList({ okmsId });

  const okmsListUrl = useBackToOkmsListUrl();

  if (error)
    return (
      <ErrorBanner
        error={isErrorResponse(error) ? error.response : {}}
        onRedirectHome={() => navigate(SECRET_MANAGER_ROUTES_URLS.onboarding)}
        onReloadPage={refetch}
      />
    );

  const secrets = data?.pages.flatMap((page) => page.data);

  return (
    <BaseLayout
      header={{
        title: t('secret_manager'),
        changelogButton: <SecretManagerChangelogButton />,
      }}
      breadcrumb={
        <OdsBreadcrumb>
          <RootBreadcrumbItem />
          <OkmsBreadcrumbItem />
        </OdsBreadcrumb>
      }
      message={notifications.length > 0 && <Notifications />}
      onClickReturn={() => navigate(okmsListUrl)}
      // if okmsListUrl is not defined, we do not display the back link label
      backLinkLabel={okmsListUrl ? t('back_to_okms_list') : null}
    >
      <div className="space-y-6">
        <RegionSelector />
        <Datagrid
          columns={columns}
          items={secrets || []}
          totalItems={secrets?.length}
          isLoading={isPending}
          hasNextPage={hasNextPage}
          onFetchNextPage={fetchNextPage}
          sorting={sorting}
          onSortChange={setSorting}
          contentAlignLeft
          topbar={
            <OdsButton
              label={t('create_a_secret')}
              onClick={() =>
                navigate({
                  pathname: SECRET_MANAGER_ROUTES_URLS.createSecret,
                  search: `?${SECRET_MANAGER_SEARCH_PARAMS.okmsId}=${okmsId}`,
                })
              }
            />
          }
        />
      </div>
      <Suspense>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}
