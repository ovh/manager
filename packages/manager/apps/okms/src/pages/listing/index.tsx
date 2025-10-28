import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_MESSAGE_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_COLOR,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsMessage } from '@ovhcloud/ods-components/react';
import {
  BaseLayout,
  Notifications,
  RedirectionGuard,
  useNotifications,
  HeadersProps,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useOkmsDatagridList } from '@/data/hooks/useOkms';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import { useAutoRefetch } from '@/data/hooks/useAutoRefetch';
import { okmsQueryKeys } from '@/data/api/okms';
import kmsListingTestIds from './KmsListing.constants';
import { KmsChangelogButton } from '@/components/kmsChangelogButton/KmsChangelogButton.component';
import { OkmsDatagrid } from '@/common/components/okmsDatagrid/OkmsDatagrid.component';

export default function Listing() {
  const { t } = useTranslation('key-management-service/listing');
  const { t: tError } = useTranslation('error');
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { trackClick } = useOvhTracking();
  const { state } = useLocation();
  const [isRefetchEnabled, setIsRefetchEnabled] = useState<boolean>(
    state?.hasPendingOrder,
  );

  const {
    data,
    flattenData,
    isError,
    isLoading,
    status,
    fetchNextPage,
    hasNextPage,
  } = useOkmsDatagridList({ pageSize: 10 });
  const okmsList = flattenData || [];

  useAutoRefetch({
    queryKey: okmsQueryKeys.listDatagrid,
    enabled: isRefetchEnabled,
    onFinish: () => setIsRefetchEnabled(false),
  });

  const headerProps: HeadersProps = {
    title: t('key_management_service_listing_title'),
    headerButton: <KmsGuidesHeader />,
    changelogButton: <KmsChangelogButton />,
  };

  return (
    <RedirectionGuard
      isLoading={isLoading || !flattenData}
      condition={
        status === 'success' &&
        !isRefetchEnabled &&
        data?.pages[0].data.length === 0
      }
      route={KMS_ROUTES_URLS.kmsOnboarding}
      isError={isError}
      errorComponent={
        <OdsMessage className="mt-4" color={ODS_MESSAGE_COLOR.critical}>
          {tError('manager_error_page_default')}
        </OdsMessage>
      }
    >
      <BaseLayout header={headerProps} message={<Notifications />}>
        <div className="flex flex-col gap-6">
          <OdsButton
            className="w-fit"
            size={ODS_BUTTON_SIZE.sm}
            color={ODS_BUTTON_COLOR.primary}
            onClick={() => {
              clearNotifications();
              trackClick({
                location: PageLocation.page,
                buttonType: ButtonType.button,
                actionType: 'navigation',
                actions: ['create_kms'],
              });
              navigate(KMS_ROUTES_URLS.kmsCreate);
            }}
            label={t('key_management_service_listing_add_kms_button')}
            data-testid={kmsListingTestIds.ctaOrder}
          />

          <OkmsDatagrid
            type="kms"
            okmsList={okmsList}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            onFetchNextPage={() => fetchNextPage()}
          />
        </div>
        <Outlet />
      </BaseLayout>
    </RedirectionGuard>
  );
}
