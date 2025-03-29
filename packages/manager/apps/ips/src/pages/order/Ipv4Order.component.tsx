import React from 'react';
import { ServiceSelectionSection } from './sections/ServiceSelectionSection.component';
import { OrderContext } from './order.context';
import { IpOffer, IpVersion } from './order.constant';
import { RegionSelectionSection } from './sections/RegionSelectionSection.component';
import { OfferSelectionSection } from './sections/OfferSelectionSection.component';
import { GeolocationSection } from './sections/GeolocationSection.component';
import { OrganisationSection } from './sections/OrganisationSection.component';
import { OrderButtonSection } from './sections/OrderButtonSection.component';
import { useServiceRegion } from '@/data/hooks/useServiceRegion';
import { ServiceType } from '@/types';

export const Ipv4Order: React.FC = () => {
  const {
    ipVersion,
    selectedService,
    selectedServiceType,
    selectedOffer,
    selectedRegion,
    selectedPlanCode,
    selectedGeolocation,
    selectedOrganisation,
  } = React.useContext(OrderContext);
  const { region } = useServiceRegion({
    serviceName: selectedService,
    serviceType: selectedServiceType,
  });

  const isOrganisationSectionVisible =
    !!selectedService &&
    selectedOffer === IpOffer.blockAdditionalIp &&
    selectedServiceType !== ServiceType.dedicatedCloud &&
    !!selectedPlanCode &&
    !!(region || selectedRegion) &&
    !!selectedGeolocation;

  const visibleSections = {
    service: ipVersion === IpVersion.ipv4,
    region:
      !!selectedService &&
      [ServiceType.ipParking, ServiceType.vrack].includes(selectedServiceType),
    offer: !!selectedService && !!(selectedRegion || region),
    geolocation:
      !!selectedService &&
      !!selectedOffer &&
      !!selectedPlanCode &&
      !!(selectedRegion || region),
    organisation: isOrganisationSectionVisible,
    order:
      !!selectedService &&
      !!selectedServiceType &&
      !!(selectedRegion || region) &&
      !!selectedOffer &&
      !!selectedPlanCode &&
      !!selectedGeolocation &&
      (!isOrganisationSectionVisible || !!selectedOrganisation),
  };

  if (ipVersion !== IpVersion.ipv4) {
    return <></>;
  }

  return (
    <>
      {visibleSections.service && <ServiceSelectionSection />}
      {visibleSections.region && <RegionSelectionSection />}
      {visibleSections.offer && <OfferSelectionSection />}
      {visibleSections.geolocation && <GeolocationSection />}
      {visibleSections.organisation && <OrganisationSection />}
      {visibleSections.order && <OrderButtonSection />}
    </>
  );
};
