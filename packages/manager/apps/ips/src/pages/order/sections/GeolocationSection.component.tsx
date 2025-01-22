import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSelect } from '@ovhcloud/ods-components/react';
import { OrderSection } from '../../../components/OrderSection/OrderSection.component';
import { useAvailableGeolocationFromPlanCode } from '@/data/hooks/catalog';
import { OrderContext } from '../order.context';
import { IpOffer } from '../order.constant';

export const GeolocationSection: React.FC = () => {
  const {
    selectedPlanCode,
    selectedGeolocation,
    setSelectedGeolocation,
    selectedOffer,
  } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const { t: tRegionSelector } = useTranslation('region-selector');
  const { geolocations } = useAvailableGeolocationFromPlanCode(
    selectedPlanCode,
  );

  return (
    <OrderSection
      title={t('geolocation_selection_title')}
      description={t('geolocation_selection_description')}
    >
      <OdsSelect
        key={geolocations.join('-')}
        className="block w-full max-w-[384px]"
        name="ip-geolocation"
        isDisabled={selectedOffer === IpOffer.additionalIp}
        onOdsChange={(event) =>
          setSelectedGeolocation(event.target.value as string)
        }
        value={selectedGeolocation}
        customRenderer={{
          option: (data) => `<div style="display: flex">
            <span>${tRegionSelector(
              `region-selector-country-name_${data.value}`,
            )}</span>
            <span style="width: 32px; height: 24px; margin: auto 15px auto auto; background-image: url('flags/${
              data.value
            }.svg')"></span>
          </div>`,
        }}
      >
        {geolocations.map((country) => (
          <option key={country} value={country}>
            {tRegionSelector(`region-selector-country-name_${country}`)}
          </option>
        ))}
      </OdsSelect>
    </OrderSection>
  );
};
