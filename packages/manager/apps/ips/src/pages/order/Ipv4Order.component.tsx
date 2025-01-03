import React from 'react';
import { ServiceSelectionSection } from './sections/ServiceSelectionSection.component';
import { OrderContext } from './order.context';
import { IpVersion } from './order.constant';
import { RegionSelectionSection } from './sections/RegionSelectionSection.component';
import { OfferSelectionSection } from './sections/OfferSelectionSection.component';
import { GeolocationSection } from './sections/GeolocationSection.component';
import { OrganisationSection } from './sections/OrganisationSection.component';

export const Ipv4Order: React.FC = () => {
  const {
    ipVersion,
    selectedService,
    selectedRegion,
    selectedOffer,
    selectedPlanCode,
    selectedGeolocation,
  } = React.useContext(OrderContext);

  if (ipVersion !== IpVersion.ipv4) {
    return <></>;
  }

  return (
    <>
      <ServiceSelectionSection />
      {!!selectedService && <RegionSelectionSection />}
      {!!selectedService && !!selectedRegion && <OfferSelectionSection />}
      {!!selectedService &&
        !!selectedOffer &&
        !!selectedRegion &&
        !!selectedPlanCode && <GeolocationSection />}
      {!!selectedService &&
        !!selectedOffer &&
        !!selectedRegion &&
        !!selectedPlanCode &&
        !!selectedGeolocation && <OrganisationSection />}
    </>
  );
};
