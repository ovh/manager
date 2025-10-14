import { lazy, Suspense, useContext, useMemo } from 'react';
import {
  OsdsChip,
  OsdsIcon,
  OsdsLink,
  OsdsSkeleton,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_TILE_VARIANT,
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_SIZE,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_SKELETON_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import {
  ButtonType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Await } from 'react-router-dom';
import { useLastOrderTracking } from '@/data/hooks/lastOrderTracking/useLastOrderTracking';
import {
  ERROR_STATUS,
  WAITING_PAYMENT_LABEL,
  NOT_PAID,
} from '@/data/api/order/order.constants';
import useDateFormat from '@/hooks/dateFormat/useDateFormat';
import { LastOrderTrackingResponse, OrderHistory } from '@/types/order.type';
import { useHubContext } from '@/pages/dashboard/context';

const TileError = lazy(() =>
  import('@/components/tile-error/TileError.component'),
);

export default function HubOrderTracking() {
  const { t } = useTranslation('hub/order');
  const { isLoading, isFreshCustomer } = useHubContext();
  const {
    data: orderDataResponse,
    isLoading: isLastOrderLoading,
    error,
    refetch,
  } = useLastOrderTracking();
  const context = useContext(ShellContext);
  const { navigation } = context.shell;
  const { trackClick } = useOvhTracking();

  const orderTrackingLinkAsync = useMemo(
    () =>
      navigation.getURL(
        'dedicated',
        `#/billing/order/${orderDataResponse?.orderId}`,
        {},
      ),
    [orderDataResponse?.orderId],
  );

  const ordersTrackingLinkAsync = useMemo(
    () => navigation.getURL('dedicated', `#/billing/orders`, {}),
    [],
  );

  const getInitialStatus = (orderData: LastOrderTrackingResponse) => {
    if (!orderData?.date || !orderData?.status) return undefined;
    return {
      date: orderData.date,
      label:
        orderData.status === 'delivered'
          ? 'INVOICE_IN_PROGRESS'
          : 'custom_creation',
    };
  };

  const getLatestStatus = (history: OrderHistory[]) => {
    return history.reduce((latest, item) => {
      return new Date(item.date).getTime() > new Date(latest.date).getTime()
        ? item
        : latest;
    });
  };

  const currentStatus = useMemo(() => {
    if (!orderDataResponse || isLastOrderLoading) return undefined;
    if (!orderDataResponse.history?.length)
      return getInitialStatus(orderDataResponse);
    return getLatestStatus(orderDataResponse.history);
  }, [orderDataResponse, isLastOrderLoading]);

  const displayedLabel = useMemo(() => {
    if (!currentStatus) return undefined;
    return orderDataResponse?.status === NOT_PAID
      ? WAITING_PAYMENT_LABEL
      : currentStatus.label;
  }, [currentStatus, orderDataResponse?.status]);

  const isWaitingPayment = displayedLabel === WAITING_PAYMENT_LABEL;

  const { format } = useDateFormat({
    options: {
      hourCycle: 'h23',
      dateStyle: 'short',
    },
  });

  const handleSeeAll = () => {
    trackClick({
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['activity', 'order', 'show-all'],
    });
  };

  return (
    (isLoading || !isFreshCustomer) && (
      <OsdsTile
        className="block bg-[var(--ods-color-primary-200)] p-6"
        variant={ODS_TILE_VARIANT.ghost}
        inline
      >
        <div className="bg-500 !flex flex-col gap-1 items-center justify-center">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.primary}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            className="block"
            size={ODS_TEXT_SIZE._300}
          >
            {t('hub_order_tracking_title')}
          </OsdsText>
          {isLoading || isLastOrderLoading ? (
            <>
              <div className="mb-6 h-[40px] flex flex-col justify-center">
                <OsdsSkeleton
                  data-testid="order_link_skeleton"
                  inline
                  size={ODS_SKELETON_SIZE.md}
                  className="h-[24px]"
                ></OsdsSkeleton>
              </div>
              <OsdsSkeleton
                inline
                randomized
                className="mb-6"
                data-testid="order_info_skeleton"
              ></OsdsSkeleton>
              <OsdsSkeleton
                inline
                randomized
                data-testid="orders_link_skeleton"
              ></OsdsSkeleton>
            </>
          ) : (
            <>
              {!error && orderDataResponse?.date && orderDataResponse?.status && (
                <>
                  <Suspense>
                    <Await
                      resolve={orderTrackingLinkAsync}
                      children={(orderTrackingLink: string) => (
                        <OsdsLink
                          href={orderTrackingLink}
                          target={OdsHTMLAnchorElementTarget._blank}
                          rel={OdsHTMLAnchorElementRel.noreferrer}
                          color={ODS_THEME_COLOR_INTENT.primary}
                          className="font-bold flex flex-col items-center justify-center mb-6 h-[40px]"
                        >
                          <span
                            slot="start"
                            className="flex flex-col items-center justify-center"
                          >
                            <OsdsChip
                              size={ODS_CHIP_SIZE.sm}
                              color={ODS_THEME_COLOR_INTENT.info}
                            >
                              {t('hub_order_tracking_order_id', {
                                orderId: orderDataResponse.orderId,
                              })}
                            </OsdsChip>
                          </span>
                        </OsdsLink>
                      )}
                    />
                  </Suspense>
                  <div className="mb-6 flex justify-center gap-3 items-center flex-wrap">
                    <OsdsText
                      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                      hue={ODS_TEXT_COLOR_HUE._800}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      className="inline-block mr-1"
                    >
                      <strong>{format(new Date(currentStatus.date))}</strong>
                      &nbsp;{t(`order_tracking_history_${displayedLabel}`)}
                    </OsdsText>
                    <span className="inline-block size-[16px]">
                      <OsdsIcon
                        size={ODS_ICON_SIZE.xxs}
                        color={ODS_THEME_COLOR_INTENT.text}
                        name={
                          !ERROR_STATUS.includes(displayedLabel) &&
                          !isWaitingPayment
                            ? ODS_ICON_NAME.OK
                            : ODS_ICON_NAME.CLOSE
                        }
                      ></OsdsIcon>
                    </span>
                  </div>
                  <Suspense>
                    <Await
                      resolve={ordersTrackingLinkAsync}
                      children={(ordersTrackingLink: string) => (
                        <OsdsLink
                          href={ordersTrackingLink}
                          target={OdsHTMLAnchorElementTarget._top}
                          color={ODS_THEME_COLOR_INTENT.primary}
                          onClick={handleSeeAll}
                          className="font-bold mb-1 flex flex-col items-center justify-center"
                        >
                          {t('hub_order_tracking_see_all')}
                          <span slot="end">
                            <OsdsIcon
                              size={ODS_ICON_SIZE.xs}
                              name={ODS_ICON_NAME.ARROW_RIGHT}
                              color={ODS_THEME_COLOR_INTENT.info}
                            />
                          </span>
                        </OsdsLink>
                      )}
                    />
                  </Suspense>
                </>
              )}
              {(error ||
                !orderDataResponse?.date ||
                !orderDataResponse?.status) && (
                <TileError
                  message={t('hub_order_tracking_error')}
                  className={`!p-1`}
                  refetch={refetch}
                />
              )}
            </>
          )}
        </div>
      </OsdsTile>
    )
  );
}
