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
  DomainBreadcrumbItem,
  RootBreadcrumbItem,
} from '@secret-manager/components/breadcrumb';
import { useSecretList } from '@secret-manager/data/hooks/useSecretList';
import { RegionSelector } from '@secret-manager/components/regionSelector/RegionSelector.component';
import { useBackToDomainListUrl } from '@secret-manager/hooks/useBackToDomainListUrl';
import { SecretManagerChangelogButton } from '@secret-manager/components/secretManagerChangelogButton/SecretManagerChangelogButton.component';
import {
  DatagridAction,
  DatagridCellPath,
  DatagridCellVersion,
  DatagridCreationDate,
} from './ListingCells.component';
import { isErrorResponse } from '@/utils/api/api';
import { PATH_LABEL } from '@/constants';

export default function SecretListingPage() {
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const { t } = useTranslation(['secret-manager', NAMESPACES.DASHBOARD]);
  const { domainId } = useParams<LocationPathParams>();

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
  } = useSecretList({ domainId });

  const domainListUrl = useBackToDomainListUrl();

  if (error)
    return (
      <ErrorBanner
        error={isErrorResponse(error) ? error.response : {}}
        onRedirectHome={() =>
          navigate(SECRET_MANAGER_ROUTES_URLS.secretManagerOnboarding)
        }
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
          <DomainBreadcrumbItem />
        </OdsBreadcrumb>
      }
      message={notifications.length > 0 && <Notifications />}
      onClickReturn={() => navigate(domainListUrl)}
      // if domainListUrl is not defined, we do not display the back link label
      backLinkLabel={domainListUrl ? t('back_to_domain_list') : null}
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
                  pathname: SECRET_MANAGER_ROUTES_URLS.secretCreate,
                  search: `?${SECRET_MANAGER_SEARCH_PARAMS.domainId}=${domainId}`,
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
