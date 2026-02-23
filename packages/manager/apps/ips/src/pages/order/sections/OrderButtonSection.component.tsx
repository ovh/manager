import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { useOrderURL } from '@ovh-ux/manager-module-order';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { useIpv6PlanCode } from '@/data/hooks/catalog/useIpv6PlanCode';
import { useServiceRegion } from '@/data/hooks/useServiceRegion';
import { urls } from '@/routes/routes.constant';
import { IpVersion, ServiceType } from '@/types';

import { MAX_IP_QUANTITY, MIN_IP_QUANTITY } from '../order.constant';
import { OrderContext } from '../order.context';
import {
  getAdditionalIpsProductSettings,
  getVrackBandwidthUpgradeProductSettings,
} from '../order.utils';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { Links, useNotifications } from '@ovh-ux/manager-react-components';
import {
  DEFAULT_BANDWIDTH_PLAN_CODE,
  getUpgradedBandwidth,
  postUpgradeBandwidth,
  useDeleteService,
} from '@ovh-ux/manager-network-common';

export const OrderButtonSection: React.FC = () => {
  const {
    ipVersion,
    selectedService,
    selectedServiceType,
    selectedOffer,
    selectedRegion,
    selectedVrackBandwidthPlanCode,
    selectedPlanCode,
    selectedGeolocation,
    selectedOrganisation,
    ipQuantity,
    pricingMode,
  } = React.useContext(OrderContext);
  const { t } = useTranslation(TRANSLATION_NAMESPACES.order);
  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();
  const { terminateService } = useDeleteService({ force: true });
  const { region } = useServiceRegion({
    serviceName: selectedService,
    serviceType: selectedServiceType,
  });
  const ipv6PlanCode = useIpv6PlanCode({
    region: selectedRegion,
    ipVersion: ipVersion,
  });
  const orderBaseUrl = useOrderURL('express_review_base');
  const { trackClick } = useOvhTracking();

  return (
    <div className="flex gap-4">
      <OdsButton
        isDisabled={
          !ipQuantity ||
          ipQuantity > MAX_IP_QUANTITY ||
          ipQuantity < MIN_IP_QUANTITY
        }
        color={ODS_BUTTON_COLOR.primary}
        size={ODS_BUTTON_SIZE.md}
        label={t('order_button_label')}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={async () => {
          const settings = getAdditionalIpsProductSettings({
            ipVersion: ipVersion,
            geolocation: selectedGeolocation,
            offer: selectedOffer,
            organisation: selectedOrganisation,
            planCode:
              ipVersion === IpVersion.ipv6 ? ipv6PlanCode : selectedPlanCode,
            region: [ServiceType.ipParking, ServiceType.vrack].includes(
              selectedServiceType,
            )
              ? selectedRegion
              : region,
            serviceName: selectedService,
            serviceType: selectedServiceType,
            quantity: ipQuantity,
            pricingMode,
          });

          let url = `${orderBaseUrl}?products=~(${settings})`;

          // Add bandwidth to order if it's an upgrade or downgrade to non-default bandwidth
          if (selectedServiceType === ServiceType.vrack) {
            try {
              const upgradedBandwidth = await getUpgradedBandwidth();

              const selectedVrackBandwidthServiceName = upgradedBandwidth.data.find(
                (service) =>
                  service.includes(selectedService || '') &&
                  service.includes(selectedRegion || ''),
              );

              // Delete bandwidth service if it's a downgrade to default bandwidth
              if (
                selectedVrackBandwidthPlanCode ===
                  DEFAULT_BANDWIDTH_PLAN_CODE &&
                !!selectedVrackBandwidthServiceName
              ) {
                terminateService({
                  resourceName: selectedVrackBandwidthServiceName,
                });
              }

              // Upgrade or downgrade bandwidth to non-default option
              if (
                selectedVrackBandwidthPlanCode &&
                selectedVrackBandwidthPlanCode !== DEFAULT_BANDWIDTH_PLAN_CODE
              ) {
                if (!!selectedVrackBandwidthServiceName) {
                  // from non-default bandwidth
                  const upgradeBandwidthRequest = await postUpgradeBandwidth({
                    serviceName: selectedVrackBandwidthServiceName,
                    planCode: selectedVrackBandwidthPlanCode,
                  });

                  const secondaryOrderUrl =
                    upgradeBandwidthRequest.data.order.url;
                  window.open(
                    secondaryOrderUrl,
                    '_blank',
                    'noopener,noreferrer',
                  );

                  addSuccess(
                    <Trans
                      t={t}
                      i18nKey="upgrade_bandwidth_order_success_message"
                      components={{
                        Link: (
                          <Links
                            onClickReturn={() => {
                              window.open(
                                secondaryOrderUrl,
                                '_blank',
                                'noopener,noreferrer',
                              );
                            }}
                          />
                        ),
                      }}
                    />,
                    true,
                  );
                } else {
                  // from default bandwidth
                  const vrackBandwidthSettings = getVrackBandwidthUpgradeProductSettings(
                    {
                      planCode: selectedVrackBandwidthPlanCode,
                      serviceName: selectedService,
                    },
                  );

                  url = `${orderBaseUrl}?products=~(${settings}${vrackBandwidthSettings})`;
                }
              }
            } catch {
              addError(t('upgrade_bandwidth_order_error_message'), true);
            }
          }

          window.open(url, '_blank', 'noopener,noreferrer');

          trackClick({
            actionType: 'action',
            buttonType: ButtonType.button,
            location: PageLocation.funnel,
            actions: [
              'order_ip',
              'confirm',
              `Ip-version_${ipVersion?.toLowerCase()}`,
              selectedGeolocation ? `Ip-location_${selectedGeolocation}` : '',
            ].filter(Boolean),
          });

          navigate(urls.listing);

          addSuccess(
            <Trans
              t={t}
              i18nKey="ip_order_success_message"
              components={{
                Link: (
                  <Links
                    onClickReturn={() => {
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                  />
                ),
              }}
            />,
            true,
          );
        }}
      />
      <OdsButton
        color={ODS_BUTTON_COLOR.primary}
        size={ODS_BUTTON_SIZE.md}
        variant={ODS_BUTTON_VARIANT.ghost}
        label={t('cancel_button_label')}
        onClick={() => {
          trackClick({
            actionType: 'action',
            buttonType: ButtonType.button,
            location: PageLocation.funnel,
            actions: [
              'order_ip',
              'cancel',
              `Ip-version_${ipVersion?.toLowerCase()}`,
              selectedGeolocation ? `Ip-location_${selectedGeolocation}` : '',
            ].filter(Boolean),
          });
          navigate(urls.listing);
        }}
      />
    </div>
  );
};
