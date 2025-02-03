import React from 'react';
import { ServiceSelectionSection } from './sections/ServiceSelectionSection.component';
import { OrderContext } from './order.context';
import { IpOffer, IpVersion } from './order.constant';
import { RegionSelectionSection } from './sections/RegionSelectionSection.component';
import { OfferSelectionSection } from './sections/OfferSelectionSection.component';
import { GeolocationSection } from './sections/GeolocationSection.component';
import { OrganisationSection } from './sections/OrganisationSection.component';
import { ServiceType } from '@/types';

export const Ipv4Order: React.FC = () => {
  const {
    ipVersion,
    selectedService,
    selectedServiceType,
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
      {[ServiceType.ipParking, ServiceType.vrack].includes(
        selectedServiceType,
      ) &&
        !!selectedService && <RegionSelectionSection />}
      {!!selectedService && !!selectedRegion && <OfferSelectionSection />}
      {!!selectedService &&
        !!selectedOffer &&
        !!selectedRegion &&
        !!selectedPlanCode && <GeolocationSection />}
      {selectedOffer === IpOffer.blockAdditionalIp &&
        !!selectedService &&
        !!selectedOffer &&
        !!selectedRegion &&
        !!selectedPlanCode &&
        !!selectedGeolocation && <OrganisationSection />}
    </>
  );
};
