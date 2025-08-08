import React from 'react';
import { TServiceInfo } from '@/alldoms/types';
import DomainsCheckboxItem from '@/alldoms/components/terminate/DomainsCheckboxes/DomainCheckboxItem';
import { hasTerminateAtExpirationDateAction } from '@/alldoms/utils/utils';

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
          isDisabled={hasTerminateAtExpirationDateAction(
            service.billing.lifecycle.current.pendingActions ?? [],
          )}
          domainsChecked={domainsChecked}
          handleDomainAttached={handleDomainAttached}
          key={service.serviceId}
        />
      ))}
    </div>
  );
}
