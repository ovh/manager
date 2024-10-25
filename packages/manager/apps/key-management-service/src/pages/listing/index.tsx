import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_MESSAGE_TYPE,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  BaseLayout,
  Datagrid,
  HeadersProps,
  Notifications,
  RedirectionGuard,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useOKMSList } from '@/data/hooks/useOKMS';
import { ROUTES_URLS } from '@/routes/routes.constants';
import {
  DatagridActionMenu,
  DatagridCellId,
  DatagridCellName,
  DatagridCellRegion,
  DatagridCellStatus,
} from '@/components/Listing/ListingCells';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';

export default function Listing() {
  const { t } = useTranslation('key-management-service/listing');
  const { t: tError } = useTranslation('error');
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { trackClick } = useOvhTracking();

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
      cell: DatagridActionMenu,
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

  const headerProps: HeadersProps = {
    title: t('key_management_service_listing_title'),
    headerButton: <KmsGuidesHeader />,
  };

  return (
    <RedirectionGuard
      isLoading={isLoading || !flattenData}
      condition={status === 'success' && data?.pages[0].data.length === 0}
      route={ROUTES_URLS.onboarding}
      isError={isError}
      errorComponent={
        <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.error}>
          {tError('manager_error_page_default')}
        </OsdsMessage>
      }
    >
      <BaseLayout header={headerProps} message={<Notifications />}>
        <div className={'flex mb-3 mt-6'}>
          <OsdsButton
            className="mr-1"
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
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
          >
            {t('key_management_service_listing_add_kms_button')}
          </OsdsButton>
        </div>
        {flattenData && (
          <div className={'mt-8'}>
            <Datagrid
              columns={columns}
              items={flattenData}
              totalItems={flattenData.length || 0}
              hasNextPage={hasNextPage}
              onFetchNextPage={() => fetchNextPage()}
              contentAlignLeft
            />
          </div>
        )}
        <Outlet />
      </BaseLayout>
    </RedirectionGuard>
  );
}
