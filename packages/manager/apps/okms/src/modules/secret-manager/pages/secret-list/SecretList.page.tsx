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

import { Breadcrumb } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';
import { BaseLayout, BaseLayoutProps, Button, Error, Notifications } from '@ovh-ux/muk';

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

  // if okmsListUrl is not defined, we do not display the back link label
  const backLink: BaseLayoutProps['backLink'] = okmsListUrl
    ? {
        label: t('back_to_okms_list'),
        onClick: () => {
          navigate(okmsListUrl);
        },
      }
    : undefined;

  return (
    <BaseLayout
      header={{
        title: t('secret_manager'),
        changelogButton: <SecretManagerChangelogButton />,
        guideMenu: <SecretManagerGuidesButton />,
      }}
      breadcrumb={
        <Breadcrumb>
          <RootBreadcrumbItem />
          <OkmsBreadcrumbItem />
        </Breadcrumb>
      }
      message={notifications.length > 0 ? <Notifications /> : undefined}
      backLink={backLink}
    >
      <div className="space-y-6">
        <div className="flex justify-between">
          <RegionSelector />
          <Button
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
          >
            {t('okms_manage_label')}
          </Button>
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

  const {
    flattenData: secrets,
    error,
    hasNextPage,
    fetchNextPage,
    isLoading,
  } = useSecretList({ okmsId });

  if (error)
    return (
      <Error
        error={isErrorResponse(error) ? error.response : {}}
        onRedirectHome={() => navigate(SECRET_MANAGER_ROUTES_URLS.onboarding)}
      />
    );

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
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      onFetchNextPage={fetchNextPage}
      contentAlignLeft
      topbar={
        <Button
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
        >
          {t('create_a_secret')}
        </Button>
      }
    />
  );
};
