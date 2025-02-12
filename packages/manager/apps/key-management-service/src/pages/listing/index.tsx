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
  ChangelogButton,
  Datagrid,
  Notifications,
  RedirectionGuard,
  useNotifications,
  HeadersProps
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useOKMSList } from '@/data/hooks/useOKMS';
import { ROUTES_URLS } from '@/routes/routes.constants';
import {
  DatagridCellId,
  DatagridCellName,
  DatagridCellRegion,
  DatagridCellStatus,
} from '@/components/Listing/ListingCells';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import { useAutoRefetch } from '@/data/hooks/useAutoRefetch';
import { getOkmsServicesResourceListQueryKey } from '@/data/api/okms';
import KmsActionMenu from '@/components/menu/KmsActionMenu.component';
import kmsListingTestIds from './KmsListing.constants';
import { CHANGELOG_LINKS } from '@/constants';

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

  const columns = [
    {
      id: 'name',
      cell: DatagridCellName,
      label: t('key_management_service_listing_name_cell'),
    },
    {
      id: 'id',
      cell: DatagridCellId,
      label: t('key_management_service_listing_id_cell'),
    },
    {
      id: 'region',
      cell: DatagridCellRegion,
      label: t('key_management_service_listing_region_cell'),
    },
    {
      id: 'status',
      cell: DatagridCellStatus,
      label: t('key_management_service_listing_status_cell'),
    },
    {
      id: 'action',
      cell: KmsActionMenu,
      isSortable: false,
      label: '',
    },
  ];

  const {
    data,
    flattenData,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    status,
  } = useOKMSList({
    pageSize: 10,
  });

  useAutoRefetch({
    queryKey: getOkmsServicesResourceListQueryKey,
    enabled: isRefetchEnabled,
    onFinish: () => setIsRefetchEnabled(false),
  });
  const headerProps: HeadersProps = {
    title: t('key_management_service_listing_title'),
    headerButton: <KmsGuidesHeader />,
    changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
  };

  return (
    <RedirectionGuard
      isLoading={isLoading || !flattenData}
      condition={
        status === 'success' &&
        !isRefetchEnabled &&
        data?.pages[0].data.length === 0
      }
      route={ROUTES_URLS.onboarding}
      isError={isError}
      errorComponent={
        <OdsMessage className="mt-4" color={ODS_MESSAGE_COLOR.critical}>
          {tError('manager_error_page_default')}
        </OdsMessage>
      }
    >
      <BaseLayout
        header={headerProps}
        message={<Notifications />}
      >
        <div className="flex flex-col gap-4">
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
              navigate(ROUTES_URLS.createKeyManagementService);
            }}
            label={t('key_management_service_listing_add_kms_button')}
            data-testid={kmsListingTestIds.ctaOrder}
          />
          {flattenData && (
            <Datagrid
              columns={columns}
              items={flattenData}
              totalItems={flattenData.length || 0}
              hasNextPage={hasNextPage}
              onFetchNextPage={() => fetchNextPage()}
              contentAlignLeft
            />
          )}
        </div>
        <Outlet />
      </BaseLayout>
    </RedirectionGuard>
  );
}
