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
import { urls } from '@/routes/routes.constant';

export const OrderButtonSection: React.FC = () => {
  const {
    ipVersion,
    selectedService,
    selectedOffer,
    selectedRegion,
    selectedPlanCode,
    selectedGeolocation,
    selectedOrganisation,
  } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const navigate = useNavigate();

  const orderBaseUrl = useOrderURL('express_review_base');

  if (
    !ipVersion ||
    !selectedService ||
    !selectedOffer ||
    !selectedRegion ||
    !selectedPlanCode ||
    !selectedGeolocation ||
    !selectedOrganisation
  ) {
    return <></>;
  }

  return (
    <div className="flex gap-3">
      <OdsButton
        color={ODS_BUTTON_COLOR.primary}
        size={ODS_BUTTON_SIZE.md}
        label={t('order_button_label')}
        onClick={() => {
          const settings = getAdditionalIpsProductSettings({
            ipVersion,
            geolocation: selectedGeolocation,
            offer: selectedOffer,
            organisation: selectedOrganisation,
            planCode: selectedPlanCode,
            region: selectedRegion,
            serviceName: selectedService,
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
