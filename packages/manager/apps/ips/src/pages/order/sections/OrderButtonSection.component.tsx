import React from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { useOrderURL } from '@ovh-ux/manager-module-order';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getAdditionalIpsProductSettings } from '../order.utils';
import { OrderContext } from '../order.context';
import { MIN_IP_QUANTITY, MAX_IP_QUANTITY, IpVersion } from '../order.constant';
import { urls } from '@/routes/routes.constant';
import { ServiceType } from '@/types';
import { useServiceRegion } from '@/data/hooks/useServiceRegion';
import { useIpv6PlanCode } from '@/data/hooks/catalog/useIpv6PlanCode';

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
  const ipv6PlanCode = useIpv6PlanCode({ region: selectedRegion, ipVersion });
  const orderBaseUrl = useOrderURL('express_review_base');

  return (
    <div className="flex gap-3">
      <OdsButton
        isDisabled={
          ipQuantity > MAX_IP_QUANTITY || ipQuantity < MIN_IP_QUANTITY
        }
        color={ODS_BUTTON_COLOR.primary}
        size={ODS_BUTTON_SIZE.md}
        label={t('order_button_label')}
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
          navigate(urls.listing);
        }}
      />
      <OdsButton
        color={ODS_BUTTON_COLOR.primary}
        size={ODS_BUTTON_SIZE.md}
        variant={ODS_BUTTON_VARIANT.ghost}
        label={t('cancel_button_label')}
        onClick={() => navigate(urls.listing)}
      />
    </div>
  );
};
