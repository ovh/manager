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
  HeadersProps,
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
  DatagridResourceKmipCountCell,
  DatagridResourceServiceKeyCountCell,
} from '@/components/Listing/ListingCells';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import { useAutoRefetch } from '@/data/hooks/useAutoRefetch';
import { getOkmsServicesResourceListQueryKey } from '@/data/api/okms';
import KmsActionMenu from '@/components/menu/KmsActionMenu.component';
import kmsListingTestIds from './KmsListing.constants';
import { CHANGELOG_LINKS, SERVICE_KEYS_LABEL } from '@/constants';
import { Drawer } from '@/components/drawer/Drawer';

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
      id: 'kmip_count',
      cell: DatagridResourceKmipCountCell,
      label: t('key_management_service_listing_kmip_cell'),
    },
    {
      id: 'servicekey_count',
      cell: DatagridResourceServiceKeyCountCell,
      label: SERVICE_KEYS_LABEL,
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

  const drawerRef1 = React.useRef(null);
  const drawerRef2 = React.useRef(null);

  const handleToggleDrawer1 = () => {
    if (drawerRef1.current) {
      drawerRef1.current.toggle();
    }
  };

  const handleToggleDrawer2 = () => {
    if (drawerRef2.current) {
      drawerRef2.current.toggle();
    }
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
      <BaseLayout header={headerProps} message={<Notifications />}>
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
          <OdsButton onClick={handleToggleDrawer1} label={'Toggle Drawer 1'} />
          <OdsButton onClick={handleToggleDrawer2} label={'Toggle Drawer 2'} />
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
      <Drawer ref={drawerRef1}>
        <div className="font-bold text-2xl">DRAWER 1</div>
      </Drawer>
      <Drawer ref={drawerRef2} position="left">
        <div className="font-bold text-2xl">DRAWER 2</div>
      </Drawer>
    </RedirectionGuard>
  );
}
