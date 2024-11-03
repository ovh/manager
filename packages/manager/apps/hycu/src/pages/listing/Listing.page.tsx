import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';

import {
  OsdsButton,
  OsdsChip,
  OsdsMessage,
  OsdsSkeleton,
} from '@ovhcloud/ods-components/react';
import {
  Datagrid,
  DataGridTextCell,
  useResourcesIcebergV6,
  RedirectionGuard,
  BaseLayout,
  Links,
  useServiceDetails,
  Notifications,
} from '@ovh-ux/manager-react-components';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_CHIP_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import {
  DateFormat,
  useFormattedDate,
} from '@ovh-ux/manager-react-components/src/hooks/date/useFormattedDate';
import HYCU_CONFIG from '@/hycu.config';
import { IHycuDetails } from '@/types/hycu.details.interface';

import { urls, subRoutes } from '@/routes/routes.constant';
import HycuActionMenu from './menu/HycuActionMenu.component';
import { getStatusColor } from '@/utils/statusColor';

/* ========= datagrid cells ========= */
const DatagridIdCell = (hycuDetail: IHycuDetails) => {
  const navigate = useNavigate();

  return (
    <DataGridTextCell>
      <Links
        onClickReturn={() =>
          navigate(
            urls.dashboard.replace(
              subRoutes.serviceName,
              hycuDetail.serviceName,
            ),
          )
        }
        label={hycuDetail?.iam.serviceName ?? hycuDetail.serviceName}
      ></Links>
    </DataGridTextCell>
  );
};

const DatagridControllerIdCell = (hycuDetail: IHycuDetails) => {
  return (
    <DataGridTextCell
      className={hycuDetail.controllerId ? '' : 'block w-full text-center'}
    >
      {hycuDetail.controllerId || '-'}
    </DataGridTextCell>
  );
};

const DatagridStatusCell = (hycuDetail: IHycuDetails) => {
  const { t } = useTranslation('hycu');

  return (
    <DataGridTextCell>
      <OsdsChip
        className="whitespace-nowrap"
        color={getStatusColor(hycuDetail.licenseStatus)}
        size={ODS_CHIP_SIZE.sm}
        inline
      >
        {t([`hycu_status_${hycuDetail.licenseStatus}`, 'hycu_status_error'])}
      </OsdsChip>
    </DataGridTextCell>
  );
};

const DatagridCommercialNameCell = (hycuDetail: IHycuDetails) => {
  const { data: serviceDetails, isLoading } = useServiceDetails({
    resourceName: hycuDetail.serviceName,
  });

  return (
    <DataGridTextCell>
      {isLoading ? (
        <OsdsSkeleton />
      ) : (
        serviceDetails?.data.resource.product.description
      )}
    </DataGridTextCell>
  );
};

const DatagridCreatedDateCell = (hycuDetail: IHycuDetails) => {
  const { data: serviceDetails, isLoading } = useServiceDetails({
    resourceName: hycuDetail.serviceName,
  });
  const creationDate =
    serviceDetails?.data.billing.lifecycle.current.creationDate;
  const formattedDate = useFormattedDate({
    dateString: creationDate as string,
    format: DateFormat.compact,
  });

  return (
    <DataGridTextCell>
      {isLoading ? <OsdsSkeleton></OsdsSkeleton> : formattedDate}
    </DataGridTextCell>
  );
};

const DatagridActionCell = (hycuDetail: IHycuDetails) => {
  return (
    <DataGridTextCell>
      <HycuActionMenu serviceName={hycuDetail.serviceName} />
    </DataGridTextCell>
  );
};

export default function Listing() {
  const navigate = useNavigate();
  const { t } = useTranslation('hycu/listing');
  const { t: tCommon } = useTranslation('hycu');
  const { t: tError } = useTranslation('hycu/error');
  const {
    flattenData,
    isError,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    status,
    sorting,
    setSorting,
  } = useResourcesIcebergV6({
    route: '/license/hycu',
    queryKey: ['/license/hycu', 'list'],
  });

  const columns = useMemo(() => {
    return [
      {
        id: 'name',
        label: t('hycu_name'),
        cell: DatagridIdCell,
      },
      {
        id: 'controller_id',
        label: t('hycu_controller_id'),
        cell: DatagridControllerIdCell,
      },
      {
        id: 'status',
        label: t('hycu_status'),
        cell: DatagridStatusCell,
      },
      {
        id: 'commercial_name',
        label: t('hycu_commercial_name'),
        cell: DatagridCommercialNameCell,
      },
      {
        id: 'subscribed_date',
        label: t('hycu_subscribed_date'),
        cell: DatagridCreatedDateCell,
      },
      {
        id: 'action',
        label: '',
        cell: DatagridActionCell,
      },
    ];
  }, []);

  const header = {
    title: HYCU_CONFIG.rootLabel,
    description: tCommon('hycu_description'),
  };

  return (
    <>
      <RedirectionGuard
        isLoading={isLoading || !flattenData}
        condition={status === 'success' && flattenData?.length === 0}
        route={urls.onboarding}
        isError={isError}
        errorComponent={
          <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.error}>
            {tError('manager_error_page_default')}
          </OsdsMessage>
        }
      >
        <Notifications />
        <BaseLayout header={header}>
          <React.Suspense>
            <div className="flex flex-col gap-4">
              <div>
                <OsdsButton
                  color={ODS_THEME_COLOR_INTENT.primary}
                  variant={ODS_BUTTON_VARIANT.stroked}
                  size={ODS_BUTTON_SIZE.sm}
                  onClick={() => {
                    navigate(urls.order);
                  }}
                  inline
                >
                  {t('hycu_order')}
                </OsdsButton>
              </div>
              {columns && flattenData && (
                <Datagrid
                  columns={columns}
                  items={flattenData}
                  totalItems={totalCount || 0}
                  hasNextPage={hasNextPage && !isLoading}
                  onFetchNextPage={fetchNextPage}
                  sorting={sorting}
                  onSortChange={setSorting}
                />
              )}
            </div>
          </React.Suspense>
        </BaseLayout>
      </RedirectionGuard>
      <Outlet />
    </>
  );
}
