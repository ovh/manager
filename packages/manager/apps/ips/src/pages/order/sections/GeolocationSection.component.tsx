import React from 'react';
import { useTranslation } from 'react-i18next';
import { OrderSection } from '../../../components/OrderSection/OrderSection.component';
import { useAvailableGeolocationFromPlanCode } from '@/data/hooks/catalog';
import { OrderContext } from '../order.context';
import { IpOffer } from '../order.constant';
import { CountrySelector } from '@/components/CountrySelector/country-selector.component';

export const GeolocationSection: React.FC = () => {
  const {
    selectedPlanCode,
    selectedGeolocation,
    setSelectedGeolocation,
    selectedOffer,
  } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const { geolocations } = useAvailableGeolocationFromPlanCode(
    selectedPlanCode,
  );

  return (
    <OrderSection
      title={t('geolocation_selection_title')}
      description={t('geolocation_selection_description')}
    >
      <CountrySelector
        name="ip-geolocation"
        countryCodeList={geolocations}
        isDisabled={selectedOffer === IpOffer.additionalIp}
        value={selectedGeolocation}
        onChange={(event) =>
          setSelectedGeolocation(event.target.value as string)
        }
      />
    </OrderSection>
  );
};
