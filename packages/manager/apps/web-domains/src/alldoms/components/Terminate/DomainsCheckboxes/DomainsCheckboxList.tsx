import React from 'react';
import { TDomainsInfo } from '@/alldoms/types';
import DomainsCheckboxItem from './DomainCheckboxItem';

interface DomainsCheckboxesProps {
  readonly domainsAttached: TDomainsInfo[];
  readonly domainAttachedChecked: string[];
  readonly handleDomainAttached: (domainSelected: string[]) => void;
}

export default function DomainsCheckboxList({
  domainsAttached,
  domainAttachedChecked,
  handleDomainAttached,
}: DomainsCheckboxesProps) {
  return (
    <div className="flex flex-col gap-y-2 pl-9">
      {domainsAttached.map(({ name }) => (
        <DomainsCheckboxItem
          domainName={name}
          domainAttachedChecked={domainAttachedChecked}
          handleDomainAttached={handleDomainAttached}
          key={name}
        />
      ))}
    </div>
  );
}
