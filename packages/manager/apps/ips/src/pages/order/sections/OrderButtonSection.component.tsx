import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
} from '@ovhcloud/ods-react';

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
import { getAdditionalIpsProductSettings } from '../order.utils';

export const OrderButtonSection: React.FC = () => {
  const {
    ipVersion,
    selectedService,
    selectedServiceType,
    selectedOffer,
    selectedRegion,
    selectedPlanCode,
    selectedGeolocation,
    selectedOrganisation,
    ipQuantity,
    pricingMode,
  } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const navigate = useNavigate();
  const { region } = useServiceRegion({
    serviceName: selectedService,
    serviceType: selectedServiceType,
  });
  const ipv6PlanCode = useIpv6PlanCode({
    region: selectedRegion,
    ipVersion,
  });
  const orderBaseUrl = useOrderURL('express_review_base');
  const { trackClick } = useOvhTracking();

  return (
    <div className="flex gap-4">
      <Button
        disabled={
          !ipQuantity ||
          ipQuantity > MAX_IP_QUANTITY ||
          ipQuantity < MIN_IP_QUANTITY
        }
        color={BUTTON_COLOR.primary}
        size={BUTTON_SIZE.md}
        onClick={() => {
          const settings = getAdditionalIpsProductSettings({
            ipVersion,
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
          window.open(
            `${orderBaseUrl}?products=~(${settings})`,
            '_blank',
            'noopener,noreferrer',
          );
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
        }}
      >
        {t('order_button_label')}
      </Button>
      <Button
        color={BUTTON_COLOR.primary}
        size={BUTTON_SIZE.md}
        variant={BUTTON_VARIANT.ghost}
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
      >
        {t('cancel_button_label')}
      </Button>
    </div>
  );
};
