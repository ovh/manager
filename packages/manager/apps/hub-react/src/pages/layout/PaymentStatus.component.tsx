import { lazy, Suspense, useContext } from 'react';
import {
  OsdsChip,
  OsdsIcon,
  OsdsLink,
  OsdsSkeleton,
  OsdsTable,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
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
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { Await } from 'react-router-dom';
import { useFetchHubBillingServices } from '@/data/hooks/billingServices/useBillingServices';
import { BillingService } from '@/billing/types/billingServices.type';
import useDateFormat from '@/hooks/dateFormat/useDateFormat';

const TileError = lazy(() =>
  import('@/components/tile-error/TileError.component'),
);
const BillingStatus = lazy(() =>
  import('@/billing/components/billing-status/BillingStatus.component'),
);
const ServicesActions = lazy(() =>
  import('@/billing/components/services-actions/ServicesActions.component'),
);

type PaymentStatusProps = {
  canManageBilling: boolean;
};

export default function PaymentStatus({
  canManageBilling,
}: PaymentStatusProps) {
  const { t } = useTranslation('hub/payment-status');
  const { t: tProducts } = useTranslation('hub/products');
  const { t: tCommon } = useTranslation('hub');
  const { data, isLoading, refetch } = useFetchHubBillingServices();
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

  const autorenewLink = canManageBilling
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
    <OsdsTile
      className="w-full flex flex-col p-6"
      inline
      data-testid="payment_status"
    >
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
          <OsdsChip
            className="ml-4"
            color={ODS_THEME_COLOR_INTENT.primary}
            inline={true}
            size={ODS_CHIP_SIZE.sm}
            data-testid="payment_status_badge"
          >
            {count}
          </OsdsChip>
        </OsdsText>
        {autorenewLink && (
          <Suspense
            fallback={<OsdsSkeleton data-testid="my_services_link_skeleton" />}
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
      {!isLoading && !services && (
        <Suspense
          fallback={<OsdsSkeleton data-testid="tile_error_skeleton" inline />}
        >
          <TileError
            contrasted
            message={t('ovh_manager_hub_payment_status_tile_error')}
            refetch={refetch}
          />
        </Suspense>
      )}
      {!isLoading && services?.length === 0 && (
        <OsdsText
          className="text-center mt-8"
          level={ODS_TEXT_LEVEL.subheading}
          size={ODS_TEXT_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('ovh_manager_hub_payment_status_tile_no_services')}
        </OsdsText>
      )}
      {(isLoading || services) && (
        <OsdsTable
          className="block overflow-visible"
          data-testid="payment_status_table"
        >
          <table className="table-fixed">
            <tbody>
              {!isLoading &&
                services.map((service: BillingService) => (
                  <tr
                    key={`billing_service_${service.id}`}
                    data-testid="billing_service"
                  >
                    <td scope="row" className="!p-4 break-all">
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
                        {tProducts(
                          `manager_hub_products_${service.serviceType}`,
                        )}
                      </OsdsText>
                    </td>
                    <td scope="row" className="!p-4">
                      <div className="lg:inline mb-1">
                        <Suspense
                          fallback={
                            <OsdsSkeleton data-testid="billing_status_skeleton" />
                          }
                        >
                          <BillingStatus service={service} />
                        </Suspense>
                      </div>
                      {!service.isBillingSuspended() && (
                        <div
                          className="d-lg-inline mb-1"
                          data-testid="service_expiration_date_message"
                        >
                          {service.isOneShot() &&
                            !service.isResiliated() &&
                            !service.hasPendingResiliation() && (
                              <span data-testid="service_without_expiration_date">
                                -
                              </span>
                            )}
                          {service.hasManualRenew() &&
                            !service.isResiliated() &&
                            !service.hasDebt() && (
                              <span data-testid="service_valid_until_date">
                                {t(
                                  'ovh_manager_hub_payment_status_tile_before',
                                  {
                                    date: format(service.formattedExpiration),
                                  },
                                )}
                              </span>
                            )}
                          {(service.isResiliated() ||
                            service.hasPendingResiliation()) && (
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
                      <td className="xs:w-2/12">
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
              {isLoading &&
                [1, 2, 3, 4].map((index) => (
                  <tr
                    key={`payment_status_skeleton_line_${index}`}
                    data-testid="payment_status_skeleton_line"
                  >
                    <td>
                      <OsdsSkeleton
                        inline
                        size={ODS_SKELETON_SIZE.sm}
                      ></OsdsSkeleton>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </OsdsTable>
      )}
    </OsdsTile>
  );
}
