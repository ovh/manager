import { Suspense } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { OkmsBreadcrumbItem, RootBreadcrumbItem } from '@secret-manager/components/breadcrumb';
import { SecretManagerGuidesButton } from '@secret-manager/components/guides/SecretManagerGuideButton';
import { RegionSelector } from '@secret-manager/components/region-selector/RegionSelector.component';
import { SecretManagerChangelogButton } from '@secret-manager/components/secret-manager-changelog-button/SecretManagerChangelogButton.component';
import { useSecretList } from '@secret-manager/data/hooks/useSecretList';
import { useBackToOkmsListUrl } from '@secret-manager/hooks/useBackToOkmsListUrl';
import {
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_SEARCH_PARAMS,
} from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { OdsBreadcrumb, OdsButton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  BaseLayout,
  Datagrid,
  DatagridColumn,
  ErrorBanner,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { isErrorResponse } from '@/common/utils/api/api';
import { PATH_LABEL } from '@/constants';

import {
  DatagridAction,
  DatagridCellPath,
  DatagridCellVersion,
  DatagridCreationDate,
} from './ListingCells.component';

export default function SecretListPage() {
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const { t } = useTranslation(['secret-manager', NAMESPACES.DASHBOARD]);
  const { okmsId } = useRequiredParams('okmsId');
  const { trackClick } = useOkmsTracking();

  const okmsListUrl = useBackToOkmsListUrl();

  return (
    <BaseLayout
      header={{
        title: t('secret_manager'),
        changelogButton: <SecretManagerChangelogButton />,
        headerButton: <SecretManagerGuidesButton />,
      }}
      breadcrumb={
        <OdsBreadcrumb>
          <RootBreadcrumbItem />
          <OkmsBreadcrumbItem />
        </OdsBreadcrumb>
      }
      message={notifications.length > 0 ? <Notifications /> : undefined}
      onClickReturn={() => {
        if (okmsListUrl) {
          navigate(okmsListUrl);
        }
      }}
      // if okmsListUrl is not defined, we do not display the back link label
      backLinkLabel={okmsListUrl ? t('back_to_okms_list') : ''}
    >
      <div className="space-y-6">
        <div className="flex justify-between">
          <RegionSelector />
          <OdsButton
            label={t('okms_manage_label')}
            variant="outline"
            onClick={() => {
              navigate(SECRET_MANAGER_ROUTES_URLS.okmsDashboard(okmsId));
              trackClick({
                location: PageLocation.page,
                buttonType: ButtonType.button,
                actionType: 'navigation',
                actions: ['okms'],
              });
            }}
          />
        </div>
        <SecretDatagrid okmsId={okmsId} />
      </div>
      <Suspense>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}

const SecretDatagrid = ({ okmsId }: { okmsId: string }) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.DASHBOARD]);
  const navigate = useNavigate();

  const { trackClick } = useOkmsTracking();

  const { data, error, hasNextPage, fetchNextPage, sorting, isPending, setSorting, refetch } =
    useSecretList({ okmsId });

  if (error)
    return (
      <ErrorBanner
        error={isErrorResponse(error) ? error.response : {}}
        onRedirectHome={() => navigate(SECRET_MANAGER_ROUTES_URLS.onboarding)}
        onReloadPage={refetch}
      />
    );

  const secrets = data?.pages.flatMap((page) => page.data);

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
  return (
    <Datagrid
      columns={columns}
      items={secrets || []}
      totalItems={secrets?.length ?? 0}
      isLoading={isPending}
      hasNextPage={hasNextPage}
      onFetchNextPage={fetchNextPage}
      sorting={sorting}
      onSortChange={setSorting}
      contentAlignLeft
      topbar={
        <OdsButton
          label={t('create_a_secret')}
          onClick={() => {
            navigate({
              pathname: SECRET_MANAGER_ROUTES_URLS.createSecret,
              search: `?${SECRET_MANAGER_SEARCH_PARAMS.okmsId}=${okmsId}`,
            });
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: ['create', 'secret'],
            });
          }}
        />
      }
    />
  );
};
