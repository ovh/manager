import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
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
import { isRegionInUs } from '@/components/RegionSelector/region-selector.utils';

export const Ipv4Order: React.FC = () => {
  const {
    ipVersion,
    selectedService,
    selectedServiceType,
    selectedOffer,
    selectedRegion,
    selectedPlanCode,
    selectedGeolocation,
    addDisabledService,
  } = React.useContext(OrderContext);

  const { environment } = React.useContext(ShellContext);

  const { serviceStatus } = useCheckServiceAvailability({
    serviceName: selectedService,
    serviceType: selectedServiceType,
    onServiceUnavailable: addDisabledService,
  });

  const { region } = useServiceRegion({
    serviceName: selectedService,
    serviceType: selectedServiceType,
  });

  const computedRegion = region ?? selectedRegion;

  const isOrganisationSectionVisible =
    !!selectedService &&
    serviceStatus === 'ok' &&
    selectedOffer === IpOffer.blockAdditionalIp &&
    selectedServiceType !== ServiceType.dedicatedCloud &&
    !!selectedPlanCode &&
    !!computedRegion &&
    !!selectedGeolocation &&
    !(
      environment.user.ovhSubsidiary === OvhSubsidiary.US &&
      !isRegionInUs(computedRegion) &&
      [ServiceType.ipParking, ServiceType.vrack].includes(selectedServiceType)
    );

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
      !!selectedGeolocation,
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
