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
    selectedPlanCode,
    selectedGeolocation,
    selectedServiceType,
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
      <React.Suspense fallback={<OdsSkeleton />}>
        <CountrySelector
          name="ip-geolocation"
          className="max-w-[384px]"
          countryCodeList={geolocations}
          isDisabled={
            selectedOffer === IpOffer.additionalIp &&
            selectedServiceType === ServiceType.ipParking
          }
          value={selectedGeolocation}
          onChange={(event) =>
            setSelectedGeolocation(event.target.value as string)
          }
        />
      </React.Suspense>
    </OrderSection>
  );
};
