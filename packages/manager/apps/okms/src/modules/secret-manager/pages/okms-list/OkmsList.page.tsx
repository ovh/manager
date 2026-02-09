import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useOkmsDatagridList } from '@key-management-service/data/hooks/useOkms';
import { RootBreadcrumbItem } from '@secret-manager/components/breadcrumb';
import { SecretManagerGuidesButton } from '@secret-manager/components/guides/SecretManagerGuideButton';
import { RegionSelector } from '@secret-manager/components/region-selector/RegionSelector.component';
import { SecretManagerChangelogButton } from '@secret-manager/components/secret-manager-changelog-button/SecretManagerChangelogButton.component';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { filterOkmsListByRegion } from '@secret-manager/utils/okms';
import { useTranslation } from 'react-i18next';

import { Breadcrumb } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';
import { BaseLayout, Button, Error, Notifications } from '@ovh-ux/muk';

import { OkmsDatagrid } from '@/common/components/okms-datagrid/OkmsDatagrid.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { isErrorResponse } from '@/common/utils/api/api';

export default function OkmsListPage() {
  const { t } = useTranslation('secret-manager');
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const { region } = useRequiredParams('region');
  const { trackClick } = useOkmsTracking();

  const { flattenData, error, isLoading } = useOkmsDatagridList({
    pageSize: 100,
  });

  // Filter okms by regionId
  const okmsList = filterOkmsListByRegion(flattenData ?? [], region);

  // Redirections management
  useEffect(() => {
    // Wait for the data to be loaded
    if (isLoading) return;

    if (okmsList.length === 0) {
      // If no okms found for the region, redirect to secret-manager root
      // This also handles the case where the region is not valid
      navigate({
        pathname: SECRET_MANAGER_ROUTES_URLS.root,
      });
    } else if (okmsList.length === 1 && okmsList[0]) {
      // If only one okms is found, redirect to its secrets listing page
      const okmsId = okmsList[0].id;
      navigate({
        pathname: SECRET_MANAGER_ROUTES_URLS.secretList(okmsId),
      });
    }
  }, [isLoading, okmsList.length, navigate, okmsList]);

  if (error) {
    return (
      <Error
        error={isErrorResponse(error) ? error.response : {}}
        onRedirectHome={() => navigate(SECRET_MANAGER_ROUTES_URLS.onboarding)}
      />
    );
  }

  return (
    <BaseLayout
      header={{
        title: t('okms_list'),
        changelogButton: <SecretManagerChangelogButton />,
        guideMenu: <SecretManagerGuidesButton />,
      }}
      breadcrumb={
        <Breadcrumb>
          <RootBreadcrumbItem />
        </Breadcrumb>
      }
      message={notifications.length > 0 ? <Notifications /> : undefined}
    >
      <div className="space-y-6">
        <RegionSelector />
        <OkmsDatagrid
          type="secret-manager"
          isLoading={isLoading}
          okmsList={okmsList}
          topbar={
            <Button
              onClick={() => {
                navigate(SECRET_MANAGER_ROUTES_URLS.createSecret);
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
      </div>
    </BaseLayout>
  );
}
