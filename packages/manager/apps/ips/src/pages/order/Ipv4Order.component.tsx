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
import { useCheckServiceAvailability } from '@/data/hooks/useCheckServiceAvailability';
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
    addDisabledService,
  } = React.useContext(OrderContext);

  const { serviceStatus } = useCheckServiceAvailability({
    serviceName: selectedService,
    serviceType: selectedServiceType,
    onServiceUnavailable: addDisabledService,
  });

  const { region } = useServiceRegion({
    serviceName: selectedService,
    serviceType: selectedServiceType,
  });

  const isOrganisationSectionVisible =
    !!selectedService &&
    serviceStatus === 'ok' &&
    selectedOffer === IpOffer.blockAdditionalIp &&
    selectedServiceType !== ServiceType.dedicatedCloud &&
    !!selectedPlanCode &&
    !!(region || selectedRegion) &&
    !!selectedGeolocation;

  const visibleSections = {
    service: ipVersion === IpVersion.ipv4,
    region:
      !!selectedService &&
      serviceStatus === 'ok' &&
      [ServiceType.ipParking, ServiceType.vrack].includes(selectedServiceType),
    offer:
      !!selectedService &&
      !!(selectedRegion || region) &&
      serviceStatus === 'ok',
    geolocation:
      !!selectedService &&
      serviceStatus === 'ok' &&
      !!selectedOffer &&
      !!selectedPlanCode &&
      !!(selectedRegion || region),
    organisation: isOrganisationSectionVisible,
    order:
      !!selectedService &&
      !!selectedServiceType &&
      serviceStatus === 'ok' &&
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
