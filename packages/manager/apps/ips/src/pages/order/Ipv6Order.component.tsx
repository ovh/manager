import React from 'react';
import { ServiceSelectionSection } from './sections/ServiceSelectionSection.component';
import { OrderContext } from './order.context';
import { IpVersion } from './order.constant';
import { RegionSelectionSection } from './sections/RegionSelectionSection.component';
import { OrderButtonSection } from './sections/OrderButtonSection.component';
import { AdditionalOptionsSection } from './sections/AdditionalOptionsSection.component';
import { useCheckServiceAvailability } from '@/data/hooks/useCheckServiceAvailability';

export const Ipv6Order: React.FC = () => {
  const {
    ipVersion,
    selectedService,
    selectedServiceType,
    selectedRegion,
    selectedOptions,
    addDisabledService,
  } = React.useContext(OrderContext);

  const { serviceStatus } = useCheckServiceAvailability({
    serviceName: selectedService,
    serviceType: selectedServiceType,
    onServiceUnavailable: addDisabledService,
  });

  const visibleSections = {
    ipv6Options: ipVersion === IpVersion.ipv6,
    service: selectedOptions.length > 0,
    region: !!selectedService && serviceStatus === 'ok',
    order:
      selectedOptions.length > 0 &&
      !!selectedService &&
      !!selectedRegion &&
      serviceStatus === 'ok',
  };

  if (ipVersion !== IpVersion.ipv6) {
    return <></>;
  }

  return (
    <>
      {visibleSections.ipv6Options && <AdditionalOptionsSection />}
      {visibleSections.service && <ServiceSelectionSection />}
      {visibleSections.region && <RegionSelectionSection />}
      {visibleSections.order && <OrderButtonSection />}
    </>
  );
};
