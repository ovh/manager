import React from 'react';

import { OvhSubsidiary } from '@ovh-ux/muk';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { isRegionInUs } from '@/components/RegionSelector/region-selector.utils';
import { useCheckServiceAvailability } from '@/data/hooks/useCheckServiceAvailability';
import { useServiceRegion } from '@/data/hooks/useServiceRegion';
import { IpVersion, ServiceType } from '@/types';

import { IpOffer } from './order.constant';
import { OrderContext } from './order.context';
import { GeolocationSection } from './sections/GeolocationSection.component';
import { OfferSelectionSection } from './sections/OfferSelectionSection.component';
import { OrderButtonSection } from './sections/OrderButtonSection.component';
import { OrganisationSection } from './sections/OrganisationSection.component';
import { RegionSelectionSection } from './sections/RegionSelectionSection.component';
import { ServiceSelectionSection } from './sections/ServiceSelectionSection.component';

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
      (environment.user.ovhSubsidiary as OvhSubsidiary) === OvhSubsidiary.US &&
      !isRegionInUs(computedRegion) &&
      [ServiceType.ipParking, ServiceType.vrack].includes(
        selectedServiceType as ServiceType,
      )
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
