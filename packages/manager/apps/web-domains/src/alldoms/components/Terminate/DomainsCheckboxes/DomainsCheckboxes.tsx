import React from 'react';
import { OdsCheckbox } from '@ovhcloud/ods-components/react';
import { TDomainsInfo } from '@/alldoms/types';

interface DomainsCheckboxesProps {
  domainsAttached: TDomainsInfo[];
  domainAttachedChecked: string[];
  handleDomainAttached: (domainSelected: string[]) => void;
}

export default function DomainsCheckboxes({
  domainsAttached,
  domainAttachedChecked,
  handleDomainAttached,
}: DomainsCheckboxesProps) {
  return (
    <div className="flex flex-col gap-y-2 pl-9">
      {domainsAttached.map(({ name }) => (
        <div key={name} className="flex items-center gap-x-4">
          <OdsCheckbox
            name={name}
            inputId={name}
            isChecked={domainAttachedChecked.includes(name)}
            onOdsChange={(e) => {
              const updatedCheckedDomains = e.detail.checked
                ? [...domainAttachedChecked, name]
                : domainAttachedChecked.filter(
                    (domainChecked) => domainChecked !== name,
                  );
              handleDomainAttached(updatedCheckedDomains);
            }}
            data-testid={`checkbox-${name}`}
          />
          <label htmlFor={name}>{name}</label>
        </div>
      ))}
    </div>
  );
}
