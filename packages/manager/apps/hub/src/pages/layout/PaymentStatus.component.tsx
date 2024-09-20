import React, { lazy, Suspense, useContext } from 'react';
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
import { BillingService } from '@/types/billingServices.type';
import useDateFormat from '@/hooks/dateFormat/useDateFormat';

const TileError = lazy(() =>
  import('@/components/tile-error/TileError.component'),
);
const BillingStatus = lazy(() =>
  import('@/components/billing-status/BillingStatus.component'),
);
const ServicesActions = lazy(() =>
  import('@/components/services-actions/ServicesActions.component'),
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
  const count = data?.count;

  return (
    <OsdsTile className="w-full block p-4" inline data-testid="payment-status">
      <div className="flex mb-2 gap-4 items-center">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.primary}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          className="block"
          size={ODS_TEXT_SIZE._400}
        >
          {t('ovh_manager_hub_payment_status_tile_title')}
        </OsdsText>
        <OsdsChip
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_CHIP_SIZE.sm}
        >
          {count}
        </OsdsChip>
        <div className="ml-auto flex items-center gap-4">
          {autorenewLink && (
            <Suspense
              fallback={
                <OsdsSkeleton data-testid="my_services_link_skeleton" />
              }
            >
              <Await
                resolve={autorenewLink}
                children={(link: string) => (
                  <OsdsLink
                    href={link}
                    target={OdsHTMLAnchorElementTarget._top}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    className="font-bold text-right"
                  >
                    {tCommon('manager_hub_see_all')}
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
      {!isLoading && !services.length && (
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
        <OsdsTable className="block">
          <table className="table-auto">
            <tbody>
              {!isLoading &&
                services.map((service: BillingService) => (
                  <tr key={service.id}>
                    <td scope="row">
                      {service.url ? (
                        <OsdsLink
                          href={service.url}
                          onClick={trackServiceAccess}
                          target={OdsHTMLAnchorElementTarget._top}
                          color={ODS_THEME_COLOR_INTENT.primary}
                        >
                          {service.domain}
                        </OsdsLink>
                      ) : (
                        <OsdsText
                          className="text-center mt-8"
                          level={ODS_TEXT_LEVEL.body}
                          size={ODS_TEXT_SIZE._400}
                          color={ODS_THEME_COLOR_INTENT.text}
                        >
                          {service.domain}
                        </OsdsText>
                      )}
                      <OsdsText
                        className="text-center mt-8"
                        level={ODS_TEXT_LEVEL.caption}
                        size={ODS_TEXT_SIZE._200}
                        color={ODS_THEME_COLOR_INTENT.text}
                      >
                        {tProducts(
                          `manager_hub_products_${service.serviceType}`,
                        )}
                      </OsdsText>
                    </td>
                    <td scope="row">
                      <div className="lg:inline mb-1">
                        <Suspense fallback={<OsdsSkeleton />}>
                          <BillingStatus service={service} />
                        </Suspense>
                      </div>
                      {!service.isBillingSuspended() && (
                        <div className="d-lg-inline mb-1">
                          {service.isOneShot() &&
                            !service.isResiliated() &&
                            !service.hasPendingResiliation() && <span>-</span>}
                          {service.hasManualRenew() &&
                            !service.isResiliated() &&
                            !service.hasDebt() && (
                              <span>
                                {t(
                                  'ovh_manager_hub_payment_status_tile_before',
                                  {
                                    date: format(service.formattedExpiration),
                                  },
                                )}
                              </span>
                            )}
                          {service.isResiliated() ||
                            (service.hasPendingResiliation() && (
                              <span>
                                {t(
                                  'ovh_manager_hub_payment_status_tile_renew',
                                  {
                                    date: format(service.formattedExpiration),
                                  },
                                )}
                              </span>
                            ))}
                          {service.hasAutomaticRenewal() &&
                            !service.isOneShot() &&
                            !service.hasDebt() &&
                            !service.isResiliated() &&
                            !service.hasPendingResiliation() && (
                              <span>{format(service.formattedExpiration)}</span>
                            )}
                          {service.hasDebt() && (
                            <span>
                              {t('ovh_manager_hub_payment_status_tile_now')}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    {autorenewLink && (
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
                    )}
                  </tr>
                ))}
              {isLoading &&
                [1, 2, 3, 4].map((index) => (
                  <tr key={`payment_status_skeleton_line_${index}`}>
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
