import React from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useCheckServiceAvailability } from '@/data/hooks/useCheckServiceAvailability';
import { IpVersion, ServiceType } from '@/types';

import { OrderContext } from './order.context';
import { AdditionalOptionsSection } from './sections/AdditionalOptionsSection.component';
import { OrderButtonSection } from './sections/OrderButtonSection.component';
import { RegionSelectionSection } from './sections/RegionSelectionSection.component';
import { ServiceSelectionSection } from './sections/ServiceSelectionSection.component';
import { VrackBandwidthSection } from './sections/VrackBandwidthSection.component';

export const Ipv6Order: React.FC = () => {
  const { environment } = React.useContext(ShellContext);
  const {
    ipVersion,
    selectedService,
    selectedServiceType,
    selectedRegion,
    selectedOptions,
    addDisabledService,
  } = React.useContext(OrderContext);

  const isUsUser = environment.user.ovhSubsidiary === 'US';

  const { serviceStatus } = useCheckServiceAvailability({
    serviceName: selectedService,
    serviceType: selectedServiceType,
    onServiceUnavailable: addDisabledService,
  });

  const visibleSections = {
    ipv6Options: ipVersion === IpVersion.ipv6,
    service: !!selectedOptions && selectedOptions.length > 0,
    region: !!selectedService && serviceStatus === 'ok',
    bandwidth:
      !isUsUser &&
      !!selectedService &&
      serviceStatus === 'ok' &&
      selectedServiceType === ServiceType.vrack &&
      !!selectedRegion,
    order:
      !!selectedOptions &&
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
      {visibleSections.bandwidth && <VrackBandwidthSection />}
      {visibleSections.order && <OrderButtonSection />}
    </>
  );
};
