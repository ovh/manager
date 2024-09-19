import React, { lazy, Suspense, useContext } from 'react';
import {
  OsdsLink,
  OsdsSkeleton,
  OsdsTable,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_SKELETON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useFetchHubBillingServices } from '@/data/hooks/billingServices/useBillingServices';
import { BillingService } from '@/types/billingServices.type';

const TileError = lazy(() =>
  import('@/components/tile-error/TileError.component'),
);

type PaymentStatusProps = {
  canManageBilling: boolean;
};

export default function PaymentStatus({
  canManageBilling,
}: PaymentStatusProps) {
  const { t } = useTranslation('hub/payment');
  const {
    data: { services, count },
    isLoading,
    refetch,
  } = useFetchHubBillingServices();
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const { trackClick } = useOvhTracking();

  const autorenewLink = canManageBilling
    ? navigation.getURL('dedicated', '#/billing/autorenew', {})
    : null;

  const trackServiceAccess = () => {
    trackClick({
      actionType: 'action',
      actions: ['activity', 'payment-status', 'go-to-service'],
    });
  };

  return (
    <OsdsTile data-testid="payment-status">
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
                        {t(`manager_hub_products_${service.serviceType}`)}
                      </OsdsText>
                    </td>
                    <td scope="row">
                      <div className="d-lg-inline mb-1">
                        {service.isOneShot() &&
                          !service.isResiliated() &&
                          !service.hasPendingResiliation() && <span>-</span>}
                        {service.hasManualRenew() &&
                          !service.isResiliated() &&
                          !service.hasDebt() && (
                            <span>
                              {t('ovh_manager_hub_payment_status_tile_before', {
                                date: service.formattedExpiration,
                              })}
                            </span>
                          )}
                        {service.isResiliated() ||
                          (service.hasPendingResiliation() && (
                            <span>
                              {t('ovh_manager_hub_payment_status_tile_renew', {
                                date: service.formattedExpiration,
                              })}
                            </span>
                          ))}
                        {service.hasAutomaticRenewal() &&
                          !service.isOneShot() &&
                          !service.hasDebt() &&
                          !service.isResiliated() &&
                          !service.hasPendingResiliation() && (
                            <span>
                              {service.formattedExpiration.toDateString()}
                            </span>
                          )}
                        {service.hasDebt() && (
                          <span>
                            {t('ovh_manager_hub_payment_status_tile_now')}
                          </span>
                        )}
                      </div>
                    </td>
                    {autorenewLink && <td scope="row"></td>}
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
