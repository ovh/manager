import React from 'react';
import { ServiceSelectionSection } from './sections/ServiceSelectionSection.component';
import { OrderContext } from './order.context';
import { IpVersion } from './order.constant';
import { RegionSelectionSection } from './sections/RegionSelectionSection.component';
import { OrderButtonSection } from './sections/OrderButtonSection.component';
import { AdditionalOptionsSection } from './sections/AdditionalOptionsSection.component';

export const Ipv6Order: React.FC = () => {
  const {
    ipVersion,
    selectedService,
    selectedRegion,
    selectedOptions,
  } = React.useContext(OrderContext);

  const visibleSections = {
    ipv6Options: ipVersion === IpVersion.ipv6,
    service: selectedOptions.length > 0,
    region: !!selectedService,
    order: selectedOptions.length > 0 && !!selectedService && !!selectedRegion,
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
