import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  ErrorBanner,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { OdsBreadcrumb, OdsButton } from '@ovhcloud/ods-components/react';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { filterDomainsByRegion } from '@secret-manager/utils/domains';
import { RegionSelector } from '@secret-manager/components/regionSelector/RegionSelector.component';
import { RootBreadcrumbItem } from '@secret-manager/components/breadcrumb';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import { OkmsDatagrid } from '@/common/components/okmsDatagrid/OkmsDatagrid.component';
import { useOkmsDatagridList } from '@/data/hooks/useOkms';
import { isErrorResponse } from '@/utils/api/api';

export default function SecretDomainsPage() {
  const { t } = useTranslation([
    'secret-manager/domains',
    'key-management-service/create',
  ]);
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const { region } = useParams() as { region: string };

  const { data, error, isPending, refetch } = useOkmsDatagridList({
    pageSize: 100,
  });
  const flattenData = data?.pages.flatMap((page) => page.data);

  // Filter okms by regionId
  const okmsList = flattenData
    ? filterDomainsByRegion(flattenData, region)
    : [];

  // Redirections management
  useEffect(() => {
    // Wait for the data to be loaded
    if (isPending) return;

    if (okmsList.length === 0) {
      // If no okms found for the region, redirect to secret-manager root
      // This also handles the case where the region is not valid
      navigate({
        pathname: SECRET_MANAGER_ROUTES_URLS.secretManagerRoot,
      });
    } else if (okmsList.length === 1) {
      // If only one okms is found, redirect to its secrets listing page
      const okmsId = okmsList[0].id;
      navigate({
        pathname: SECRET_MANAGER_ROUTES_URLS.secretListing(okmsId),
      });
    }
  }, [isPending, okmsList.length]);

  if (error) {
    return (
      <ErrorBanner
        error={isErrorResponse(error) ? error.response : {}}
        onRedirectHome={() =>
          navigate(SECRET_MANAGER_ROUTES_URLS.secretManagerOnboarding)
        }
        onReloadPage={refetch}
      />
    );
  }

  return (
    <BaseLayout
      header={{
        title: t('secret-manager/domains:domains_list'),
      }}
      breadcrumb={
        <OdsBreadcrumb>
          <RootBreadcrumbItem />
        </OdsBreadcrumb>
      }
      message={notifications.length > 0 && <Notifications />}
    >
      <div className="space-y-6">
        <RegionSelector />
        <OkmsDatagrid
          type="secret-manager"
          isLoading={isPending}
          okmsList={okmsList}
          topbar={
            <OdsButton
              label={t(
                'key-management-service/create:key_management_service_create_title',
              )}
              onClick={() => {
                navigate(KMS_ROUTES_URLS.kmsCreate);
              }}
            />
          }
        />
      </div>
    </BaseLayout>
  );
}
