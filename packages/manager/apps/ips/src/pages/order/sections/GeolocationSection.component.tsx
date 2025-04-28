import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import { OrderSection } from '../../../components/OrderSection/OrderSection.component';
import { useAvailableGeolocationFromPlanCode } from '@/data/hooks/catalog';
import { OrderContext } from '../order.context';
import { IpOffer } from '../order.constant';
import { CountrySelector } from '@/components/CountrySelector/country-selector.component';
import { ServiceType } from '@/types';

export const GeolocationSection: React.FC = () => {
  const {
    selectedService,
    selectedPlanCode,
    selectedGeolocation,
    selectedServiceType,
    setSelectedGeolocation,
    selectedOffer,
  } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const { geolocations } = useAvailableGeolocationFromPlanCode({
    serviceName: selectedService,
    serviceType: selectedServiceType,
    planCode: selectedPlanCode,
  });
  const isDisabled =
    !geolocations ||
    geolocations.length < 2 ||
    (selectedOffer === IpOffer.additionalIp &&
      ServiceType.ipParking === selectedServiceType);

  return (
    <OrderSection
      title={t('geolocation_selection_title')}
      description={t(
        isDisabled
          ? 'geolocation_disabled_selection_description'
          : 'geolocation_selection_description',
      )}
    >
      <React.Suspense fallback={<OdsSkeleton />}>
        <CountrySelector
          name="ip-geolocation"
          className="max-w-[384px]"
          countryCodeList={geolocations}
          isDisabled={isDisabled}
          value={
            selectedGeolocation && geolocations.includes(selectedGeolocation)
              ? selectedGeolocation
              : geolocations?.[0]
          }
          onChange={(event) => {
            setSelectedGeolocation(event.target.value as string);
          }}
        />
      </React.Suspense>
    </OrderSection>
  );
};
