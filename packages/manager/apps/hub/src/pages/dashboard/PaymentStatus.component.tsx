import { Suspense, lazy, useContext } from 'react';

import { Await } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_LEVEL } from '@ovhcloud/ods-common-theming';
import {
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SKELETON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsChip,
  OsdsIcon,
  OsdsLink,
  OsdsSkeleton,
  OsdsTable,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';

import { ShellContext, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BillingService } from '@/billing/types/billingServices.type';
import { useFetchHubBillingServices } from '@/data/hooks/billingServices/useBillingServices';
import useDateFormat from '@/hooks/dateFormat/useDateFormat';
import { useHubContext } from '@/pages/dashboard/context';
import { BILLING_FEATURE } from '@/pages/dashboard/dashboard.constants';

const TileError = lazy(() => import('@/components/tile-error/TileError.component'));
const BillingStatus = lazy(
  () => import('@/billing/components/billing-status/BillingStatus.component'),
);
const ServicesActions = lazy(
  () => import('@/billing/components/services-actions/ServicesActions.component'),
);

export default function PaymentStatus() {
  const { t } = useTranslation('hub/payment-status');
  const { t: tProducts } = useTranslation('hub/products');
  const { t: tCommon } = useTranslation('hub');
  const { availability, isLoading, isFreshCustomer } = useHubContext();
  const {
    data,
    isLoading: areBillingServicesLoading,
    refetch,
  } = useFetchHubBillingServices({ enabled: !(isLoading || isFreshCustomer) });
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const { trackClick } = useOvhTracking();
  const { format } = useDateFormat({
    options: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  });

  const autorenewLink = availability?.[BILLING_FEATURE]
    ? navigation.getURL('dedicated', '#/billing/autorenew', {})
    : null;

  const trackServiceAccess = () => {
    trackClick({
      actionType: 'action',
      actions: ['activity', 'payment-status', 'go-to-service'],
    });
  };

  const services = data?.services;
  const count = data?.count || 0;

  return (
    (isLoading || !isFreshCustomer) && (
      <OsdsTile className="w-full flex flex-col p-6" inline data-testid="payment_status">
        <div className="flex mb-2 gap-4 items-start">
          <OsdsText
            className="block flex-1 mb-6"
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_TEXT_SIZE._400}
            hue={ODS_TEXT_COLOR_HUE._800}
            color={ODS_THEME_COLOR_INTENT.primary}
            data-testid="payment_status_title"
          >
            {t('ovh_manager_hub_payment_status_tile_title')}
            {isLoading || areBillingServicesLoading ? (
              <OsdsSkeleton
                data-testid="payment_status_badge_skeleton"
                inline
                size={ODS_SKELETON_SIZE.xs}
              />
            ) : (
              <OsdsChip
                className="ml-4"
                color={ODS_THEME_COLOR_INTENT.primary}
                inline={true}
                size={ODS_CHIP_SIZE.sm}
                data-testid="payment_status_badge"
              >
                {count}
              </OsdsChip>
            )}
          </OsdsText>
          {autorenewLink && (
            <Suspense
              fallback={
                <OsdsSkeleton
                  data-testid="my_services_link_skeleton"
                  inline
                  size={ODS_SKELETON_SIZE.xs}
                />
              }
            >
              <Await
                resolve={autorenewLink}
                children={(link: string) => (
                  <OsdsLink
                    slot="actions"
                    href={link}
                    target={OdsHTMLAnchorElementTarget._top}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    className="font-bold text-right"
                    data-testid="my_services_link"
                  >
                    {tCommon('hub_support_see_more')}
                    <span slot="end">
                      <OsdsIcon
                        hoverable
                        name={ODS_ICON_NAME.ARROW_RIGHT}
                        size={ODS_ICON_SIZE.xs}
                        color={ODS_THEME_COLOR_INTENT.primary}
                      />
                    </span>
                  </OsdsLink>
                )}
              />
            </Suspense>
          )}
        </div>
        {isLoading || areBillingServicesLoading ? (
          <OsdsTable className="block overflow-visible" data-testid="payment_status_skeleton_table">
            <table className="table-auto">
              <tbody>
                {[1, 2, 3, 4].map((line: number) => (
                  <tr
                    key={`billing_service_skeleton_${line}`}
                    data-testid="payment_status_skeleton_table_row"
                  >
                    <td scope="row" className="!p-5">
                      <OsdsSkeleton
                        className="block mb-3"
                        data-testid="service_name_skeleton"
                        inline
                        size={ODS_SKELETON_SIZE.xs}
                      />
                      <OsdsSkeleton
                        className="block"
                        data-testid="service_category_skeleton"
                        inline
                        size={ODS_SKELETON_SIZE.xs}
                      />
                    </td>
                    <td scope="row" className="!p-5">
                      <div className="lg:inline mb-1">
                        <OsdsSkeleton
                          className="block mb-5"
                          data-testid="service_status_skeleton"
                          inline
                          size={ODS_SKELETON_SIZE.xs}
                        />
                      </div>
                      <div className="lg:inline mb-1" data-testid="service_expiration_date_message">
                        <OsdsSkeleton
                          className="block"
                          data-testid="service_date_skeleton"
                          inline
                          size={ODS_SKELETON_SIZE.xs}
                        />
                      </div>
                    </td>
                    <td>
                      <OsdsSkeleton
                        data-testid="service_link_skeleton"
                        inline
                        size={ODS_SKELETON_SIZE.xs}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </OsdsTable>
        ) : (
          <>
            {!services ? (
              <Suspense fallback={<OsdsSkeleton data-testid="tile_error_skeleton" inline />}>
                <TileError
                  contrasted
                  message={t('ovh_manager_hub_payment_status_tile_error')}
                  refetch={refetch}
                />
              </Suspense>
            ) : (
              <>
                {services?.length === 0 ? (
                  <OsdsText
                    className="text-center mt-8"
                    level={ODS_TEXT_LEVEL.subheading}
                    size={ODS_TEXT_SIZE._200}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {t('ovh_manager_hub_payment_status_tile_no_services')}
                  </OsdsText>
                ) : (
                  <OsdsTable className="block overflow-visible" data-testid="payment_status_table">
                    <table className="table-auto">
                      <tbody>
                        {services.map((service: BillingService) => (
                          <tr key={`billing_service_${service.id}`} data-testid="billing_service">
                            <td scope="row" className="!p-4">
                              {service.url ? (
                                <OsdsLink
                                  className="block mb-3"
                                  href={service.url}
                                  onClick={trackServiceAccess}
                                  target={OdsHTMLAnchorElementTarget._top}
                                  color={ODS_THEME_COLOR_INTENT.primary}
                                >
                                  {service.domain}
                                </OsdsLink>
                              ) : (
                                <OsdsText
                                  level={ODS_TEXT_LEVEL.body}
                                  size={ODS_TEXT_SIZE._400}
                                  color={ODS_THEME_COLOR_INTENT.text}
                                >
                                  {service.domain}
                                </OsdsText>
                              )}
                              <OsdsText
                                className="mb-0"
                                level={ODS_TEXT_LEVEL.caption}
                                size={ODS_TEXT_SIZE._200}
                                color={ODS_THEME_COLOR_INTENT.text}
                              >
                                {tProducts(`manager_hub_products_${service.serviceType}`)}
                              </OsdsText>
                            </td>
                            <td scope="row" className="!p-4">
                              <div className="lg:inline mb-1">
                                <Suspense
                                  fallback={
                                    <OsdsSkeleton
                                      className="mb-5"
                                      data-testid="billing_status_skeleton"
                                    />
                                  }
                                >
                                  <BillingStatus service={service} />
                                </Suspense>
                              </div>
                              {!service.isBillingSuspended() && (
                                <div
                                  className="lg:inline mb-1"
                                  data-testid="service_expiration_date_message"
                                >
                                  {service.isOneShot() &&
                                    !service.isResiliated() &&
                                    !service.hasPendingResiliation() && (
                                      <span data-testid="service_without_expiration_date">-</span>
                                    )}
                                  {service.hasManualRenew() &&
                                    !service.isResiliated() &&
                                    !service.hasDebt() && (
                                      <span data-testid="service_valid_until_date">
                                        {t('ovh_manager_hub_payment_status_tile_before', {
                                          date: format(service.formattedExpiration),
                                        })}
                                      </span>
                                    )}
                                  {(service.isResiliated() || service.hasPendingResiliation()) && (
                                    <span data-testid="service_with_termination_date">
                                      {t('ovh_manager_hub_payment_status_tile_renew', {
                                        date: format(service.formattedExpiration),
                                      })}
                                    </span>
                                  )}
                                  {service.hasAutomaticRenewal() &&
                                    !service.isOneShot() &&
                                    !service.hasDebt() &&
                                    !service.isResiliated() &&
                                    !service.hasPendingResiliation() && (
                                      <span data-testid="service_with_expiration_date">
                                        {format(service.formattedExpiration)}
                                      </span>
                                    )}
                                  {service.hasDebt() && (
                                    <span data-testid="service_with_debt">
                                      {t('ovh_manager_hub_payment_status_tile_now')}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                            {autorenewLink && (
                              <td>
                                <Suspense
                                  fallback={
                                    <OsdsSkeleton data-testid="services_actions_skeleton" />
                                  }
                                >
                                  <Await
                                    resolve={autorenewLink}
                                    children={(link: string) => (
                                      <ServicesActions
                                        service={service}
                                        autoRenewLink={link}
                                        trackingPrefix={['activity', 'payment-status']}
                                      />
                                    )}
                                  />
                                </Suspense>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </OsdsTable>
                )}
              </>
            )}
          </>
        )}
      </OsdsTile>
    )
  );
}
