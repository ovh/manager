import React, { FunctionComponent, Suspense, useContext, useMemo } from 'react';
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
import { useFetchLastOrder } from '@/data/hooks/apiOrder/useLastOrder';
import {
  ERROR_STATUS,
  WAITING_PAYMENT_LABEL,
} from '@/data/api/apiOrder/apiOrder.constants';
import useDateFormat from '@/hooks/dateFormat/useDateFormat';
import { LastOrderTrackingResponse, OrderHistory } from '@/types/order.type';
// FIXME: lazy load these comoponents
import { Skeletons } from '@/components/skeletons/Skeletons.component';
import TileError from '@/components/tile-error/TileError.component';

export default function HubOrderTracking() {
  const { t } = useTranslation('hub/order');
  const {
    data: orderDataResponse,
    isLoading,
    error,
    refetch,
  } = useFetchLastOrder();
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

  const getInitialStatus = (orderData: LastOrderTrackingResponse) => ({
    date: orderData.date,
    label:
      orderData.status === 'delivered'
        ? 'INVOICE_IN_PROGRESS'
        : 'custom_creation',
  });

  const getLatestStatus = (history: OrderHistory[]) => {
    return history.reduce((latest, item) => {
      return new Date(item.date).getTime() > new Date(latest.date).getTime()
        ? item
        : latest;
    });
  };

  const currentStatus = useMemo(() => {
    if (!orderDataResponse) return undefined;
    if (!orderDataResponse.history.length)
      return getInitialStatus(orderDataResponse);
    return getLatestStatus(orderDataResponse.history);
  }, [orderDataResponse]);

  const isWaitingPayment = currentStatus?.label === WAITING_PAYMENT_LABEL;

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

  if (error)
    return (
      <TileError
        message={t('hub_order_tracking_error')}
        className={`block p-1`}
        refetch={refetch}
      />
    );

  return (
    <OsdsTile
      className="block p-1 bg-[var(--ods-color-primary-200)]"
      variant={ODS_TILE_VARIANT.ghost}
      inline
    >
      <div className="bg-500 !flex flex-col gap-1 items-center justifier-center">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.primary}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          className="block"
          size={ODS_TEXT_SIZE._300}
        >
          {t('hub_order_tracking_title')}
        </OsdsText>

        {isLoading ? (
          <Skeletons />
        ) : (
          <>
            <Suspense fallback={<OsdsSkeleton inline randomized />}>
              <Await
                resolve={orderTrackingLinkAsync}
                children={(orderTrackingLink: string) => (
                  <OsdsLink
                    href={orderTrackingLink}
                    target={OdsHTMLAnchorElementTarget._blank}
                    rel={OdsHTMLAnchorElementRel.noreferrer}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    className="font-bold text-right flex flex-col items-center justifier-center mb-6"
                  >
                    <span
                      slot="start"
                      className="flex flex-col items-center justifier-center"
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
                color={ODS_THEME_COLOR_INTENT.text}
                className="block font-bold mr-1"
              >
                {format(new Date(currentStatus.date))}
              </OsdsText>
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                className="block mr-1"
              >
                {t(`order_tracking_history_${currentStatus.label}`)}
              </OsdsText>
              <OsdsIcon
                size={ODS_ICON_SIZE.xxs}
                color={ODS_THEME_COLOR_INTENT.text}
                name={
                  !ERROR_STATUS.includes(currentStatus.label) &&
                  !isWaitingPayment
                    ? ODS_ICON_NAME.OK
                    : ODS_ICON_NAME.CLOSE
                }
              ></OsdsIcon>
            </div>
            <div>
              <Suspense fallback={<OsdsSkeleton inline randomized />}>
                <Await
                  resolve={ordersTrackingLinkAsync}
                  children={(ordersTrackingLink: string) => (
                    <OsdsLink
                      href={ordersTrackingLink}
                      target={OdsHTMLAnchorElementTarget._top}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      onClick={handleSeeAll}
                      className="font-bold mb-1 flex flex-col items-center justifier-center"
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
            </div>
          </>
        )}
      </div>
    </OsdsTile>
  );
}
