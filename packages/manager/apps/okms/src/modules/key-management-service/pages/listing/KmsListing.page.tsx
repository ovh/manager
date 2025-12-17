import { Outlet, useNavigate } from 'react-router-dom';

import KmsGuidesHeader from '@key-management-service/components/guide/KmsGuidesHeader';
import { KmsChangelogButton } from '@key-management-service/components/kms-changelog-button/KmsChangelogButton.component';
import { useOkmsDatagridList } from '@key-management-service/data/hooks/useOkms';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_SIZE, ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsButton, OdsMessage } from '@ovhcloud/ods-components/react';

import {
  BaseLayout,
  HeadersProps,
  Notifications,
  RedirectionGuard,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { OkmsDatagrid } from '@/common/components/okms-datagrid/OkmsDatagrid.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { usePendingOkmsOrder } from '@/common/hooks/usePendingOkmsOrder/usePendingOkmsOrder';

import kmsListingTestIds from './KmsListing.constants';

export default function Listing() {
  const { t } = useTranslation(['key-management-service/listing', 'common']);
  const { t: tError } = useTranslation('error');
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();

  const { clearNotifications, notifications } = useNotifications();
  const { hasPendingOrder } = usePendingOkmsOrder();
  const hasNotifications = notifications.length > 0 || hasPendingOrder;

  const { data, isError, isPending, fetchNextPage, hasNextPage } = useOkmsDatagridList({
    pageSize: 10,
  });
  const flattenData = data?.pages.flatMap((page) => page.data);
  const okmsList = flattenData || [];

  const headerProps: HeadersProps = {
    title: t('key_management_service_listing_title'),
    headerButton: <KmsGuidesHeader />,
    changelogButton: <KmsChangelogButton />,
  };

  return (
    <RedirectionGuard
      isLoading={isPending}
      // Do not redirect if there is a pending order
      condition={!hasPendingOrder && okmsList.length === 0}
      route={KMS_ROUTES_URLS.kmsOnboarding}
      isError={isError}
      errorComponent={
        <OdsMessage className="mt-4" color={ODS_MESSAGE_COLOR.critical}>
          {tError('manager_error_page_default')}
        </OdsMessage>
      }
    >
      <BaseLayout
        header={headerProps}
        message={
          hasNotifications ? (
            <div>
              {hasPendingOrder && (
                <OdsMessage color="information" className="mb-4" isDismissible={false}>
                  {t('common:okms_order_pending')}
                </OdsMessage>
              )}
              <Notifications />
            </div>
          ) : undefined
        }
      >
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
                actions: ['create', 'okms'],
              });
              navigate(KMS_ROUTES_URLS.kmsCreate);
            }}
            label={t('key_management_service_listing_add_kms_button')}
            data-testid={kmsListingTestIds.ctaOrder}
          />

          <OkmsDatagrid
            type="kms"
            okmsList={okmsList}
            isLoading={isPending}
            hasNextPage={hasNextPage}
            onFetchNextPage={() => fetchNextPage()}
          />
        </div>
        <Outlet />
      </BaseLayout>
    </RedirectionGuard>
  );
}
