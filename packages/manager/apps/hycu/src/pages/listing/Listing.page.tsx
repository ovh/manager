import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Badge,
  BADGE_SIZE,
  Link,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Skeleton,
  ICON_NAME,
} from '@ovhcloud/ods-react';
import {
  BaseLayout,
  Button,
  Datagrid,
  Notifications,
  RedirectionGuard,
  Text,
  useDataApi,
  useFormatDate,
  DatagridColumn,
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  TEXT_PRESET,
} from '@ovh-ux/muk';
import { useServiceDetails } from '@ovh-ux/manager-module-common-api';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import HYCU_CONFIG from '@/hycu.config';
import { IHycuDetails } from '@/types/hycu.details.interface';

import { urls, subRoutes } from '@/routes/routes.constant';
import HycuActionMenu from './menu/HycuActionMenu.component';
import { getStatusColor } from '@/utils/statusColor';
import { TRACKING } from '@/tracking.constant';

/* ========= datagrid cells ========= */
const DatagridErrorCell = () => {
  const { t } = useTranslation('hycu/listing');

  return (
    <Text preset={TEXT_PRESET.span}>
      <Text preset={TEXT_PRESET.paragraph}>
        {t('hycu_listing_error_loading_data')}
      </Text>
    </Text>
  );
};

const DatagridIdCell = ({ hycuDetails }: { hycuDetails: IHycuDetails }) => {
  const navigate = useNavigate();

  return (
    <Text preset={TEXT_PRESET.span}>
      <Link
        onClick={() =>
          navigate(
            urls.dashboard.replace(
              subRoutes.serviceName,
              hycuDetails.serviceName,
            ),
          )
        }
      >
        {hycuDetails?.iam.displayName ?? hycuDetails.serviceName}
      </Link>
    </Text>
  );
};

const DatagridControllerIdCell = ({
  hycuDetails,
}: {
  hycuDetails: IHycuDetails;
}) => {
  return (
    <Text
      preset={TEXT_PRESET.span}
      className={hycuDetails.controllerId ? '' : 'block w-full text-center'}
    >
      {hycuDetails.controllerId || '-'}
    </Text>
  );
};

const DatagridStatusCell = ({ hycuDetails }: { hycuDetails: IHycuDetails }) => {
  const { t } = useTranslation('hycu');

  return (
    <Text preset={TEXT_PRESET.span}>
      <Badge
        className="whitespace-nowrap"
        color={getStatusColor(hycuDetails.licenseStatus)}
        size={BADGE_SIZE.sm}
      >
        {t([`hycu_status_${hycuDetails.licenseStatus}`, 'hycu_status_error'])}
      </Badge>
    </Text>
  );
};

const DatagridCommercialNameCell = ({
  hycuDetails,
}: {
  hycuDetails: IHycuDetails;
}) => {
  const { data: serviceDetails, isLoading, isError } = useServiceDetails({
    resourceName: hycuDetails.serviceName,
  });

  if (isError) return <DatagridErrorCell />;

  return (
    <Text preset={TEXT_PRESET.span}>
      {isLoading ? (
        <Skeleton />
      ) : (
        serviceDetails?.data.resource.product.description
      )}
    </Text>
  );
};

const DatagridCreatedDateCell = ({
  hycuDetails,
}: {
  hycuDetails: IHycuDetails;
}) => {
  const { data: serviceDetails, isLoading, isError } = useServiceDetails({
    resourceName: hycuDetails.serviceName,
  });
  const creationDate =
    serviceDetails?.data.billing.lifecycle.current.creationDate;
  const formattedDate = useFormatDate()({
    date: creationDate,
    format: 'dd/MMM/yyyy',
  });

  if (isError) return <DatagridErrorCell />;

  return (
    <Text preset={TEXT_PRESET.span}>
      {isLoading ? <Skeleton /> : formattedDate}
    </Text>
  );
};

const DatagridActionCell = ({ hycuDetails }: { hycuDetails: IHycuDetails }) => {
  return (
    <Text preset={TEXT_PRESET.span}>
      <HycuActionMenu serviceName={hycuDetails.serviceName} />
    </Text>
  );
};

export default function Listing() {
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const { t } = useTranslation([
    'hycu/listing',
    'hycu',
    NAMESPACES.ERROR,
    NAMESPACES.ACTIONS,
    NAMESPACES.DASHBOARD,
    NAMESPACES.STATUS,
  ]);
  const {
    flattenData,
    isError,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    status,
    sorting,
  } = useDataApi({
    version: 'v6',
    iceberg: true,
    route: '/license/hycu',
    cacheKey: ['/license/hycu', 'list'],
    enabled: true,
  });

  const columns = useMemo<DatagridColumn<Record<string, unknown>>[]>(() => {
    return [
      {
        id: 'id',
        header: t(`${NAMESPACES.DASHBOARD}:name`),
        label: t(`${NAMESPACES.DASHBOARD}:name`),
        isSortable: false,
        accessorKey: 'serviceName',
        cell: ({ row }) => (
          <DatagridIdCell
            hycuDetails={(row?.original as unknown) as IHycuDetails}
          />
        ),
      },
      {
        id: 'controllerId',
        header: t('hycu_controller_id'),
        label: t('hycu_controller_id'),
        accessorKey: 'controllerId',
        cell: ({ row }) => (
          <DatagridControllerIdCell
            hycuDetails={(row?.original as unknown) as IHycuDetails}
          />
        ),
      },
      {
        id: 'status',
        header: t(`${NAMESPACES.STATUS}:status`),
        label: t(`${NAMESPACES.STATUS}:status`),
        accessorKey: 'licenseStatus',
        cell: ({ row }) => (
          <DatagridStatusCell
            hycuDetails={(row?.original as unknown) as IHycuDetails}
          />
        ),
      },
      {
        id: 'commercialName',
        header: t('hycu_commercial_name'),
        label: t('hycu_commercial_name'),
        accessorKey: 'serviceName',
        isSortable: false,
        cell: ({ row }) => (
          <DatagridCommercialNameCell
            hycuDetails={(row?.original as unknown) as IHycuDetails}
          />
        ),
      },
      {
        id: 'subscribedDate',
        header: t('hycu_subscribed_date'),
        label: t('hycu_subscribed_date'),
        accessorKey: 'serviceName',
        isSortable: false,
        cell: ({ row }) => (
          <DatagridCreatedDateCell
            hycuDetails={(row?.original as unknown) as IHycuDetails}
          />
        ),
      },
      {
        id: 'actions',
        header: '',
        label: '',
        isSortable: false,
        cell: ({ row }) => (
          <DatagridActionCell
            hycuDetails={(row?.original as unknown) as IHycuDetails}
          />
        ),
        accessorKey: 'serviceName',
        size: 48,
      },
    ];
  }, []);

  const header = {
    title: HYCU_CONFIG.rootLabel,
  };

  return (
    <>
      <RedirectionGuard
        isLoading={isLoading || !flattenData}
        condition={status === 'success' && flattenData?.length === 0}
        route={urls.onboarding}
        isError={isError}
        errorComponent={
          <Message className="mt-4" color={MESSAGE_COLOR.critical}>
            <MessageIcon name={ICON_NAME.hexagonExclamation}></MessageIcon>
            <MessageBody>
              {t(`${NAMESPACES.ERROR}:error_loading_page`)}
            </MessageBody>
          </Message>
        }
      >
        <Notifications />
        <BaseLayout header={header} description={t('hycu:hycu_description')}>
          <React.Suspense>
            <div className="flex flex-col gap-4">
              <div>
                <Button
                  color={BUTTON_COLOR.primary}
                  size={BUTTON_SIZE.md}
                  variant={BUTTON_VARIANT.outline}
                  onClick={() => {
                    trackClick(TRACKING.listing.orderClick);
                    navigate(urls.order);
                  }}
                >
                  {t(`${NAMESPACES.ACTIONS}:order`)}
                </Button>
              </div>
              {columns && flattenData && (
                <Datagrid
                  columns={columns}
                  data={flattenData}
                  totalCount={totalCount || 0}
                  hasNextPage={hasNextPage && !isLoading}
                  onFetchNextPage={fetchNextPage}
                  sorting={sorting}
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
