import React from 'react';
import DomainsCheckboxItem from './DomainCheckboxItem';
import { TServiceInfo } from '@/alldoms/types';
import { LifecycleCapacitiesEnum } from '@/alldoms/enum/service.enum';

interface DomainsCheckboxesProps {
  readonly services: TServiceInfo[];
  readonly domainsChecked: string[];
  readonly handleDomainAttached: (domainSelected: string[]) => void;
}

export default function DomainsCheckboxList({
  services,
  domainsChecked,
  handleDomainAttached,
}: DomainsCheckboxesProps) {
  return (
    <div className="flex flex-col gap-y-2 pl-9">
      {services.map((service) => (
        <DomainsCheckboxItem
          serviceName={service.resource.name}
          isDisabled={service.billing.lifecycle.capacities.actions.includes(
            LifecycleCapacitiesEnum.TerminateAtExpirationDate,
          )}
          domainsChecked={domainsChecked}
          handleDomainAttached={handleDomainAttached}
          key={service.serviceId}
        />
      ))}
    </div>
  );
}
